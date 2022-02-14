
var tempArr = [];

google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(onpageload);

function changeledstat(data){
    var ledstat = document.getElementById("led-status");
    if(Number(data)){
        ledstat.innerText = "ON";
    }else{
        ledstat.innerText = "OFF";
    }
}

function drawChart() {
    var head = [["time", "temp (°C)"]];
    var headbody = head.concat(tempArr);
    var data = new google.visualization.arrayToDataTable(headbody);

    var options = {
        title: 'Temperature Monitoring',
        curveType: 'function',
        legend: { position: 'bottom' },
        hAxis: {
            format: "HH:mm:ss"
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}
var socket = io();
socket.on("tes", function (data) {
    console.log(data);
})

function onpageload() {
    socket.on("newtemp", function (data) {
        var jsondata = JSON.parse(data);
        document.getElementById("temp").innerHTML = jsondata.temp + " &#8451;";
        document.getElementById("fan").innerHTML = jsondata.speed + " %";
        changeledstat(jsondata.ledbt);
        var newarr = [new Date(jsondata.time), jsondata.temp]
        tempArr.push(newarr);
        if (tempArr.length == 38) {
            tempArr.shift();
        }
        drawChart();
    })
}

window.onload = function(){

    var btnled = document.getElementById("btn-led");
    btnled.onclick = function(){
        socket.emit("btnled")
    }

    var formalarm = document.getElementById("form-alarm");
    var inputalarm = document.getElementById("input-alarm");
    formalarm.onsubmit = function(e){
        e.preventDefault();
        socket.emit("alarmset", inputalarm.value);
        inputalarm.value = "";
    }
    
}

socket.on("newledstat", function(data){
    changeledstat(data);
})


