const express = require('express');
const Proficiency = require('../models/Proficiency');
const router = express.Router();

function validateProficiencyData(req, res, next) {
  try {
    const { language, level, type } = req.body;
    if (!language || !level || !type) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    if (level < 1 || level > 5) {
      return res.status(400).json({ error: 'Level must be between 1 and 5.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function ensureUniqueProficiency(req, res, next) {
  try {
    const { language } = req.body;
    const prof = await Proficiency.findOne({ language });
    if (prof) {
      return res.status(400).json({ error: 'Proficiency for this language already exists.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

router.post('/create-proficiency', validateProficiencyData, ensureUniqueProficiency, async (req, res) => {
  try {
    const newProf = new Proficiency(req.body);
    await newProf.save();
    res.status(201).json(newProf);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/get-all-proficiencies', async (req, res) => {
  try {
    const proficiencies = await Proficiency.find().sort({ language: 1 });
    res.status(200).json(proficiencies);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/get-all-languages', async (req, res) => {
  try {
    const proficiencies = await Proficiency.find();
    const languages = proficiencies.map((p) => p.language);
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/get-proficiency', async (req, res) => {
  try {
    const { language } = req.query;
    const prof = await Proficiency.findOne({ language });
    if (!prof) {
      return res.status(404).json({ error: 'Proficiency not found' });
    }
    res.status(200).json(prof);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/get-proficiencies-by-type', async (req, res) => {
  try {
    let typeArray = req.query.type.split(',')
        .map(t => decodeURIComponent(t.trim()).replace(/\+/g, ' '));

    if (!typeArray.length) {
      return res.status(400).json({ error: 'Type parameter is required' });
    }

    const proficiencies = await Proficiency.find({ 
      type: { $all: typeArray } 
    });

    if (!proficiencies.length) {
      return res.status(404).json({ 
        error: `No proficiencies found that contain ALL types: ${typeArray.join(', ')}`,
      });
    }

    res.status(200).json(proficiencies);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/edit-proficiency', validateProficiencyData, async (req, res) => {
  try {
    const { originalLanguage, language, level, type } = req.body;
    const prof = await Proficiency.findOne({ language: originalLanguage });
    if (!prof) {
      return res.status(404).json({ error: 'Proficiency not found' });
    }
    prof.language = language;
    prof.level = level;
    prof.type = type;
    await prof.save();
    res.status(200).json(prof);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/delete-proficiency', async (req, res) => {
  try {
    const { language } = req.body;
    const prof = await Proficiency.findOneAndDelete({ language });
    if (!prof) {
      return res.status(404).json({ error: 'Proficiency not found' });
    }
    res.status(200).json({ message: 'Proficiency deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
