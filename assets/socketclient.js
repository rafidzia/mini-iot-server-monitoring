
var tempArr = [];

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(onpageload);

function drawChart() {
    var head = [["time", "temp (°C)"]];
    var headbody = head.concat(tempArr);
    var data = new google.visualization.arrayToDataTable(headbody);

    var options = {
        title: 'Temperature Monitoring',
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: {
            format : "HH:mm"
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}
var socket = io();
socket.on("tes", function(data){
    console.log(data);
})

function onpageload(){
    socket.on("newtemp", function(data){
        var jsondata = JSON.parse(data);
        var newarr = [new Date(jsondata.time), jsondata.temp]
        tempArr.push(newarr);
        drawChart();
    })
}

