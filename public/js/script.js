const socket = io();
const map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c']
}).addTo(map);

const markers = L.markerClusterGroup();
map.addLayer(markers);

// Function to create a custom marker icon
function createCustomIcon(color) {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%;"></div>`,
        iconSize: [15, 15]
    });
}

// Track existing marker positions
const markerPositions = {};

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
                timeout: 15000,
                maximumAge: 0
            });
        });
    }
});

socket.on('new-location', (data) => {
    const { id, latitude, longitude } = data;

    let marker = markers.getLayers().find(marker => marker.options.id === id);

    if (marker) {
        // Update marker position
        marker.setLatLng([latitude, longitude]);
    } else {
        let color = getRandomColor();
        marker = L.marker([latitude, longitude], {
            id,
            icon: createCustomIcon(color)
        });

        // Check distance from existing markers
        let tooClose = false;
        for (let posId in markerPositions) {
            const [prevLat, prevLng] = markerPositions[posId];
            if (getDistance(latitude, longitude, prevLat, prevLng) < 15) {
                tooClose = true;
                break;
            }
        }

        if (tooClose) {
            // Optionally move the marker or handle the case
            console.warn('Marker is too close to existing markers');
            return;
        }

        marker.addTo(markers);
        markerPositions[id] = [latitude, longitude];
        map.setView([latitude, longitude]);
    }
});

socket.on('user-disconnected', (id) => {
    const marker = markers.getLayers().find(marker => marker.options.id === id);
    if (marker) {
        markers.removeLayer(marker);
        delete markerPositions[id];
    }
});

function getRandomColor() {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}
