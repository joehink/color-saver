require('dotenv').config();
// DEPENDENCIES
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// CONFIGURATION
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

// DATABASE
mongoose.connect(MONGO_URI, { useNewUrlParser: true })
mongoose.connection.once('open', () => {
  console.log('Connected to db');
})

// LISTEN
app.listen(PORT, () => {
  console.log('Listening on port', PORT);
})

// ROUTES
