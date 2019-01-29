module.exports = (req, res, next) => {
  // Create one randomColor
  const randomColor = `
    rgb(
      ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)}
    )
  `;

  // Attach randomColor to req.body
  // This color will be used in list of projects
  req.body.color = randomColor;

  // Call next middleware
  next();
}
