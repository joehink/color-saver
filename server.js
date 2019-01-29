require('dotenv').config();
// DEPENDENCIES
const express = require('express');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const randomGradient = require('./middlewares/randomGradient');
const requireLogin = require('./middlewares/requireLogin');
const session = require('express-session');

// CONFIGURATION
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/color_saver';

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());


// DATABASE
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
mongoose.connection.once('open', () => {
  console.log('Connected to db');
});

// LISTEN
app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});

// ROUTES
app.get('/', randomGradient, (req, res) => {
  // If there is a user logged in
  if (req.session.currentUser) {
    // Redirect to projects index
    res.redirect('/projects');
  } else {
    // Redirect to splash page
    res.render('index.ejs', { randomGradient: req.randomGradient });
  }
});

// Users Controller
const usersController = require('./controllers/users_controller');
app.use('/users', usersController);

// Sessions Controller
const sessionsController = require('./controllers/sessions_controller');
app.use('/sessions', sessionsController);

// Projects Controller
const projectsController = require('./controllers/projects_controller');
app.use('/projects', requireLogin, projectsController);

// Colors Controller
const colorsController = require('./controllers/colors_controller');
app.use('/projects/:projectId/colors', requireLogin, colorsController);
