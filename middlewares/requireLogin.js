module.exports = (req, res, next) => {
  // If there is a user logged in
  if (req.session.currentUser) {
    // Move to next middleware
    return next();
  }

  // redirect to sign up or log in
  res.redirect('/')
}
