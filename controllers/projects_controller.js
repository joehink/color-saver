const express = require('express');
const router = express.Router();

const User = require('../models/users');
const Project = require('../models/projects');

// Show projects belonging to user
router.get('/', async (req, res) => {
  try {
    // Find currentUser with populated projects
    const currentUser = await User.findById(req.session.currentUser._id)
                                  .populate('projects');

    // render all user projects in projects index
    res.render('projects/index.ejs', { projects: currentUser.projects });
  } catch (err) {
    console.error(err);
    res.redirect('/')
  }
});

// New project
router.get('/new', (req, res) => {
  res.render('projects/new.ejs');
});

// Edit project
router.get('/:id/edit', (req, res) => {
  res.send(req.pararms.id);
})

// Create Project
router.post('/', async (req, res) => {
  try {
    // Find currentUser
    const currentUser = await User.findById(req.session.currentUser._id);

    // Create new project
    const createdProject = await Project.create(req.body);

    // Add new project to array of projects in currentUser
    currentUser.projects.push(createdProject);

    // Save currentUser with the updated projects array
    currentUser.save();

    // redirect to projects index
    res.redirect('/projects');
  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
})

module.exports = router;
