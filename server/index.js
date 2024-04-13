const express = require('express');
const app =express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { spawn } = require('child_process');
const { PythonShell } =require('python-shell')


app.use(cors());
app.use(express.json());


const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
    }
})

io.on("connection",(socket)=>{
    console.log(`User connnected:${socket.id}`);

    socket.on("join_room",(data)=>{
        socket.join(data);
        console.log(`User with Id:${socket.id} joined room:${data}`)
    });

    
    socket.on("send_message",(data)=>{
       socket.to(data.room).emit("recieve_message",data);

    });

    socket.on("disconnect",()=>{
        console.log("User Disconnected",socket.id);
    });

});


//WORKING WITH PYTHON FILE
// const data_to_pass_in = "Sent from JS to PY"
// console.log('Data sent to python:', data_to_pass_in);
// const python_process = spawn('python', ['./ecc_scratch.py', data_to_pass_in]);

// python_process.stdout.on('data', (data) => {
//     console.log('Data recieved from python:', data.toString());
// });



server.listen(3001,()=>{
    console.log("Server RUNNING")
})