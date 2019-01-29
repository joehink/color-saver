const Project = require('../../models/projects');

module.exports = async (req, res, next) => {
  const project = await Project.findById(req.params.projectId);

  if (project.createdBy !== req.session.currentUser._id) {
    return res.redirect('/projects/notyours');
  }

  next();
}
