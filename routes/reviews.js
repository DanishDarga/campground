const express = require('express');
const router = express.Router({ mergeParams: true });
const catchasync = require('../utils/catchasync');
const campground = require('../models/campground');
const reviews = require('../models/review');
const { validateReview, isLoggedin, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedin, validateReview, catchasync(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await campground.findById(id);

    const review = new reviews(req.body.review);
    review.author = req.user._id;
    foundCampground.reviews.push(review);

    await review.save();
    await foundCampground.save();

    console.log("Review added successfully");
    req.flash('success', 'Successfully added review');
    res.redirect(`/campgrounds/${foundCampground._id}`);
}))

router.delete('/:reviewId', isLoggedin, isReviewAuthor, catchasync(async (req, res) => {
    const { id } = req.params;
    const { reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await reviews.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;