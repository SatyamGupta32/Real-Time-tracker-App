const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((poistion) => {
        const { latitude, longitude } = poistion.coords;
        socket.emit('send-location', { latitude, longitude });
    }, (error) => {
        console.error(error);
    },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    )
}

const map = L.map('map').setView([0, 0], 18);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c']
}).addTo(map);

const markers = {};

socket.on('new-location', (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})