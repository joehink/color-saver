module.exports = (req, res, next) => {
  // Generate one random color
  const colorOne = `
    rgb(
      ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)}
    )
  `;

  // Generate a second random color
  const colorTwo = `
    rgb(
      ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)}
    )
  `;

  // Build gradient value
  const randomGradient = `linear-gradient(to right, ${colorOne}, ${colorTwo})`;

  // Attach randomGradient to req object
  req.randomGradient = randomGradient;

  // Call next middleware
  next();
}
