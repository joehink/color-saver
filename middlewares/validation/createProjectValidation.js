module.exports = (req, res, next) => {
  if (req.body.title.length === 0) {
    req.flash('error', 'Project must have a title.')
    return res.redirect('/projects/new');
  }
  next();
}
