const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const methodOverride = require('method-override');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const cadets = require('./models/cadetreg');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const path = require("path");
const flash = require('connect-flash');
const { isLoggedIn, fetchChartData } = require('./middleware'); // Import the CadetregSchema from your schema file


const app = express();


mongoose.connect("mongodb://localhost:27017/your database name", {});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: give single inverted comma '' inside it give any secret key that u wanna use,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}




app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('uploads'));
//template
app.set('view engine', 'ejs');
app.use(
    express.urlencoded({ extended: true })
);

app.use(express.json());

//middleware route
app.use("", require('./routes copy/cadetoperation'));
app.use("", require('./routes copy/users'));
app.use("", require('./routes copy/excel'));




const Campground = require('./models/cadetreg'); // Assuming you have a model for campgrounds

app.get('/home', async (req, res) => {
    res.render('home');
});


app.get('/index', async (req, res) => {
    res.render('index');
});



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen(5000, () => {
    console.log('Serving on port 5000')
})
