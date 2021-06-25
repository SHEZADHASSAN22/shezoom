const express = require('express');
const http = require('http');
const cors = require("cors");
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: [ "GET", "POST" ]
    }
});
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Testing');
})

io.on('connection', (socket) => {
     socket.emit('me', socket.id);

     socket.on('disconnect', () => {
         socket.broadcast.emit("call ended");
     })

     socket.on('calluser', ({ userToCall, signalData, from, name}) => {
         io.to(userToCall).emit("calluser", {signal: signalData, from, name})
     });

     socket.on('anwsercall', (data) => {
         io.to(data.to).emit("callaccepted", data.signal);
     })


})

server.listen(PORT, () => console.log(`server running on port ${PORT}`));


/*
Ideas:
add lebro join option
*/