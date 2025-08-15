const express = require('express');
const router = express.Router();
const catchasync = require('../utils/catchasync');
const Joi = require('joi');
const campground = require('../models/campground');
const expressError = require('../utils/expressError');
const reviews = require('../models/review');

const validateReview = (req, res, next) => {
    const reviewSchema = Joi.object({
        review: Joi.object({
            rating: Joi.number().required().min(1).max(5),
            body: Joi.string().required()
        }).required()
    })
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new expressError(msg, 400);
    }
    else {
        next();
    }
}

router.post('/:id/reviews', validateReview, catchasync(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await campground.findById(id);

    const review = new reviews(req.body.review);
    foundCampground.reviews.push(review);

    await review.save();
    await foundCampground.save();

    console.log("Review added successfully");

    res.redirect(`/campgrounds/${foundCampground._id}`);

}))

router.delete('/:id/reviews/:reviewId', catchasync(async (req, res) => {
    const { id } = req.params;
    const { reviewId } = req.params;
    console.log("I am here");
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await reviews.findByIdAndDelete(reviewId);
    console.log("I am here");
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;