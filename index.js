const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const expressError = require('./utils/expressError');
const catchasync = require('./utils/catchasync');
const path = require('path');
const engine = require('ejs-mate');
const Joi = require('joi');
const reviews = require('./models/review');
const campground = require('./models/campground');
const { title, rawListeners } = require('process');
const campgrounds = require('./routes/campground');


mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});


app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});



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

app.use('/campgrounds', campgrounds);

app.post('/campgrounds/:id/reviews', validateReview, catchasync(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await campground.findById(id);

    const review = new reviews(req.body.review);
    foundCampground.reviews.push(review);

    await review.save();
    await foundCampground.save();

    console.log("Review added successfully");

    res.redirect(`/campground/${foundCampground._id}`);

}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchasync(async (req, res) => {
    const { id } = req.params;
    const { reviewId } = req.params;
    console.log("I am here");
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await reviews.findByIdAndDelete(reviewId);
    console.log("I am here");
    res.redirect(`/campground/${id}`);
}))
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

app.all(/(.*)/, (req, res, next) => {
    next(new expressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'Something went wrong';
    }
    res.status(statusCode).render("campgrounds/error", { err });
})