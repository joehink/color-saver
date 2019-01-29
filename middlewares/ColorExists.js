const Color = require('../models/colors');

module.exports = async (req, res, next) => {
  try {
    const color = await Color.findById(req.params.colorId);

    if (!color) {
      return res.redirect(`/projects/${req.params.projectId}/colors/notfound`);
    }

    next();
  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
}
