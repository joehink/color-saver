const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const colorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Color = mongoose.model('Color', colorSchema);

module.exports = Color;
