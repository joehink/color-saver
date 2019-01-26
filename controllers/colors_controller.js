const express = require('express');
const router = express.Router({mergeParams: true});

const Project = require('../models/projects');
const Color = require('../models/colors');

// New color
router.get('/new', (req, res) => {
  res.render('colors/new.ejs', {
    projectId: req.params.projectId
  });
});


// Create color
router.post('/', async (req, res) => {
  try {
    // Create a new color with req.body
    const createdColor = await Color.create(req.body);

    // Find current project
    const project = await Project.findById(req.params.projectId);

    // Add color to project's color array
    project.colors.push(createdColor);

    // Save updated project
    project.save();

    // redirect to project share page
    res.redirect(`/projects/${req.params.projectId}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/projects/${req.params.projectId}`);
  }
});


module.exports = router;
