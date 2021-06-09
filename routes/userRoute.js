const express = require('express');
const router = express();
const passport = require('passport');

// CONTROLLERS
const user = require('../controllers/user')

// Error handlers
const catchAsyncError = require('../utilities/catchAsyncError');

router.route('/register')
    .get(user.renderForm)
    .post(catchAsyncError(user.registerUser));

router.route('/login')
    .get(user.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), 
        user.loginUser)

// LOGOUT USER
router.get('/logout', user.logoutUser)

// TEST GET all users
router.get('/allUsers', user.allUsers)

module.exports = router;