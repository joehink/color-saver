const User = require('../../models/users');

module.exports = async (req, res, next) => {
  if (req.body.username.length === 0) {
    req.flash('error', 'Must provide a username.')
    return res.redirect('/users/new')
  }

  if (req.body.password.length === 0) {
    req.flash('error', 'Must provide a password.')
    return res.redirect('/users/new')
  }

  const user = await User.findOne({ username: req.body.username });

  if (user) {
    req.flash('error', 'Username already exists.')
    return res.redirect('/users/new')
  }
  next();
}
