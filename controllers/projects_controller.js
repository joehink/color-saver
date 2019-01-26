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

// Show project
router.get('/:id', async (req, res) => {
  try {
    // find project
    const foundProject = await Project.findById(req.params.id);

    // render project show page with project data
    res.render('projects/show.ejs', { project: foundProject });
  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
});

// Edit project
router.get('/:id/edit', async (req, res) => {
  try {
    // find project
    const foundProject = await Project.findById(req.params.id);

    // render project edit page with project data
    res.render('projects/edit.ejs', { project: foundProject });
  } catch (err) {
    console.error(err);
    res.redirect(`/projects/${req.params.id}`);
  }
});

// Update project
router.patch('/:id', async (req, res) => {
  try {
    // PATCH because we dont't want to lose the colors array in the project
    // update title and description with req.body
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    // redirect to project show page
    res.redirect(`/projects/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
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
});

module.exports = router;
