/*
Switchbutton stuff
 */
(function($) {

    $.widget("sylightsUI.switchButton", {

        options: {
            checked: undefined,			// State of the switch

            show_labels: true,			// Should we show the on and off labels?
            labels_placement: "both", 	// Position of the labels: "both", "left" or "right"
            on_label: "ON",				// Text to be displayed when checked
            off_label: "OFF",			// Text to be displayed when unchecked

            width: 25,					// Width of the button in pixels
            height: 11,					// Height of the button in pixels
            button_width: 12,			// Width of the sliding part in pixels

            clear: true,				// Should we insert a div with style="clear: both;" after the switch button?
            clear_after: null,		    // Override the element after which the clearing div should be inserted (null > right after the button)
            on_callback: undefined,		//callback function that will be executed after going to on state
            off_callback: undefined		//callback function that will be executed after going to off state
        },

        _create: function() {
            // Init the switch from the checkbox if no state was specified on creation
            if (this.options.checked === undefined) {
                this.options.checked = this.element.prop("checked");
            }

            this._initLayout();
            this._initEvents();
        },

        _initLayout: function() {
            // Hide the receiver element
            this.element.hide();

            // Create our objects: two labels and the button
            this.off_label = $("<span>").addClass("switch-button-label");
            this.on_label = $("<span>").addClass("switch-button-label");

            this.button_bg = $("<div>").addClass("switch-button-background");
            this.button = $("<div>").addClass("switch-button-button");

            // Insert the objects into the DOM
            this.off_label.insertAfter(this.element);
            this.button_bg.insertAfter(this.off_label);
            this.on_label.insertAfter(this.button_bg);

            this.button_bg.append(this.button);

            // Insert a clearing element after the specified element if needed
            if(this.options.clear)
            {
                if (this.options.clear_after === null) {
                    this.options.clear_after = this.on_label;
                }
                $("<div>").css({
                    clear: "left"
                }).insertAfter(this.options.clear_after);
            }

            // Call refresh to update labels text and visibility
            this._refresh();

            // Init labels and switch state
            // This will animate all checked switches to the ON position when
            // loading... this is intentional!
            this.options.checked = !this.options.checked;
            this._toggleSwitch(true);
        },

        _refresh: function() {
            // Refresh labels display
            if (this.options.show_labels) {
                this.off_label.show();
                this.on_label.show();
            }
            else {
                this.off_label.hide();
                this.on_label.hide();
            }

            // Move labels around depending on labels_placement option
            switch(this.options.labels_placement) {
                case "both":
                {
                    // Don't move anything if labels are already in place
                    if(this.button_bg.prev() !== this.off_label || this.button_bg.next() !== this.on_label)
                    {
                        // Detach labels form DOM and place them correctly
                        this.off_label.detach();
                        this.on_label.detach();
                        this.off_label.insertBefore(this.button_bg);
                        this.on_label.insertAfter(this.button_bg);

                        // Update label classes
                        this.on_label.addClass(this.options.checked ? "on" : "off").removeClass(this.options.checked ? "off" : "on");
                        this.off_label.addClass(this.options.checked ? "off" : "on").removeClass(this.options.checked ? "on" : "off");

                    }
                    break;
                }

                case "left":
                {
                    // Don't move anything if labels are already in place
                    if(this.button_bg.prev() !== this.on_label || this.on_label.prev() !== this.off_label)
                    {
                        // Detach labels form DOM and place them correctly
                        this.off_label.detach();
                        this.on_label.detach();
                        this.off_label.insertBefore(this.button_bg);
                        this.on_label.insertBefore(this.button_bg);

                        // update label classes
                        this.on_label.addClass("on").removeClass("off");
                        this.off_label.addClass("off").removeClass("on");
                    }
                    break;
                }

                case "right":
                {
                    // Don't move anything if labels are already in place
                    if(this.button_bg.next() !== this.off_label || this.off_label.next() !== this.on_label)
                    {
                        // Detach labels form DOM and place them correctly
                        this.off_label.detach();
                        this.on_label.detach();
                        this.off_label.insertAfter(this.button_bg);
                        this.on_label.insertAfter(this.off_label);

                        // update label classes
                        this.on_label.addClass("on").removeClass("off");
                        this.off_label.addClass("off").removeClass("on");
                    }
                    break;
                }

            }

            // Refresh labels texts
            this.on_label.html(this.options.on_label);
            this.off_label.html(this.options.off_label);

            // Refresh button's dimensions
            this.button_bg.width(this.options.width);
            this.button_bg.height(this.options.height);
            this.button.width(this.options.button_width);
            this.button.height(this.options.height);
        },

        _initEvents: function() {
            var self = this;

            // Toggle switch when the switch is clicked
            this.button_bg.click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                self._toggleSwitch(false);
                return false;
            });
            this.button.click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                self._toggleSwitch(false);
                return false;
            });

            // Set switch value when clicking labels
            this.on_label.click(function(e) {
                if (self.options.checked && self.options.labels_placement === "both") {
                    return false;
                }

                self._toggleSwitch(false);
                return false;
            });

            this.off_label.click(function(e) {
                if (!self.options.checked && self.options.labels_placement === "both") {
                    return false;
                }

                self._toggleSwitch(false);
                return false;
            });

        },

        _setOption: function(key, value) {
            if (key === "checked") {
                this._setChecked(value);
                return;
            }

            this.options[key] = value;
            this._refresh();
        },

        _setChecked: function(value) {
            if (value === this.options.checked) {
                return;
            }

            this.options.checked = !value;
            this._toggleSwitch(false);
        },

        _toggleSwitch: function(isInitializing) {
        	// Don't toggle the switch if it is set to readonly or disabled, unless it is initializing and animating itself
        	if( !isInitializing && (this.element.attr('readonly') == 'readonly' || this.element.prop('disabled')) )
	        		return;

            this.options.checked = !this.options.checked;
            var newLeft = "";
            if (this.options.checked) {
                // Update the underlying checkbox state
                this.element.prop("checked", true);
                this.element.change();

                var dLeft = this.options.width - this.options.button_width;
                newLeft = "+=" + dLeft;

                // Update labels states
                if(this.options.labels_placement == "both")
                {
                    this.off_label.removeClass("on").addClass("off");
                    this.on_label.removeClass("off").addClass("on");
                }
                else
                {
                    this.off_label.hide();
                    this.on_label.show();
                }
                this.button_bg.addClass("checked");
                //execute on state callback if its supplied
                if(typeof this.options.on_callback === 'function') this.options.on_callback.call(this);
            }
            else {
                // Update the underlying checkbox state
                this.element.prop("checked", false);
                this.element.change();
                newLeft = "-1px";

                // Update labels states
                if(this.options.labels_placement == "both")
                {
                    this.off_label.removeClass("off").addClass("on");
                    this.on_label.removeClass("on").addClass("off");
                }
                else
                {
                    this.off_label.show();
                    this.on_label.hide();
                }
                this.button_bg.removeClass("checked");
                //execute off state callback if its supplied
                if(typeof this.options.off_callback === 'function') this.options.off_callback.call(this);
            }
            // Animate the switch
            this.button.animate({ left: newLeft }, 250, "easeInOutCubic");
        }

    });

})(jQuery);

//Globals
var _tolerance = Cookies.get('tolerance');
var _investment = 100000;
var _timeWindow = { 'Start': Date.UTC(2003, 4, 5), 'End': Date.UTC(2016, 5, 30) };
var _drillDownViewData = {
    chroma: getPerfData("chroma", _tolerance, _investment, _timeWindow),
    benchmark: getPerfData("bench", _tolerance, _investment, _timeWindow),
    bonds: getAllocData("bonds", _tolerance, _timeWindow),
    commodities: getAllocData("commodities", _tolerance, _timeWindow),
    cash: getAllocData("cash", _tolerance, _timeWindow),
    equity: getAllocData("equity", _tolerance, _timeWindow)
};
var _rateOfReturn;
var _maxDrawDown = { benchmark: null, chroma: null, display:false };
var _maxRunUp = { benchmark: {}, chroma: {} };
var _chartData = { chroma: { data: [] }, benchmark: { data: [] } };

// Utility Functions
var redrawKPIs = function () {
    if (_timeWindow.Start >= _timeWindow.End) return; // don't redraw if timescale is off
    //Rate of Return
    _rateOfReturn = getCompoundReturnRate(_drillDownViewData); //getRateOfReturn(_drillDownViewData);
    var ror_Chroma = (_rateOfReturn.chroma + 0.00001).toFixed(2);//Math.ceil(_rateOfReturn.chroma);
    var ror_Benchmark = (_rateOfReturn.benchmark + 0.00001).toFixed(2);
    //var ror_Chroma_yearly = Math.round(ror_Chroma / _rateOfReturn.years, 2);
    //var ror_Bench_yearly = Math.round(ror_Benchmark / _rateOfReturn.years, 2);
    var ror_Chroma_text = ror_Chroma + "%";// + ((_rateOfReturn.years > 1) ? " ({X}% yr)".replace("{X}", ror_Chroma_yearly) : "");
    var ror_Benchmark_text = ror_Benchmark + "%";// + ((_rateOfReturn.years > 1) ? " ({X}% yr)".replace("{X}", ror_Bench_yearly) : "");
    jQuery("#kpi-ror-chroma").text(ror_Chroma_text);
    jQuery("#kpi-ror-bench").text(ror_Benchmark_text);
    //Max Draw Down
    var mdd_chroma = getMaxDrawDown(_drillDownViewData.chroma); //console.log(mdd_chroma);
    var mdd_bench = getMaxDrawDown(_drillDownViewData.benchmark); //console.log(mdd_bench);
    jQuery("#kpi-mdd-chroma").empty().append(Math.round(mdd_chroma[0].range / mdd_chroma[0].highPt.y * 100) + "%");
    jQuery("#kpi-mdd-bench").empty().append(Math.round(mdd_bench[0].range / mdd_bench[0].highPt.y * 100) + "%");
    //MDD - Days to recovery
    var recoveryWindow = {'Start':_timeWindow.Start,'End': Date.UTC(2016, 5, 30)}
    var recoverySeries = getDrillDownViewData(_tolerance, _investment, recoveryWindow);
    var mdd_recovery_chroma = getMaxDrawDownRecoveryInfo(recoverySeries.chroma, mdd_chroma[0]);
    var mdd_recovery_bench = getMaxDrawDownRecoveryInfo(recoverySeries.benchmark, mdd_bench[0]);
    jQuery("#kpi-recover-chroma").text(mdd_recovery_chroma.daysTillRecovery + " | " + mdd_recovery_chroma.recoveryDate.format("MMM DD, YYYY"));
    jQuery("#kpi-recover-bench").text( mdd_recovery_bench.daysTillRecovery + " | " + mdd_recovery_bench.recoveryDate.format("MMM DD, YYYY"));
    //MDD - Synopsis
    var benchStartExposure = (_tolerance == "LOW") ? '10%' : ((_tolerance == 'MODERATE') ? "60%" : '80%');
    jQuery("#mdd-bench-start-exposure").text(benchStartExposure);
    jQuery("#mdd-bench-loss").text(Math.round(mdd_bench[0].range / mdd_bench[0].highPt.y * 100) + "%");
    jQuery("#chroma-exposure-reduction").text(Math.round(getEquityExposureReduction(recoverySeries.equity, mdd_chroma[0]))+"%");
    jQuery("#chroma-losses").text(Math.round(mdd_chroma[0].range / mdd_chroma[0].highPt.y * 100) + "%");
    /*Max Run Up
    var mru_chroma = getMaxRunUp(_drillDownViewData.chroma); //console.log(mdd_chroma);
    var mru_bench = getMaxRunUp(_drillDownViewData.benchmark); //console.log(mdd_bench);
    jQuery("#kpi-mru-chroma").text(Math.round((mru_chroma[0].range / mru_chroma[0].lowPt.y) * 100) + "%");
    jQuery("#kpi-mru-bench").text(Math.round((mru_bench[0].range / mru_bench[0].lowPt.y) * 100) + "%"); //*/
}
var toHCDataFormat = function (chartData) {
    var result = [];
    for (var i = 0; i < chartData.length; i++) {
        var dataPoint = [chartData[i].x._i, chartData[i].y]
        result[result.length] = dataPoint;
    }
    return result.sort(sortSeriesByDate);
}
var redrawChart = function () {
    if (_timeWindow.Start >= _timeWindow.End) return; // don't redraw if timescale is off
    //Data Series
    var chromaSeries = myChart.get('series-chroma');
    var benchSeries = myChart.get('series-bench');
    var chromaMDDSeries = myChart.get('series-chroma-mdd');
    var benchMDDSeries = myChart.get('series-bench-mdd');
    
    //var chromaMRUSeries = myChart.get('series-chroma-mru');
    //var benchMRUSeries = myChart.get('series-bench-mru');

    var allocCommodSeries = allocChart.get('series-alloc-commodities');
    var data_alloc_commodities = getAllocData("commodities", _tolerance, _timeWindow);
    allocCommodSeries.setData(data_alloc_commodities); // This logic needs to be changed to pull data from whatever selected portfolio

    var data_alloc_equity = getAllocData("equity", _tolerance, _timeWindow);
    var allocEquitySeries = allocChart.get('series-alloc-equity');
    allocEquitySeries.setData(data_alloc_equity); // This logic needs to be changed to pull data from whatever selected portfolio

    var data_alloc_bonds = getAllocData("bonds", _tolerance, _timeWindow);
    var allocBondsSeries = allocChart.get('series-alloc-bonds');
    allocBondsSeries.setData(data_alloc_bonds); // This logic needs to be changed to pull data from whatever selected portfolio

    var data_alloc_cash = getAllocData("cash", _tolerance, _timeWindow);
    var allocCashSeries = allocChart.get('series-alloc-cash');
    allocCashSeries.setData(data_alloc_cash); // This logic needs to be changed to pull data from whatever selected portfolio

    var chromaData = toHCDataFormat(_drillDownViewData.chroma);
    chromaSeries.setData(chromaData);

    var benchData = toHCDataFormat(_drillDownViewData.benchmark);
    benchSeries.setData(benchData);

    var mdd_chroma = getMaxDrawDown(_drillDownViewData.chroma); //console.log(mdd_chroma);
    _maxDrawDown.chroma = mdd_chroma[0];
    
    var chromaMDD = toHCDataFormat([mdd_chroma[0].highPt, mdd_chroma[0].lowPt]);
    chromaMDDSeries.setData(chromaMDD);

    /*
    var mru_chroma = getMaxRunUp(_drillDownViewData.chroma, true); //console.log(mru_chroma);
    var chromaMRU = toHCDataFormat([mru_chroma[0].highPt, mru_chroma[0].lowPt]);
    chromaMRUSeries.setData(chromaMRU);
    
    var mru_bench = getMaxRunUp(_drillDownViewData.benchmark); //console.log(mdd_bench);
    var benchMRU = toHCDataFormat([mru_bench[0].highPt, mru_bench[0].lowPt]);
    benchMRUSeries.setData(benchMRU);
    */

    var mdd_bench = getMaxDrawDown(_drillDownViewData.benchmark);
    _maxDrawDown.benchmark = mdd_bench[0];
    var benchMDD = toHCDataFormat([mdd_bench[0].highPt, mdd_bench[0].lowPt]);
    benchMDDSeries.setData(benchMDD);

    var extremes = myChart.yAxis[0].getExtremes();
    myChart.yAxis[0].setExtremes(extremes.dataMin - extremes.dataMin * .025, extremes.dataMax + extremes.dataMax * .00625);

    var chartTitle = "Chroma vs. Benchmark ", prefix = "", suffix = "";
    switch (_tolerance) {
        case 'LOW': { prefix = "Conservative "; suffix = "(10/90)"} break;
        case 'MODERATE': { prefix = "Moderate "; suffix = "(60/40)"} break;
        case 'HIGH': { prefix = "Aggressive "; suffix = "(80/20)"} break;
        default: break;
    }
    myChart.setTitle({ text: prefix + chartTitle + suffix })

    //allways clear out bands with new chart MDD based on settings
    _maxDrawDown.display = $("#chbx-show-mdd").prop("checked");
    if(_maxDrawDown.display){
        jQuery('.switch-button-button').click();
    }else{
        jQuery('#btn-mdd-bench, #btn-mdd-chroma').attr("data-checked", "true").click();
    }
}
//Page Load
//jQuery(function(){

//Handle Tab Navigation click events
jQuery('#tab-Performance').on('click', function () {
    jQuery('#tab-Performance').addClass('active');
    jQuery('#tab-Investments, #tab-Allocation, #tab-Portfolio').removeClass('active');
    jQuery('#ctnr-investments, #ctnr-chart-allocation, #ctnr-chart-portfolio').fadeOut("fast");
    jQuery('#ctnr-chart-performance').fadeIn("slow");
});
jQuery('#tab-Allocation').on('click', function () {
    jQuery('#tab-Allocation').addClass('active');
    jQuery('#tab-Investments, #tab-Performance, #tab-Portfolio').removeClass('active');
    jQuery('#ctnr-investments, #ctnr-chart-performance, #ctnr-chart-portfolio').fadeOut("fast");
    jQuery('#ctnr-chart-allocation').fadeIn("slow");
});
jQuery('#tab-Portfolio').on('click', function () {
    jQuery('#tab-Portfolio').addClass('active');
    jQuery('#tab-Investments, #tab-Performance, #tab-Allocation').removeClass('active');
    jQuery('#ctnr-investments, #ctnr-chart-allocation, #ctnr-chart-performance').fadeOut("fast");
    jQuery('#ctnr-chart-portfolio').fadeIn("slow").removeClass('hidden');
});
jQuery('#tab-Investments').on('click', function () {
    jQuery('#tab-Investments').addClass('active');
    jQuery('#tab-Portfolio, #tab-Performance, #tab-Allocation').removeClass('active');
    jQuery('#ctnr-chart-portfolio, #ctnr-chart-allocation, #ctnr-chart-performance').fadeOut("fast");
    jQuery('#ctnr-investments').fadeIn("slow").removeClass('hidden');
});
jQuery('#tab-Performance').click() // simulate click to initially hide allocation
//Handle MDD Toggle and button clicks
function getPlotBandOptions(target) {
    var pbOptions = {}
    switch (target) {
        case "bench": {
            pbOptions = {
                from: _maxDrawDown.benchmark.lowPt.y/*LowPt.y from Max DD - bench 88000*/,
                to: _maxDrawDown.benchmark.highPt.y/*HighPt.y from Maxx DD - bench 100000*/,
                color: 'rgba(241,92,128,.2)',
                id: 'plot-band-MDD-bench',
                zIndex: 3
            }
        } break;
        case "chroma": {
            pbOptions = {
                from: _maxDrawDown.chroma.lowPt.y/*LowPt.y from Max DD - chroma 88000*/,
                to: _maxDrawDown.chroma.highPt.y/*HighPt.y from Maxx DD - chroma 100000*/,
                color: 'rgba(247,163,92,.4)',
                id: 'plot-band-MDD-chroma',
                zIndex: 3
            }
        } break;
        default: break;
    }
    return pbOptions;
}
jQuery('#btn-mdd-bench, #btn-mdd-chroma').on('click', function () {
    if (_maxDrawDown.benchmark && _maxDrawDown.chroma) {
        var checkedState = ($(this).attr("data-checked") == 'true') ? true : false;
        var bandTarget = "";
        var bandOptions = {};
        var activeClass = "#777";
        var dataSeries = {};
        var dimStroke = { stroke: "rgba(255,255,255,0.001)" };
        switch ($(this).attr("id")) {
            case 'btn-mdd-bench': {
                bandTarget = 'plot-band-MDD-bench';
                bandOptions = getPlotBandOptions('bench');
                activeClass = 'active-mdd-bench';
                dataSeries = myChart.get('series-bench-mdd');
                dimStroke = { stroke: 'rgba(241,92,128,0.02)' };
            } break;
            case 'btn-mdd-chroma': {
                bandTarget = 'plot-band-MDD-chroma';
                bandOptions = getPlotBandOptions("chroma");
                activeClass = 'active-mdd-chroma';
                dataSeries = myChart.get('series-chroma-mdd');
                dimStroke = { stroke: 'rgba(247,163,92,0.04)' };
            } break;
            default: break;
        }
        if (checkedState) {
            //Hide the band and active color
            myChart.yAxis[0].removePlotBand(bandTarget);
            $(this).removeClass(activeClass);
            dataSeries.hide();
            $(this).attr("data-checked","false");
        } else {
            //show the band and color the button
            myChart.yAxis[0].addPlotBand(bandOptions);
            $(this).addClass(activeClass);
            dataSeries.show();
            dataSeries.graph.attr(dimStroke);
            $(this).attr("data-checked", "true");
        }
    }
});
jQuery('#chbx-show-mdd').change(function () {
    if (_maxDrawDown.benchmark && _maxDrawDown.chroma) {
        if ($(this).prop("checked")) {
            //Turn on MDD Plot Bands
            jQuery('#btn-mdd-bench, #btn-mdd-chroma').attr("data-checked", "false").click();
        }
        else {
            //Turn off MDD Plot Bands
            jQuery('#btn-mdd-bench, #btn-mdd-chroma').attr("data-checked", "true").click();
        }
    }
});
// Register Toggle button
jQuery('#chbx-show-mdd').switchButton({ labels_placement: "left" });

//Register DatePicker
jQuery('#ctnr-date-controls .input-daterange').datepicker({
    startDate: "05/05/2003",
    endDate: "05/30/2016"
});

jQuery('#ctnr-date-controls .input-daterange').datepicker().on('changeDate', function (e) {
    //Help  #ctnr-date-controls .input-daterange
    var dtStart = jQuery('#startDate').val();
    var dtEnd = jQuery('#endDate').val();
    console.log("start:" + dtStart + " end:" + dtEnd);
    if (dtStart && dtEnd) {
        dtStart = new Date(dtStart);
        dtEnd = new Date(dtEnd);
        _timeWindow = {
            'Start': Date.UTC(dtStart.getUTCFullYear(), dtStart.getUTCMonth(), dtStart.getUTCDate()),
            'End': Date.UTC(dtEnd.getUTCFullYear(), dtEnd.getUTCMonth(), dtEnd.getUTCDate())
        };
        _drillDownViewData = getDrillDownViewData(_tolerance, _investment, _timeWindow);

        //Clear + Redraw Chart
        redrawChart();
        //Redraw KPIs
        redrawKPIs();
    }
})
//Handle year selected click event
jQuery("li[data^='year']").on('click', function () {
    var elem = jQuery(this);
    var elemData = elem.attr('data').split('-');
    var timeIntvl = elemData[0];
    var timeVal = elemData[1];
    var target = { depth: "year", year: timeVal, month: 0 };
    //Get Data Subset
    //_drillDownViewData = getDrillDownViewData(target);
    var dtYrStart = "01/01/" + target.year;
    var minStart = jQuery('#startDate').attr('value');
    var pickerStart = (new Date(dtYrStart) < new Date(minStart)) ? minStart : dtYrStart;
    var dtYrEnd = "12/31/" + target.year;
    var maxEnd = jQuery('#endDate').attr('value');
    var pickerEnd = (new Date(dtYrEnd) > new Date(maxEnd)) ? maxEnd : dtYrEnd;
    jQuery('#startDate').datepicker("setDate", pickerStart);
    jQuery('#endDate').datepicker("setDate", pickerEnd);
});
//Handle all years selected click event
jQuery("[data='all-years']").on('click', function () {
    var elem = jQuery(this);
    jQuery('#startDate').datepicker("setDate", jQuery('#startDate').attr('value'));
    jQuery('#endDate').datepicker("setDate", jQuery('#endDate').attr('value'));
})
//Draw the Allocation Chart
var allocChart = Highcharts.chart('chart-allocation', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Chroma Asset Allocation'
    },
    xAxis: {
        type: 'datetime',
        title: {
            text: 'Date'
        }
    },
    yAxis: {
        min: 0,
        max: 100,
        title: {
            text: "Percent Allocated"
        }
    },
    tooltip: {
        split: true,
        valueSuffix: '%',
        valueDecimals: 2,
    },
    plotOptions: {
        area: {
            stacking: 'normal'//,
            //lineColor: '#f1f1f1',
            //lineWidth: 2
        }
    },
    series: [
        {
            id: "series-alloc-cash",
            type: 'area',
            name: 'Cash',
            lineWidth: 1,
            data: [[Date.UTC(2003, 5, 5), 0]]
        }
        , {
            id: "series-alloc-commodities",
            type: 'area',
            name: 'Commodities',
            lineWidth: 1,
            data: [[Date.UTC(2003, 5, 5), 0]]
        }
        , {
            id: "series-alloc-bonds",
            type: 'area',
            name: 'Bonds',
            lineWidth: 1,
            data: [[Date.UTC(2003, 5, 5), 0]]
        }
        , {
            id: "series-alloc-equity",
            type: 'area',
            name: 'Equity',
            lineWidth: 1,
            data: [[Date.UTC(2003, 5, 5), 0]]
        }]
});
//Draw the Chart
var myChart = Highcharts.chart('high-charts-ctnr', {
    title: {
        text: 'Chroma vs. Benchmark Performance'
    },
    xAxis: {
        type: 'datetime',
        title: {
            text: 'Date'
        },
        crosshair: {
            width: 1,
            color: 'gray',
            dashStyle: 'shortdot'
        }
    },
    yAxis: {
        min: _investment * .64,
        startOnTick: false,
        title: {
            text: 'Performance'
        }
    },
    tooltip: {
        //valueDecimals: 2,
        //valuePrefix: '$',
        //valueSuffix: ' USD',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>${point.y:,.0f} USD</b><br/>'
    },
    series: [
        {
            id: "series-chroma",
            type: 'area',
            name: 'Chroma',
            marker: {
                enabled: false
            },
            data: [[Date.UTC(2003, 5, 5), 0]]
        },
        {
            id: "series-bench",
            type: 'area',
            name: 'Benchmark',
            marker: {
                enabled: false
            },
            data: [[Date.UTC(2003, 5, 5), 0]]
        },
        /*{
            id: "series-bench-mru",
            type: 'spline',
            name: 'Max Run Up-Bench',
            data: [[Date.UTC(2003, 5, 5), 0]]
        },*/
        {
            id: "series-bench-mdd",
            type: 'spline',
            name: 'Max Draw Down-Bench',
            data: [[Date.UTC(2003, 5, 5), 0]],
            color: 'rgb(241,92,128)'
        },
        /*{
            id: "series-chroma-mru",
            type: 'spline',
            name: 'Max Run Up-Chroma',
            data: [[Date.UTC(2003, 5, 5), 0]]
        },*/
        {
            id: "series-chroma-mdd",
            type: 'spline',
            name: 'Max Draw Down-Chroma',
            data: [[Date.UTC(2003, 5, 5), 0]],
            color: 'rgb(247, 163, 92)'
        }]
})
//Draw the KPIs
redrawChart();
redrawKPIs();
//})