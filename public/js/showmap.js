// Access Campground from global window object
const coords = Campground.geometry.coordinates;

// Initialize map
const map = L.map('map').setView([coords[1], coords[0]], 13);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
}).addTo(map);

// Add marker
L.marker([coords[1], coords[0]])
    .addTo(map)
    .bindPopup(`<b>${Campground.title}</b><br>${Campground.location}`)
    .openPopup();