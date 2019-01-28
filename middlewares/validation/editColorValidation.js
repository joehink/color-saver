module.exports = (req, res, next) => {
  // https://stackoverflow.com/questions/1636350/how-to-identify-a-given-string-is-hex-color-format
  const hexRegEx = new RegExp('^#(?:[0-9a-fA-F]{3}){1,2}$');

  // https://eddyerburgh.me/validate-rgb-or-rgba-value-in-javascript
  const rgbRegEx = /^([R][G][B][A]?[(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(\s*,\s*((0\.[0-9]{1})|(1\.0)|(1)))?[)])$/i

  if (req.body.name.length === 0) {
    req.flash('error', 'Must provide a name for the color.')
    return res.redirect(`/projects/${req.params.projectId}/colors/${req.params.id}/edit`);
  }

  if (!hexRegEx.test(req.body.value) && !rgbRegEx.test(req.body.value)) {
    req.flash('error', 'Must provide either a Hexidecimal or RGB color value.');
    return res.redirect(`/projects/${req.params.projectId}/colors/${req.params.id}/edit`);
  }

  next();
}
