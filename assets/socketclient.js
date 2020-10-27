var socket = io();

socket.on("tes", function(data){
    console.log(data);
})