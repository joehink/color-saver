module.exports = (req, res, next) => {
  // If no project title is provided
  if (req.body.title.length === 0) {
    // Send error saying "Project must have a title"
    req.flash('error', 'Project must have a title.')
    // Redirect back to new project form
    return res.redirect('/projects/new');
  }
  // Call next middleware
  next();
}
