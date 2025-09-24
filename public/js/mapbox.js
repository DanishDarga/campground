var map = L.map("map").setView([20.5937, 78.9629], 5);

// OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Cluster group
var markers = L.markerClusterGroup();

for (var i = 0; i < 100; i++) {
  var marker = L.marker([20 + Math.random() * 10, 78 + Math.random() * 10]);
  markers.addLayer(marker);
}

map.addLayer(markers);
