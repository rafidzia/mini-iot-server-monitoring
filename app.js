const mqtt = require("mqtt");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const events = require("events");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var ee = new events.EventEmitter();
const httpPort = 8094;

app.use('/assets', express.static('assets'));

var conn = mongoose.createConnection('mongodb+srv://cluster0.jpi1b.mongodb.net/wannalog', 
{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    "auth": {
        "authSource": "admin"
    },
    "user": "rafidzia",
    "pass": "asd018-dsa",
});

var temp = conn.model("temp", {
    adc : Number,
    opamp : Number,
    lm35 : Number,
    temp : Number,
    led : String,
    time : String,
    speed : Number
})

var client = mqtt.connect("mqtt://broker.emqx.io", { clientId: "mqttjsfarid1" });

client.on("connect", () => {
    if (client.connected) console.log("mqtt connected");
    client.subscribe("/mofuban/wannalog", { qos: 1 });
    client.subscribe("/mofuban/ledstat", { qos: 1 });
});

client.on("error", (error) => {
    console.log("Can't connect" + error);
    process.exit(1);
});

client.on('message', function (topic, message, packet) {
    if(topic == "/mofuban/wannalog"){
        var jsondata = JSON.parse(message);
        ee.emit("newtemp", jsondata);
        message = JSON.parse(message);
        if(message.save){
            const newdata = new temp(message);
            newdata.save((err, result)=>{
                if(err) throw err;
            })
        }
    }
    if(topic == "/mofuban/ledstat"){
        ee.emit("newledstat", String(message));
    }
    
});

clientPublish = (topic, data)=>{
    if (client.connected == true){
        client.publish(topic, data, {retain:false, qos:1})
    }
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
    console.log("ws client connected");
    socket.emit("tes", "tes");
    ee.on("newtemp", (data) => {
        socket.emit("newtemp", JSON.stringify(data));
    })
    socket.on("btnled", ()=>{
        clientPublish("/mofuban/ledtoggle", "");
    })
    ee.on("newledstat", (data)=>{
        socket.emit("newledstat", data);
    })
    socket.on("alarmset", (data)=>{
        clientPublish("/mofuban/alarmset", data);
    })
});

http.listen(process.env.PORT || httpPort, function () {
    console.log('Server listen port ' + httpPort);
});