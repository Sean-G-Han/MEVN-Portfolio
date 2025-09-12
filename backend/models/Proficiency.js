const mongoose = require('mongoose');

const proficiencySchema = new mongoose.Schema({
  language: String,
  level: { type: Number, min: 1, max: 5 },
  type: [String],
});

module.exports = mongoose.model('Proficiency', proficiencySchema);