const User = require('../models/users');
const Project = require('../models/projects');

module.exports = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.redirect('/projects/notfound');
    }

    const user = await User.findOne({ projects: req.params.id })

    if (user.id !== req.session.currentUser._id) {
      return res.redirect('/projects/notyours');
    }

    next()

  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
}
