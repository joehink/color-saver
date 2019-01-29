const express = require('express');
const router = express.Router({mergeParams: true});

const randomGradient = require('../middlewares/randomGradient');
const createColorValidation = require('../middlewares/validation/createColorValidation');
const editColorValidation = require('../middlewares/validation/editColorValidation');
const colorExists = require('../middlewares/colorExists');
const projectExists = require('../middlewares/projectExists');

const Project = require('../models/projects');
const Color = require('../models/colors');

router.get('/notfound', randomGradient, (req, res) => {
  res.render('colors/notfound.ejs', {
    randomGradient: req.randomGradient
  })
});
//
// router.get('/notyours', randomGradient, (req, res) => {
//   res.render('colors/notyours.ejs', {
//     randomGradient: req.randomGradient
//   })
// })

// New color
router.get('/new', projectExists, randomGradient, (req, res) => {
  // render new color page
  res.render('colors/new.ejs', {
    projectId: req.params.projectId,
    randomGradient: req.randomGradient,
    message: req.flash('error')
  });
});


// Show color
router.get('/:colorId', colorExists, async (req, res) => {
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
    console.error(err);
    res.redirect(`/projects/${req.params.projectId}`);
  }
});


// Edit color
router.get('/:colorId/edit', colorExists, async (req, res) => {
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
    console.error(err);
    res.redirect(`/projects/${req.params.projectId}`);
  }
});


// Create color
router.post('/', createColorValidation, async (req, res) => {
  try {
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
    console.error(err);
    res.redirect(`/projects/${req.params.projectId}/colors/${req.params.colorId}`)
  }
})


module.exports = router;
