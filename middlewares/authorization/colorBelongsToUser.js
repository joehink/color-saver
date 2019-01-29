const Color = require('../../models/colors');

module.exports = async (req, res, next) => {
  const color = await Color.findById(req.params.colorId);

  if (color.createdBy !== req.session.currentUser._id) {
    return res.redirect(`/projects/${req.params.projectId}/colors/notyours`);
  }

  next();
}
