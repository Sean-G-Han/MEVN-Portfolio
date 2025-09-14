const express = require('express')
const router = express.Router()
const Experience = require('../models/Experience')

function validateExperienceData(req, res, next) {
  try {
    const { company, role, type, description } = req.body;
    if (!company || !role || !type || !description) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function ensureUniqueExperience(req, res, next) {
  try {
    const { company } = req.body;
    const exp = await Experience.findOne({ company });
    if (exp) {
      return res.status(400).json({ error: 'Experience for this company already exists.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

router.post('/create-experience', validateExperienceData, ensureUniqueExperience, async (req, res) => {
  try {
    const experience = new Experience(req.body)
    await experience.save()
    res.status(201).json(experience)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/get-all-companies', async (req, res) => {
  try {
    const companies = await Experience.find().distinct('company')
    res.json(companies)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/get-all-experiences', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ to: -1 })
    res.json(experiences)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/get-experience', async (req, res) => {
  try {
    const { company } = req.query
    const experience = await Experience.findOne({ company })
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' })
    }
    res.json(experience)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/edit-experience', validateExperienceData, async (req, res) => {
  try {
    const { originalCompany, company, role, type, from, to, description } = req.body
    const updated = await Experience.findOneAndUpdate(
      { company: originalCompany },
      { company, role, type, from, to, description },
      { new: true }
    )
    if (!updated) {
      return res.status(404).json({ error: 'Experience not found' })
    }
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/delete-experience', async (req, res) => {
  try {
    const { company } = req.body
    const deleted = await Experience.findOneAndDelete({ company })
    if (!deleted) {
      return res.status(404).json({ error: 'Experience not found' })
    }
    res.json({ message: 'Experience deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
