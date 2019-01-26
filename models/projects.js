const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: String
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
