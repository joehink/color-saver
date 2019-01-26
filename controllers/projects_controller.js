const express = require('express');
const router = express.Router();
 
var ObjectID = require('mongodb').ObjectID;

const Project = require('../models/projects');

// Show projects belonging to user
router.get('/', async (req, res) => {
  const userProjects = await Project.find({
    createdBy: new ObjectID(req.session.currentUser._id)
  });
  console.log('currentUser', req.session.currentUser._id);
  console.log('projects', userProjects);
  res.render('projects/index.ejs', { projects: userProjects });
});

// New project
router.get('/new', (req, res) => {
  res.render('projects/new.ejs');
});

// Create Project
router.post('/', async (req, res) => {
  try {
    // Assign createdBy property eaqual to currentUser id
    req.body.createdBy = req.session.currentUser._id;
    console.log(req.body);
    // Add project to db
    const createdProject = await Project.create(req.body);

    res.redirect('/projects');
  } catch (err) {
    console.error(err);
    res.redirect('/projects');
  }
})

module.exports = router;
