const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const logInValidation = require('../middlewares/validation/logInValidation');
const randomGradient = require('../middlewares/randomGradient');

const User = require('../models/users');

// Render log in page
router.get('/new', randomGradient, (req, res) => {
  res.render('sessions/new.ejs', {
    message: req.flash('error'),
    randomGradient: req.randomGradient
  });
});

// Log In
router.post('/', logInValidation, async (req, res)=>{
  try {
    // Query for user with given username
    const foundUser = await User.findOne({
      lowercaseUsername: req.body.username.toLowerCase()
    })

    // If given password matches password for foundUser
    if(bcrypt.compareSync(req.body.password, foundUser.password)) {
      // Set the foundUser as the current user
      req.session.currentUser = foundUser;

      // Redirect to the user's projects
      res.redirect('/projects');
    } else {
      req.flash('error', "Incorrect password.")
      // Password was incorrect
      res.redirect('/sessions/new');
    }
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Log Out
router.delete('/', (req, res)=>{
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
