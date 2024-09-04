const express = require('express');
const socket = require('socket.io');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http');
const server = http.createServer(app);
const io = socket(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a new client connected');

    socket.on('send-location', (data) => {
        console.log(socket.id);        
        io.emit('new-location', { id: socket.id, ...data }); // Broadcast to all clients
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        console.log(socket.id);
        io.emit('user-disconnected', socket.id); // Notify all clients of disconnection
    });
});


app.get('/', (req, res) => {
  res.render('index');
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
