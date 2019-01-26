const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  colors: [{ type: Schema.Types.ObjectId, ref: 'Color' }]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
