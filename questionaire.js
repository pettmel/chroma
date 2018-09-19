$(function () {
    //Navigation Wireup
    jQuery('#rbtn-q1-A').on('click',function(){
        Cookies.set("q1","A");
        $('#section-q1, #section-q3').hide();
        $('#section-q2').show();
    });
    jQuery('#rbtn-q1-B').on('click',function(){
        Cookies.set("q1","B");
        window.location = 'return-probability.html?v=a1.5';
        /*$('#section-q1, #section-q3').hide();
        $('#section-q2').show();*/
    });
    jQuery('#rbtn-Q2-A').on('click',function(){
        Cookies.set("q2","A");
       // if(Cookies.get("q1") == "A"){
            window.location = 'return-probability.html?v=a1.5';
        /*}else{
            $('#section-q1, #section-q2').hide();
            $('#section-q3').show();
        }*/
    });
    jQuery('#rbtn-Q2-C').on('click',function(){
        Cookies.set("q2","C");
        window.location = 'return-probability.html?v=a1.5';
        /*$('#section-q1, #section-q2').hide();
        $('#section-q3').show();*/
    });
    jQuery('#rbtn-Q3-A').on('click',function(){
        Cookies.set("q3","A");
        window.location = 'return-probability.html?v=a1.5';
    });
    jQuery('#rbtn-Q3-D').on('click',function(){
        Cookies.set("q3","D");
        window.location = 'return-probability.html?v=a1.5';
    });

    jQuery('#section-q2, #section-q3').hide(); // simulate showing the first question on page load
    /*jQuery('.rbtn-Q3-completeRegistrationHigh,.rbtn-Q3-completeRegistrationLow').on('click',function(){
        window.location = 'return-probability.html';
    })*/
    //Chart Controls Wire-up
    //Question 1 - Chart
    Highcharts.chart('ctnr-q1-chart', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Pension Performance'
        },
        xAxis: {
            categories: [
                'Pension A',
                'Pension B'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            max: 150,
            title: {
                text: '%Return'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>({point.y:.0f}%)</b> <br/>',
            shared: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Best Case',
            data: [100,150]

        }, {
            name: 'Worst Case',
            data: [100,80]

        }]
    });
    //Question 2
     Highcharts.chart('ctnr-q2-chart', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Pension Performance'
        },
        xAxis: {
            categories: [
                'Pension A',
                'Pension C'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            max: 150,
            title: {
                text: '%Return'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>({point.y:.0f}%)</b> <br/>',
            shared: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Best Case',
            data: [100,150]

        }, {
            name: 'Worst Case',
            data: [100,90]

        }]
    });
    //Question 3
     Highcharts.chart('ctnr-q3-chart', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Pension Performance'
        },
        xAxis: {
            categories: [
                'Pension A',
                'Pension D'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            max: 150,
            title: {
                text: '%Return'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>({point.y:.0f}%)</b> <br/>',
            shared: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Best Case',
            data: [100,150]

        }, {
            name: 'Worst Case',
            data: [100,66]

        }]
    });
});