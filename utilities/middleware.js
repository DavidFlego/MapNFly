
// Joi validation
const { sessionSchema } = require('../utilities/schemas.js');

// Error handlers
const ExpressError = require('../utilities/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {   
    // console.log("REQ:USER", req.user); 
    if ( !req.isAuthenticated() ) {
        req.session.returnTo = req.originalUrl; // store requested URL
        req.flash('error', 'You must be logged in.')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateSession = (req, res, next) => {
    const { error } = sessionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        // next( new ExpressError(msg, 400) );
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}