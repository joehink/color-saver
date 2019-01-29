// Models
const User = require('../models/users');
const Project = require('../models/projects');

module.exports = async (req, res, next) => {
  try {
    // Find project with id from req.params
    const project = await Project.findById(req.params.projectId);

    // If there is no project with that id
    if (!project) {
      // redirect to route saying "project was not found"
      return res.redirect('/projects/notfound');
    }

    // Call next middleware
    next();

  } catch (err) {
    // Something went wrong with query
    console.error(err);
    res.redirect('/projects');
  }
}
