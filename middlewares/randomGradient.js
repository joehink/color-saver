module.exports = (req, res, next) => {
  const colorOne = `
    rgb(
      ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)}
    )
  `;

  const colorTwo = `
    rgb(
      ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)}
    )
  `;
  const randomGradient = `linear-gradient(to right, ${colorOne}, ${colorTwo})`;
  req.randomGradient = randomGradient;
  next();
}
