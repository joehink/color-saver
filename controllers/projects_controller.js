const express = require('express');
const router = express.Router();

const randomGradient = require('../middlewares/randomGradient');
const randomColor = require('../middlewares/randomColor');

const User = require('../models/users');
const Project = require('../models/projects');
const Color = require('../models/colors');

// Show index of projects belonging to user
router.get('/', async (req, res) => {
  try {
    // Find currentUser with populated projects
    const currentUser = await User.findById(req.session.currentUser._id)
                                  .populate('projects');

    // render all user projects in projects index
    res.render('projects/index.ejs', {
      projects: currentUser.projects
    });
  } catch (err) {
    console.error(err);
    res.redirect('/')
  }
});


// New project
router.get('/new', randomGradient, (req, res) => {
  res.render('projects/new.ejs', { randomGradient: req.randomGradient });
});


// Show project
router.get('/:id', async (req, res) => {
  try {
    // find project
    const foundProject = await Project.findById(req.params.id)
                                      .populate('colors');

    // render project show page with project data
    res.render('projects/show.ejs', { project: foundProject });
  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
});


// Edit project
router.get('/:id/edit', randomGradient, async (req, res) => {
  try {
    // find project
    const foundProject = await Project.findById(req.params.id);

    // render project edit page with project data
    res.render('projects/edit.ejs', {
      project: foundProject,
      randomGradient: req.randomGradient
    });
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
});


// Create Project
router.post('/', randomColor, async (req, res) => {
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


router.delete('/:id', async (req, res) => {
  try {
    // Remove reference to project in user
    const updatedUser = await User.findByIdAndUpdate(
      req.session.currentUser._id,
      { $pull: { projects: req.params.id } },
      { new: true }
    );

    // Delete project from db
    const deletedProject = await Project.findByIdAndRemove(req.params.id);

    // Delete Colors that were in project
    const deletedColors = await Color.deleteMany({
      _id: { $in: deletedProject.colors }
    });

    // redirect to index of user projects
    res.redirect('/projects');
  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
});


module.exports = router;
