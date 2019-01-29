// Models
const Color = require('../models/colors');

module.exports = async (req, res, next) => {
  try {
    // Find Color with id in req.params
    const color = await Color.findById(req.params.colorId);

    // If no color exists with that id
    if (!color) {
      // Redirect to page saying "color was not found."
      return res.redirect(`/projects/${req.params.projectId}/colors/notfound`);
    }

    // Call next middleware
    next();
  } catch (err) {
    // Something went wrong with query
    console.error(err);
    res.redirect('/projects');
  }
}
