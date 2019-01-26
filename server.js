require('dotenv').config();
// DEPENDENCIES
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const requireLogin = require('./middlewares/requireLogin');
const session = require('express-session');

// CONFIGURATION
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

// DATABASE
mongoose.connect(MONGO_URI, { useNewUrlParser: true })
mongoose.connection.once('open', () => {
  console.log('Connected to db');
})

// LISTEN
app.listen(PORT, () => {
  console.log('Listening on port', PORT);
})

// ROUTES
app.get('/', (req, res) => {
  if (req.session.currentUser) {
    res.redirect('/projects');
  } else {
    res.render('index.ejs');
  }
})

const usersController = require('./controllers/users_controller');
app.use('/users', usersController);

const sessionsController = require('./controllers/sessions_controller');
app.use('/sessions', sessionsController);

const projectsController = require('./controllers/projects_controller');
app.use('/projects', requireLogin, projectsController);

const colorsController = require('./controllers/colors_controller');
app.use('/projects/:projectId/colors', requireLogin, colorsController);
