const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

function validateProjectData(req, res, next) {
    try {
        const { title, description, techStack, type } = req.body;
        if (!title || !description || !techStack || !type) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function ensureUniqueData(req, res, next) {
    try {
        const { title } = req.body;

        const project = await Project.findOne({ title });

        if (project) {
            return res.status(400).json({ error: 'Project with this title already exists.' });
        }

        next();
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

router.get('/get-all-projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ date: -1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/get-all-titles', async (req, res) => {
    try {
        const projects = await Project.find();
        const szTitleArr = new Array();
        projects.forEach((proj) => {
            szTitleArr.push(proj.title);
        });
        res.status(200).json(szTitleArr);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/get-project', async (req, res) => {
    try {
        const { title } = req.query;
        const project = await Project.findOne({ title });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/delete-project', async (req, res) => {
    try {
        const { title } = req.body;
        const project = await Project.findOneAndDelete({ title });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/edit-project', validateProjectData, async (req, res) => {
    try {
        const { originalTitle, title, type, description, techStack, link, date } = req.body;
        const project = await Project.findOne({ title: originalTitle });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        project.title = title;
        project.type = type;
        project.description = description;
        project.techStack = techStack;  
        project.link = link;
        project.date = date;
        await project.save();
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/create-project', validateProjectData, ensureUniqueData, async (req, res) => {
    try {
        const newProject = new Project(req.body);
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;