const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchasync = require('../utils/catchasync');
const { storeReturnTo } = require('../middleware');

router.get('/register', async (req, res) => {
    res.render('user/register');
})

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log("Registered User Successfully");
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Successfully registered');
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
});

router.get('/login', (req, res) => {
    res.render('user/login');
})


router.post('/login', storeReturnTo,
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }),
    (req, res) => {
        req.flash("success", `Welcome back ${req.user.username}`); // safer: use req.user instead of req.body
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    }
);

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out successfully!');
        res.redirect('/campgrounds');
    });
});

module.exports = router;