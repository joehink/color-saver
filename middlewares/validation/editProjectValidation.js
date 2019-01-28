module.exports = (req, res, next) => {
  if (req.body.title.length === 0) {
    req.flash('error', 'Project must have a title.')
    res.redirect(`/projects/${req.params.id}/edit`);
  }
  next();
}
