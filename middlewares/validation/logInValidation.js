// Models
const User = require('../../models/users');

module.exports = async (req, res, next) => {
  // If username is not provided
  if (req.body.username.length === 0) {
    // Send error saying "Must provide a username."
    req.flash('error', 'Must provide a username.')
    // Redirect back to login form
    return res.redirect('/sessions/new');
  }

  // If password is not provided
  if (req.body.password.length === 0) {
    // Send error saying "Must provide a password."
    req.flash('error', 'Must provide a password.')
    // Redirect back to login form
    return res.redirect('/sessions/new');
  }

  // Find user with provided username
  const user = await User.findOne({
    lowercaseUsername: req.body.username.toLowerCase()
  });

  // If user does not exist
  if (!user) {
    // Send error saying "Username does not exist."
    req.flash('error', 'Username does not exist.')
    // Redirect back to login form
    return res.redirect('/sessions/new');
  }

  // Call next middleware
  next();
}
