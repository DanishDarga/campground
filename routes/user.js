const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/register', async (req, res) => {
    res.render('user/register');
})

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({
        email,
        username
    })
    const registeredUser = await User.register(user, password);
    console.log("Registered User Successfully");
    req.flash('success', 'Successfully registered');
    res.redirect('/campgrounds');
})
module.exports = router;