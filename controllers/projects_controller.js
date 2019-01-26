const express = require('express');
const router = express.Router();

// Show projects belonging to user
router.get('/', (req, res) => {
  res.render('projects/index.ejs');
});

// New project
router.get('/new', (req, res) => {
  res.render('projects/new.ejs');
});

// Create Project
router.post('/', (req, res) => {
  res.send('created');
})

module.exports = router;
