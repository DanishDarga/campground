const express = require('express');
const router = express.Router({ mergeParams: true });
const catchasync = require('../utils/catchasync');
const { validateReview, isLoggedin, isReviewAuthor } = require('../middleware');
const review = require('../controllers/reviews')

router.post('/', isLoggedin, validateReview, catchasync(review.createReview))

router.delete('/:reviewId', isLoggedin, isReviewAuthor, catchasync(review.deleteReview))

module.exports = router;