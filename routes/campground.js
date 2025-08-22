const express = require('express');
const router = express.Router();
const catchasync = require('../utils/catchasync');
const campground = require('../models/campground');
const Joi = require('joi');
const expressError = require('../utils/expressError');
const { isLoggedin } = require('../middleware');

const validateCampground = (req, res, next) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required()
        }).required()
    })
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new expressError(msg, 400);
    }
    else {
        next();
    }
}

router.get('/home', (req, res) => {
    res.render('home');
});
router.get('/', async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

router.get('/new', isLoggedin, (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const Campground = await campground.findById(id).populate('reviews').populate('author');
    console.log(Campground);
    if (!Campground) {
        req.flash('error', 'Cannot find campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { Campground });
});

router.post('/', isLoggedin, validateCampground, catchasync(async (req, res, err) => {
    // if (!req.body.campground) {
    //     throw new expressError('Invalid Campground Data', 400);
    // }
    const newcamp = new campground(req.body.campground);
    newcamp.author = req.user._id;
    await newcamp.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${newcamp._id}`);
}));

router.get('/:id/edit', isLoggedin, async (req, res) => {
    const { id } = req.params;
    const Campground = await campground.findById(id);
    if (!Campground) {
        req.flash('error', 'Cannot find campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { Campground })
})

router.put('/:id', isLoggedin, validateCampground, async (req, res) => {
    const { id } = req.params;
    const foundCampground = await campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${foundCampground._id}`);
});

router.delete('/:id', isLoggedin, async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
});

module.exports = router;