const express = require('express');
const router = express.Router();

// Color Middleware
const randomGradient = require('../middlewares/randomGradient');
const randomColor = require('../middlewares/randomColor');

// Form Validation Middleware
const createProjectValidation = require('../middlewares/validation/createProjectValidation');
const editProjectValidation = require('../middlewares/validation/editProjectValidation');

// Check if exists Middleware
const doesProjectExist = require('../middlewares/doesProjectExist');
const projectBelongsToUser = require('../middlewares/authorization/projectBelongsToUser');


// Models
const User = require('../models/users');
const Project = require('../models/projects');
const Color = require('../models/colors');


// 404 Route
router.get('/notfound', randomGradient, (req, res) => {
  // render page saying "project was not found."
  res.render('projects/notfound.ejs', {
    randomGradient: req.randomGradient
  })
});

// 401 (not authourized) Route
router.get('/notyours', randomGradient, (req, res) => {
  // Render page saying "project does not belong to you"
  res.render('projects/notyours.ejs', {
    randomGradient: req.randomGradient
  })
});

// Show index of projects belonging to user
router.get('/', async (req, res) => {
  try {
    // Find currentUser with populated projects
    const currentUser = await User.findById(req.session.currentUser._id)
                                  .populate({ path: 'projects', options: {
                                    sort: { 'createdAt': -1 }
                                  }});

    // render all user projects in projects index
    res.render('projects/index.ejs', {
      projects: currentUser.projects
    });
  } catch (err) {
    // Something went wrong with query
    console.error(err);
    res.redirect('/')
  }
});


// New project
router.get('/new', randomGradient, (req, res) => {
  // render page with form to create new project
  res.render('projects/new.ejs', {
    randomGradient: req.randomGradient,
    message: req.flash('error')
  });
});


// Show project
router.get('/:projectId', doesProjectExist, async (req, res) => {
  try {
    // find project
    const foundProject = await Project.findById(req.params.projectId)
                                      .populate('colors');

    // render project show page with project data
    res.render('projects/show.ejs', {
      userId: req.session.currentUser._id,
      project: foundProject
    });
  } catch (err) {
    // Something went wrong with query
    console.error(err);
    res.redirect('/projects');
  }
});


// Edit project
router.get('/:projectId/edit', doesProjectExist, projectBelongsToUser, randomGradient, async (req, res) => {
  try {
    // find project
    const foundProject = await Project.findById(req.params.projectId);

    // render project edit page with project data
    res.render('projects/edit.ejs', {
      project: foundProject,
      randomGradient: req.randomGradient,
      message: req.flash('error')
    });
  } catch (err) {
    // Something went wrong with query
    console.error(err);
    res.redirect(`/projects/${req.params.projectId}`);
  }
});


// Update project
router.patch('/:projectId', editProjectValidation, async (req, res) => {
  try {
    // PATCH because we dont't want to lose the colors array in the project
    // update title and description with req.body
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      { $set: req.body },
      { new: true }
    );

    // redirect to project show page
    res.redirect(`/projects/${req.params.projectId}`);
  } catch (err) {
    // Something went wrong with query
    console.error(err);
    res.redirect('/projects');
  }
});


// Create Project
router.post('/', createProjectValidation, randomColor, async (req, res) => {
  try {
    // add currentUser id to req.body
    req.body.createdBy = req.session.currentUser._id;
    
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
    // Something went wrong with query
    console.error(err);
    res.redirect('/projects');
  }
});


router.delete('/:projectId', async (req, res) => {
  try {
    // Remove reference to project in user
    const updatedUser = await User.findByIdAndUpdate(
      req.session.currentUser._id,
      { $pull: { projects: req.params.projectId } },
      { new: true }
    );

    // Delete project from db
    const deletedProject = await Project.findByIdAndRemove(req.params.projectId);

    // Delete Colors that were in project
    const deletedColors = await Color.deleteMany({
      _id: { $in: deletedProject.colors }
    });

    // redirect to index of user projects
    res.redirect('/projects');
  } catch (err) {
    // Something went wrong with query
    console.error(err);
    res.redirect('/projects');
  }
});


module.exports = router;
