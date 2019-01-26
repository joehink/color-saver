module.exports = (req, res, next) => {
  // If there is no user logged in
  if (req.session.currentUser) {
    // redirect to sign up or log in
    return next();
  }
  res.redirect('/')
}
