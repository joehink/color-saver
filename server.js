require('dotenv').config();
// DEPENDENCIES
const express = require('express');

// CONFIGURATION
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// MIDDLEWARE


// DATABASE


// LISTEN
app.listen(PORT, () => {
  console.log('Listening on port', PORT);
})
