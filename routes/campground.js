const express = require('express');
const router = express.Router();
const catchasync = require('../utils/catchasync');
const campground = require('../models/campground');
const { isLoggedin } = require('../middleware');
const { validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campground')

router.get('/home', (req, res) => {
    res.render('home');
});

router.get('/', catchasync(campgrounds.index))

router.get('/new', isLoggedin, campgrounds.newForm);

router.get('/:id', catchasync(campgrounds.viewCamp));

router.post('/', isLoggedin, validateCampground, catchasync(campgrounds.createCamp));

router.get('/:id/edit', isLoggedin, isAuthor, campgrounds.editCamp)

router.put('/:id', isLoggedin, isAuthor, validateCampground, campgrounds.vieweditCamp);

router.delete('/:id', isLoggedin, isAuthor, campgrounds.deleteCamp);

module.exports = router;