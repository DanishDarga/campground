const map = L.map("cluster-map").setView([39.8283, -98.5795], 3);

const campgrounds = window.campgrounds || [];

// OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Cluster group
const markers = L.markerClusterGroup();

campgrounds.forEach((camp) => {
  console.log(camp);
  if (camp.geometry && camp.geometry.coordinates) {
    console.log(camp.location);
    const lng = camp.geometry.coordinates[0];
    const lat = camp.geometry.coordinates[1];
    const marker = L.marker([lat, lng]).bindPopup(
      `<b>${camp.title}</b><br>${camp.location}<br><a href="/campgrounds/${camp._id}">View</a>`
    );
    markers.addLayer(marker);
  }
});

map.addLayer(markers);
