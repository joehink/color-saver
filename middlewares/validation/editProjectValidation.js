module.exports = (req, res, next) => {
  // If no project title is provided
  if (req.body.title.length === 0) {
    // Send error saying "Project must have a title"
    req.flash('error', 'Project must have a title.')
    // Redirect back to edit project form
    return res.redirect(`/projects/${req.params.id}/edit`);
  }
  // Call next middleware
  next();
}
