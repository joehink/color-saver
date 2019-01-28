require('dotenv').config();
// DEPENDENCIES
const express = require('express');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
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
// app.use(expressValidator());
app.use(flash());
// app.use((req, res, next) => {
//   res.locals.messages = require('express-messages')(req, res);
//   next();
// });

// DATABASE
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
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
