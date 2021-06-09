if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');

const User = require('./models/user');

// layout, partial and block template functions for the EJS template engine.
const ejsMate = require('ejs-mate');

// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
const methodOverride = require('method-override');

// Error handlers
const ExpressError = require('./utilities/ExpressError');

// ROUTES
const sessionRouter = require('./routes/sessionRoute'); 
const userRouter = require('./routes/userRoute');

// PASSPORT
const passport = require('passport'); // allow us to plugin strategies
const LocalStrategy = require('passport-local');

// HELMET - headers manipulation - security
const helmet = require('helmet');

// MONGOOSE / MONGO
// process.env.DB_URL; // Production
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/mapnfly'
const mongoose = require('mongoose');
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

// EXPRESS SESSION
const session = require('express-session');
const MongoStore = require('connect-mongo'); // for storing sessions on MOngo not in memory
const secret = process.env.SECRET || 'thisShouldBeABetterSecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    autoRemove: 'native', // Default
    crypto: {
        secret,
    },
    touchAfter: 24 * 60 * 60
});

store.on('error', function() {
    console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {
    store, // store session on Mongo
    name: 'XsessionX', // 'Some other name for the sessions, for better security',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // little extra security
        // secure: true, // https
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}

// FLASH MESSAGES
const flash = require('connect-flash');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); // for exmpl. load .css files from /public/css
app.use('/public', express.static('public')); // load .js files from /public/script...
app.use(session(sessionConfig));
app.use(helmet({contentSecurityPolicy: false}));

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // how to store user in session
passport.deserializeUser(User.deserializeUser()); // how to remove user from session

app.use(flash());
app.use( (req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.successSession = req.flash('successSession');
    res.locals.successUser = req.flash('successUser');
    res.locals.errorSession = req.flash('errorSession');
    res.locals.errorUser = req.flash('errorUser');
    res.locals.error = req.flash('error');
    next();
});

// ROUTE HANDLERs
app.use('/sessions', sessionRouter);
app.use('/', userRouter);


app.get('/', async (req, res) => {
    if ( req.isAuthenticated() ) {
        const user = await User.findById(req.user._id).populate('sessions');
        res.render('home', { user });      
    } else {
        res.render('home', { user: "undefined" });
    }
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404));
    
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('./partials/error', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});