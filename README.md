# Real-Time-tracker-App

## Overview

The Real-Time Tracker App is a web application that allows users to track and view real-time locations on a map. It uses Leaflet for map rendering and Socket.io for real-time communication between clients. This application enables users to share their locations with others and see their positions update in real-time.

## Features

- **Real-Time Location Tracking**: Users can start tracking their location, and the app will broadcast their position to all connected clients.
- **Dynamic Map Updates**: Markers on the map update in real-time as users move.
- **User Management**: Each user is represented by a unique marker on the map. When a user disconnects, their marker is removed from the map.

## Technologies Used

- **Leaflet**: A leading open-source JavaScript library for interactive maps.
- **Socket.io**: A library for real-time web applications that enables bidirectional communication between clients and servers.
- **Express**: A web framework for Node.js that simplifies server-side code.
- **EJS**: A templating engine for rendering dynamic HTML pages on the server.

## How It Works

1. **User Interaction**:
   - Users can start tracking their location by clicking a button on the web interface.
   - The application uses the Geolocation API to retrieve the user's current position.

2. **Real-Time Communication**:
   - When a user starts tracking, their location is sent to the server via Socket.io.
   - The server broadcasts the location to all connected clients.

3. **Map Updates**:
   - Each client receives location updates and adjusts the map markers accordingly.
   - If a user disconnects, their marker is removed from the map.

## How to Use

1. **Start the Server**:
   - Ensure you have Node.js installed.
   - Run `node server.js` to start the server.

2. **Open the Application**:
   - Open a web browser and navigate to `http://localhost:3000` to access the application.

3. **Start Tracking**:
   - Click the "Start Tracking" button to begin sending your location.
   - The map will display your location and update it in real-time.

4. **See Other Users**:
   - Other users who are also tracking their location will appear on your map as markers.

## Code Structure

- **`server.js`**: Main server file that sets up the Express server and Socket.io for real-time communication.
- **`public/`**: Contains static files including CSS, JavaScript, and images.
  - **`css/style.css`**: Styles for the web interface.
  - **`js/script.js`**: Client-side JavaScript for handling map interactions and Socket.io communication.
  - **`location.png`**: Icon used for the tracking button.
- **`views/index.ejs`**: EJS template for rendering the main web page.

## hosting by:-
Render - https://render.com/

## Link for my Website:-
https://real-time-tracker-app-62kp.onrender.com
