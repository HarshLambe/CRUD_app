const { cadetregSchema } = require('./schemas.js');
const cadetreg = require('./models/cadetreg')
const ExpressError = require('./utils/ExpressError');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validatecadetreg = (req, res, next) => {
    const { error } = cadetregSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Middleware to fetch and attach chart data to request object
module.exports.fetchChartData = async (req, res, next) => {
    try {
        // Assuming you have a model to fetch chart data for the user
        const chartData = await genderChart.findOne({ author: req.user._id }); // Assuming author field stores user ID

        // Attach chart data to request object for later use
        req.chart = chartData;

        next(); // Proceed to the next middleware
    } catch (error) {
        console.error('Error fetching chart data:', error);
        req.flash('error', 'Error fetching chart data');
        res.redirect('/home'); // Redirect to home page or other appropriate page
    }
};







