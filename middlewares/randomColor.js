module.exports = (req, res, next) => {
  const randomColor = `
    rgb(
      ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)}
    )
  `;

  req.body.color = randomColor;
  next();
}
