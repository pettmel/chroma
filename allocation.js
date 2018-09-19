/*
var myChart = Highcharts.chart('ctnr-allocation-mix', {
    chart: {
        type: 'column'
    },
    title: {
        text: "Today's Allocation Mix based on your profile"
    },
    xAxis: {
        categories: ['Today']
    },
    yAxis: {
        min: 0,
        max: 100,
        title: {
            text: 'Percent'
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>({point.percentage:.0f}%)</b> <br/>',
        shared: true
    },
    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },
    series: [{
        id:"series-stocks",
        name: 'Stocks',
        data: []
    },{
        id:"series-bonds",            
        name: 'Bonds',
        data: []
    },{
        id:"series-cash",            
        name: 'Cash',
        data: []
    },{
        id:"series-commod",            
        name: 'Commodities',
        data: []
    }
    ]
});
*/
//jQuery(function(){
    var tol = Cookies.get('tolerance') || "LOW";
    $('#reg-sel-riskTolerance').val(Cookies.get('tolerance'));
    var s_Stocks, s_Bonds, s_Cash, s_Commodities;
    var t_alloc = $('.tol-alloc-placeholder');
    var t_alloc_E = $('.tol-alloc-equities');
    var t_alloc_B = $('.tol-alloc-bonds');
    var t_alloc_worst=$('#tol-alloc-worst-loss');
    switch(tol){
        case 'LOW':{//taken from line 69
            s_Stocks = {mix:48.764, data:[21.596,0,0,0,0,0.670,0,0.875,1.664,11.860,5.054,1.301,1.255,1.144,1.156,2.189]};     
            s_Bonds = {mix:2.674, data:[1.115,1.56,0,0,0,0,0]};      
            s_Cash = {mix:48.562, data:[48.562]};
            s_Commodities = {mix:0, data:[0]};
            t_alloc.text("CONSERVATIVE");
            t_alloc_E.text("10");
            t_alloc_B.text("90");
            t_alloc_worst.text("10");
            break;
        }
        case 'MODERATE':{
            s_Stocks = {mix:65.294, data:[23.340,0,0,0,0,1.666,0,2.185,5.070,12.045,5.133,3.864,3.585,2.955,3.227,2.223]};     
            s_Bonds = {mix:6.941, data:[2.657,4.284,0,0,0,0,0]};      
            s_Cash = {mix:27.765, data:[27.765]};
            s_Commodities = {mix:0, data:[0]};
            t_alloc.text("MODERATE");
            t_alloc_E.text("60");
            t_alloc_B.text("40");
            t_alloc_worst.text("20");
            break;
        }
        case "HIGH":{
            s_Stocks = {mix:88.188, data:[25.511,0,0,0,0,3.197,0,4.193,9.729,12.045,5.133,7.415,6.879,5.670,6.192,2.223]};     
            s_Bonds = {mix:8.712, data:[5.099,3.61,0,0,0,0,0]};      
            s_Cash = {mix:3.100, data:[3.100]};
            s_Commodities = {mix:0, data:[0]};
            t_alloc.text("AGGRESIVE");
            t_alloc_E.text("80");
            t_alloc_B.text("20");
            t_alloc_worst.text("30");                    
            break;
        }
        default:break;
    }
//})
    var colors = Highcharts.getOptions().colors,
        categories = ['Stocks', 'Bonds', ' ', 'Commodities'],
        data = [{
            y: s_Stocks.mix,
            color: colors[0],
            drilldown: {
                name: 'Stock Allocation',
                categories: ['US', 'US Small', 'US Mid', 'US Value', 'US Growth', 'Nasdaq', "FTSE High Dividend", "SP500 Low Vol","Intl Small","Europe", "Asia", "Developed Value", "Developed High Dividend", "ACWI Min Vol", "Dividend Growth", "EM"],
                data: s_Stocks.data,
                color: colors[0]
            }
        }, {
            y: s_Bonds.mix,
            color: colors[1],
            drilldown: {
                name: 'Bond Allocation',
                categories: ['HY Credit', 'US Treasuries in 30YR Equivalents', 'International Bonds', 'US Mortgages', 'US Agencies', 'IG Credit', 'US TIPS'],
                data: s_Bonds.data,
                color: colors[1]
            }
        }, {
            y: s_Cash.mix,
            color: colors[2],
            drilldown: {
                name: 'Short Duration Bond Allocation',
                categories: ['Short Duration Bonds'],
                data: s_Cash.data,
                color: colors[2]
            }
        }, {
            y: s_Commodities.mix,
            color: colors[3],
            drilldown: {
                name: 'Commodity Allocation',
                categories: ['Commodities'],
                data: s_Commodities.data,
                color: colors[3]
            }
        }],
        mixData = [],
        allocationData = [],
        i,
        j,
        dataLen = data.length,
        drillDataLen,
        brightness;


// Build the data arrays
for (i = 0; i < dataLen; i += 1) {

    // add allocation mix data
    mixData.push({
        name: categories[i],
        y: data[i].y,
        color: data[i].color
    });

    // add allocation drill down data
    drillDataLen = data[i].drilldown.data.length;
    for (j = 0; j < drillDataLen; j += 1) {
        brightness = 0.2 - (j / drillDataLen) / 5;
        allocationData.push({
            name: data[i].drilldown.categories[j],
            y: data[i].drilldown.data[j],
            color: Highcharts.Color(data[i].color).brighten(brightness).get()
        });
    }
}

// Create the Donut chart
var donutChart = Highcharts.chart('ctnr-allocation-mix', {
    chart: {
        type: 'pie'
    },
    title: {
        text: "Today's Allocation Mix based on your profile"
    },

    yAxis: {
        title: {
            text: 'Total percent market share'
        }
    },
    plotOptions: {
        pie: {
            shadow: false,
            center: ['50%', '50%']
        }
    },
    tooltip: {
        valueSuffix: '%'
    },
     series: [{
            id: 'series-alloc-mix',
            name: 'Allocation Mix',
            data: mixData,
            size: '60%',
            dataLabels: {
                formatter: function () {
                    return this.y > 5 ? this.point.name : null;
                },
                color: '#ffffff',
                distance: -30
            }
        }, {
            id: 'series-alloc-drill',
            name: 'Detailed Allocations',
            data: allocationData,
            size: '80%',
            innerSize: '60%',
            dataLabels: {
                formatter: function () {
                    // display only if larger than 1
                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + (this.y + 0.0001).toFixed(2) + '%' : null;
                }
            }
        }]
});