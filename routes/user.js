const express = require('express');
const router = express.Router();
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const user = require('../controllers/user');

router.get('/register', user.renderRegister)

router.post('/register', user.register);

router.get('/login', user.renderLogin)


router.post('/login', storeReturnTo,
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }),
    user.login
);

router.get('/logout', user.logout);

module.exports = router;