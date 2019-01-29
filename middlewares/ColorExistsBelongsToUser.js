const User = require('../models/users');
const Project = require('../models/projects');
const Color = require('../models/colors');

module.exports = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.redirect('/projects/notfound');
    }

    const user = await User.findOne({ projects: req.params.projectId })

    if (user.id !== req.session.currentUser._id) {
      return res.redirect('/projects/notyours');
    }

    const color = await Color.findById(req.params.id);

    if (!color) {
      return res.redirect(`/projects/${req.params.projectId}/colors/notfound`);
    }

    const projectWithColor = await Project.findOne({ colors: req.params.id });

    if (projectWithColor.id !== req.params.projectId) {
      return res.redirect(`/projects/${req.params.projectId}/colors/notyours`);
    }

    next();
  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
}
