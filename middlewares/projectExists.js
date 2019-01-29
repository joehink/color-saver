const User = require('../models/users');
const Project = require('../models/projects');

module.exports = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.redirect('/projects/notfound');
    }

    next();

  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
}
