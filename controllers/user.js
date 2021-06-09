// MODEL
const User = require('../models/user');

module.exports.renderForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({email, username});
        const newUser = await User.register(user, password)
        req.login(newUser, err => {
            if (err) { return next(err)}
            req.flash('successUser', 'Succefully new user');
            res.redirect('/');
        })
    } catch (e) {
        req.flash('errorUser', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('successUser', 'Welcome back!')
    const redirectTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
}

module.exports.logoutUser = (req, res) => {
    req.logOut();
    req.flash('successUser', 'Right, back to the water :) ');
    res.redirect('/login');
}
module.exports.allUsers = async (req, res) => {
    const allUsers = await User.find({});
    res.send(allUsers)
}