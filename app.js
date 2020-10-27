const mqtt      = require("mqtt");
const express   = require("express");
const app       = express();
const mongoose  = require("mongoose")
var http        = require("http").Server(app);
var io          = require("socket.io")(http);
const httpPort  = 8090;

app.use('/assets', express.static('assets'));

var client = mqtt.connect("mqtt://broker.hivemq.com", {clientId : "mqttjsfarid1"});

client.on("connect",()=>{	
    if(client.connected) console.log("mqtt connected");
    client.subscribe("/mofuban/wannalog", {qos : 1});
});

client.on("error",(error)=>{ 
    console.log("Can't connect" + error);
    process.exit(1);
});

client.on('message',function(topic, message, packet){
    console.log("topic is "+ topic);
	console.log(JSON.parse(message));
});

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket)=>{
    console.log("ws client connected");
    socket.emit("tes", "isinya");
});

http.listen(process.env.PORT || httpPort, function(){
    console.log('Server listen port ' + httpPort);
});