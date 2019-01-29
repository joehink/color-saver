// Models
const Project = require('../../models/projects');

module.exports = async (req, res, next) => {
  // Find project with id from req.params
  const project = await Project.findById(req.params.projectId);

  // If project was not created by currentUser
  if (project.createdBy !== req.session.currentUser._id) {
    // Redirect to page saying "Project does not belong to you"
    return res.redirect('/projects/notyours');
  }

  // Call next middleware
  next();
}
