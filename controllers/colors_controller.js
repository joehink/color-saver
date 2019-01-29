const express = require('express');
const router = express.Router({mergeParams: true});

// Color Middleware
const randomGradient = require('../middlewares/randomGradient');

// Form Validation Middleware
const createColorValidation = require('../middlewares/validation/createColorValidation');
const editColorValidation = require('../middlewares/validation/editColorValidation');

// Check if exists Middleware
const doesColorExist = require('../middlewares/doesColorExist');
const doesProjectExist = require('../middlewares/doesProjectExist');

// Authorization Middleware
const projectBelongsToUser = require('../middlewares/authorization/projectBelongsToUser');
const colorBelongsToUser = require('../middlewares/authorization/colorBelongsToUser');


// Models
const Project = require('../models/projects');
const Color = require('../models/colors');

// 404 Route
router.get('/notfound', randomGradient, (req, res) => {
  // render page saying "color was not found."
  res.render('colors/notfound.ejs', {
    randomGradient: req.randomGradient
  })
});

// 401 (not authourized) Route
router.get('/notyours', randomGradient, (req, res) => {
  // Render page saying "color does not belong to you"
  res.render('colors/notyours.ejs', {
    randomGradient: req.randomGradient
  })
})

// New color
router.get('/new', doesProjectExist, projectBelongsToUser, randomGradient, (req, res) => {
  // render new color page
  res.render('colors/new.ejs', {
    projectId: req.params.projectId,
    randomGradient: req.randomGradient,
    message: req.flash('error')
  });
});


// Show color
router.get('/:colorId', doesColorExist, async (req, res) => {
  try {
    // Find color to show
    const foundColor = await Color.findById(req.params.colorId);

    // render show page with foundColor
    res.render('colors/show.ejs', {
      userId: req.session.currentUser._id,
      color: foundColor,
      projectId: req.params.projectId
    });
  } catch (err) {
    // Something went wrong with query
    console.error(err);
    res.redirect(`/projects/${req.params.projectId}`);
  }
});


// Edit color
router.get('/:colorId/edit', doesColorExist, colorBelongsToUser, async (req, res) => {
  try {
    // Find color to edit
    const foundColor = await Color.findById(req.params.colorId);

    // render edit page with foundColor
    res.render('colors/edit.ejs', {
      color: foundColor,
      projectId: req.params.projectId,
      message: req.flash('error')
    });
  } catch (err) {
    // Something went wrong with query
    console.error(err);
    res.redirect(`/projects/${req.params.projectId}`);
  }
});


// Create color
router.post('/', createColorValidation, async (req, res) => {
  try {
    // add currentUser id to req.body
    req.body.createdBy = req.session.currentUser._id;

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
    // Something went wrong with query
    console.error(err);
    res.redirect(`/projects/${req.params.projectId}`);
  }
});


// Update color
router.put('/:colorId', editColorValidation, async (req, res) => {
  try {
    // find color and update with req.body
    const oldColor = await Color.findByIdAndUpdate(req.params.colorId, req.body);

    // redirect to color show page
    res.redirect(`/projects/${req.params.projectId}/colors/${req.params.colorId}`);
  } catch (err) {
    // Something went wrong with query
    console.error(err);
    res.redirect(`/projects/${req.params.projectId}/colors/${req.params.colorId}`);
  }
});


// Delete color
router.delete('/:colorId', async (req, res) => {
  try {
    // find color and delete from db
    const deletedColor = await Color.findByIdAndRemove(req.params.colorId);

    // Remove reference to color in project
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      { $pull: { colors: req.params.colorId } },
      { new: true }
    );

    // redirect to project show page
    res.redirect(`/projects/${req.params.projectId}`)
  } catch (err) {
    // Something went wrong with query
    console.error(err);
    res.redirect(`/projects/${req.params.projectId}/colors/${req.params.colorId}`)
  }
})


module.exports = router;
