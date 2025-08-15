const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const expressError = require('./utils/expressError');
const catchasync = require('./utils/catchasync');
const path = require('path');
const engine = require('ejs-mate');
const session = require('express-session');

const campgrounds = require('./routes/campground');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelpcamp');

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
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'rew123',
    resave: false,
    saveUninitialized: true,
}

app.use(session(sessionConfig));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

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