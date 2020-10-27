var socket = io();

var tempArr = [];

socket.on("tes", function(data){
    console.log(data);
})

socket.on("newtemp", function(data){
    console.log(data);
})

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Time', 'Temperature'],
    ['2004',  1000],
    ['2005',  1170],
    ['2006',  660],
    ['2007',  1030]
  ]);

  var options = {
    title: 'Temperature Monitoring',
    curveType: 'function',
    legend: { position: 'bottom' }
  };

  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

  chart.draw(data, options);
}