// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

// Create the data table.
var data = google.visualization.arrayToDataTable(getDataForGoogleChart())
/*var data = new google.visualization.DataTable();
data.addColumn('date', 'Date'); //X
data.addColumn('number', 'Chroma');  //Y1
data.addColumn('number', 'Benchmark');  //Y2
var dResult = getDataForGoogleChart();
data.addRows(dResult);
/*
data.addRows([                       //X,Y Coordinates
    ['Mushrooms', 3],
    ['Onions', 1],
    ['Olives', 1],
    ['Zucchini', 1],
    ['Pepperoni', 2]
]);
*/

// Set chart options
var options = {'title':'12 Year Performance'//,
                ,animation:{
                    "startup":true
                    ,duration:1000
                    ,easing: "in"} // 'width':800,
               ,'height':600
              };

// Instantiate and draw our chart, passing in some options.
var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
chart.draw(data, options);
}