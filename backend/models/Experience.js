const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    company: String,
    role: String,
    type: String,
    from: Date,
    to: Date,
    description: String,
});

module.exports = mongoose.model('Experience', experienceSchema);