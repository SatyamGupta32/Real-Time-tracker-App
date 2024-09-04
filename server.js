const express = require('express');
const socket = require('socket.io');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http');
const server = http.createServer(app);
const io = socket(server);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle new socket connections
io.on('connection', (socket) => {
    console.log('A new client connected:', socket.id);

    // Handle location data
    socket.on('send-location', (data) => {
        console.log('Received location from', socket.id, data);
        io.emit('new-location', { id: socket.id, ...data }); // Broadcast to all clients
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        io.emit('user-disconnected', socket.id); // Notify all clients of disconnection
    });
});

// Render the index page
app.get('/', (req, res) => {
    res.render('index');
});

// Increase timeout settings if needed
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000;  // 120 seconds

// Start the server
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is listening on port ${port}`);
});
