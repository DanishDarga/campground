const campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index')
const axios = require("axios");

async function geocode(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const response = await axios.get(url, {
        headers: { "User-Agent": "yelpcamp-app" } // Required by Nominatim
    });

    if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat, lon };
    } else {
        throw new Error("No results found");
    }
}

module.exports.index = async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.viewCamp = async (req, res) => {
    const { id } = req.params;
    const Campground = await campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!Campground) {
        req.flash('error', 'Cannot find campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { Campground });
}

module.exports.createCamp = async (req, res, next) => {
    // if (!req.body.campground) {
    //     throw new expressError('Invalid Campground Data', 400);
    // }
    const newcamp = new campground(req.body.campground);
    const { lat, lon } = await geocode(newcamp.location);
    newcamp.geometry = { type: "Point", coordinates: [lon, lat] };
    newcamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newcamp.author = req.user._id;
    await newcamp.save();
    console.log(newcamp);
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${newcamp._id}`);
}

module.exports.editCamp = async (req, res) => {
    const { id } = req.params;
    const Campground = await campground.findById(id);
    if (!Campground) {
        req.flash('error', 'Cannot find campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { Campground })
}

module.exports.vieweditCamp = async (req, res) => {
    const { id } = req.params;
    const foundCampground = await campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    foundCampground.images.push(...imgs);
    await foundCampground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await foundCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${foundCampground._id}`);
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}