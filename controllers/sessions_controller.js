const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const User = require('../models/users');

// Render log in page
router.get('/new', (req, res) => {
  res.render('sessions/new.ejs');
});

// Log In
router.post('/', async (req, res)=>{
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
      // Password was incorrect
      res.send('<a href="/">Wrong password</a>');
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
