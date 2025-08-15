const express = require('express');
const router = express.Router();
const catchasync = require('../utils/catchasync');
const campground = require('../models/campground');
const Joi = require('joi');
const expressError = require('../utils/expressError');

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

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const Campground = await campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { Campground });
})

router.post('/', validateCampground, catchasync(async (req, res, err) => {
    // if (!req.body.campground) {
    //     throw new expressError('Invalid Campground Data', 400);
    // }

    const newcamp = new campground(req.body.campground);
    await newcamp.save();
    res.redirect(`/campgrounds/${newcamp._id}`);
}))

router.get('/:id/edit', async (req, res) => {
    const { id } = req.params;
    const Campground = await campground.findById(id);
    res.render('campgrounds/edit', { Campground })
})

router.put('/:id', validateCampground, async (req, res) => {
    const { id } = req.params;
    const foundCampground = await campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${foundCampground._id}`);
});

module.exports = router;