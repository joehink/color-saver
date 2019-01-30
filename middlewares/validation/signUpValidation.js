// Models
const User = require('../../models/users');

module.exports = async (req, res, next) => {
  // If username is not provided
  if (req.body.username.length === 0) {
    // Send error saying "Must provide a username."
    req.flash('error', 'Must provide a username.');
    // Redirect back to sign up form
    return res.redirect('/users/new');
  }

  // If password is not provided
  if (req.body.password.length === 0) {
    // Send error saying "Must provide a password."
    req.flash('error', 'Must provide a password.');
    // Redirect back to sign up form
    return res.redirect('/users/new');
  }

  // Find user with provided username
  const user = await User.findOne({
    lowercaseUsername: req.body.username.toLowerCase()
  });

  // If user exists
  if (user) {
    // Send error saying "Username already exists."
    req.flash('error', 'Username already exists.');
    // Redirect back to sign up form
    return res.redirect('/users/new');
  }

  // Call next middleware
  next();
}
