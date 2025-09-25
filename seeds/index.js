const mongoose = require("mongoose");
const campground = require("../models/campground");
const { places, descriptors } = require("./seedhelper");

const cities = require("./city");
mongoose.connect("mongodb://localhost:27017/yelpcamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randNo = Math.floor(Math.random() * 1000);
    const newcamp = new campground({
      author: "68a31cf4658ffd962923f254",
      location: `${cities[randNo].city}, ${cities[randNo].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dnql0d1py/image/upload/v1756222947/samples/landscapes/beach-boat.jpg",
          filename: "YelpCamp/computed-filename-using-request",
        },
        {
          url: "https://res.cloudinary.com/dnql0d1py/image/upload/v1756222955/samples/smile.jpg",
          filename: "YelpCamp/computed-filename-using-request",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
      price: Math.floor(Math.random() * 20) + 10,
      geometry: {
        type: "Point",
        coordinates: [cities[randNo].longitude, cities[randNo].latitude],
      },
    });
    await newcamp.save();
  }
};
seedDB()
  .then(() => {
    console.log("Database seeded");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error seeding database:", err);
  });
