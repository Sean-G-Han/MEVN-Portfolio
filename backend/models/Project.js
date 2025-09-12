const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  type: String,
  description: String,
  techStack: [String],
  link: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);