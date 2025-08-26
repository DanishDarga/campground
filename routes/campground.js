const express = require('express');
const router = express.Router();
const catchasync = require('../utils/catchasync');
const { isLoggedin } = require('../middleware');
const { validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campground')
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })

router.get('/home', (req, res) => {
    res.render('home');
});

router.get('/', catchasync(campgrounds.index))

router.get('/new', isLoggedin, campgrounds.newForm);

router.get('/:id', catchasync(campgrounds.viewCamp));

router.post('/', isLoggedin, validateCampground, upload.array('image'), catchasync(campgrounds.createCamp));

router.get('/:id/edit', isLoggedin, isAuthor, campgrounds.editCamp)

router.put('/:id', isLoggedin, isAuthor, validateCampground, campgrounds.vieweditCamp);

router.delete('/:id', isLoggedin, isAuthor, campgrounds.deleteCamp);

module.exports = router;