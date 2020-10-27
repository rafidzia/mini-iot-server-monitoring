const mqtt      = require("mqtt");
const express   = require("express");
const app       = express();
const mongoose  = require("mongoose")
var http        = require("http").Server(app);
var io          = require("socket.io")(http);
const httpPort  = 8090;

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

var temp = conn.model("temp", mongoose.Schema({
    adc : Number,
    opamp : Number,
    lm35 : Number,
    temp : Number,
    led : String,
    time : String
}))

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
    // const newdata = new temp(message);
    // newdata.save((err, result)=>{
    //     if(err) throw err;
    //     console.log(result)
    // })
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