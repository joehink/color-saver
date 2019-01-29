// Models
const Color = require('../../models/colors');

module.exports = async (req, res, next) => {
  // Find color with id from req.params
  const color = await Color.findById(req.params.colorId);

  // if color was not created by the current user
  if (color.createdBy !== req.session.currentUser._id) {
    // Redirect to page saying "Color does not belong to you"
    return res.redirect(`/projects/${req.params.projectId}/colors/notyours`);
  }

  // Call next middleware
  next();
}
