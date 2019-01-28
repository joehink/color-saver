const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const signUpValidation = require('../middlewares/validation/signUpValidation');
const randomGradient = require('../middlewares/randomGradient');

const User = require('../models/users');

router.get('/new', randomGradient, (req, res) => {
  // Render sign up page
  res.render('users/new.ejs', {
    message: req.flash('error'),
    randomGradient: req.randomGradient
  });
})

router.post('/', signUpValidation, async (req, res) => {
  try {
    // replace string password with encrypted password using bcrypt
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    // Save lowercase version of username
    req.body.lowercaseUsername = req.body.username.toLowerCase();

    // Create new user with username and encrypted password
    const createdUser = await User.create(req.body);

    // Set the created user as the new current user
    req.session.currentUser = createdUser;

    // Redirect to the projects page
    res.redirect('/projects');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
})

module.exports = router;
