const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const expressError = require('./utils/expressError');
const catchaync = require('./utils/catchasync');
const path = require('path');
const engine = require('ejs-mate');


const campground = require('./models/campground');

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
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

app.get('/campground/new', (req, res) => {
    res.render('campgrounds/new');
});

app.get('/campground/:id', async (req, res) => {
    const { id } = req.params;
    const Campground = await campground.findById(id);
    res.render('campgrounds/show', { Campground });
})

app.post('/campgrounds', catchaync(async (req, res, err) => {
    if (!req.body.campground) {
        throw new expressError('Invalid Campground Data', 400);
    }
    console.log(req.body);
    const newcamp = new campground(req.body.campground);
    await newcamp.save();
    res.redirect(`/campground/${newcamp._id}`);
}))

app.get('/campground/:id/edit', async (req, res) => {
    const { id } = req.params;
    const Campground = await campground.findById(id);
    res.render('campgrounds/edit', { Campground })
})

app.put('/campground/:id', async (req, res) => {
    const { id } = req.params;
    const foundCampground = await campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campground/${foundCampground._id}`);
});

app.delete('/campground/:id', async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

app.all(/(.*)/, (req, res, next) => {
    next(new expressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("campgrounds/error");
})