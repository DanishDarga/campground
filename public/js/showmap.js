if (campground && campground.geometry && campground.geometry.coordinates) {
  // Access campground from global window object (defined in show.ejs)
  const coords = campground.geometry.coordinates;

  // Initialize map
  const map = L.map("map").setView([coords[1], coords[0]], 10);

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
  }).addTo(map);

  // Add marker
  L.marker([coords[1], coords[0]])
    .addTo(map)
    .bindPopup(`<b>${campground.title}</b><br>${campground.location}`)
    .openPopup();
}
