const socket = io();

// Initialize the map
const map = L.map('map').setView([0, 0], 13);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c']
}).addTo(map);

// Store markers by socket ID
const markers = {};

// Request geolocation only in response to a user gesture
document.addEventListener('DOMContentLoaded', () => {
    const startTrackingButton = document.getElementById('start-tracking');
    
    if (navigator.geolocation) {
        startTrackingButton.addEventListener('click', () => {
            navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude } = position.coords;
                socket.emit('send-location', { latitude, longitude });
            }, (error) => {
                console.error(error.message);
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
    }
});

socket.on('new-location', (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        // Update marker position
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Create a new marker
        markers[id] = L.marker([latitude, longitude]).addTo(map);

        // Center the map on the new marker
        map.setView([latitude, longitude]);
    }
});

socket.on('user-disconnected', (id) => {
    if (markers[id]) {
       map.removeLayer(markers[id]);
        delete markers[id];
    }
});
