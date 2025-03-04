// controllers/projectController.js
const Project = require('../models/Project');
const User = require('../models/User');

// Get all projects for a user
exports.getProjects = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).populate('projects');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ projects: user.projects });
    } catch (error) {
        console.error('Get Projects Error:', error);
        res.status(500).json({ error: 'Error fetching projects' });
    }
};

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const userId = req.user.userId;
        const projectData = req.body;
        
        if (req.file) {
            projectData.pdfFilePath = req.file.path;
        }
        
        const project = new Project(projectData);
        await project.save();
        
        await User.findByIdAndUpdate(userId, { $push: { projects: project._id } });
        
        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        console.error('Create Project Error:', error);
        res.status(500).json({ error: 'Error creating project' });
    }
};

// Get a specific project
exports.getProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.userId;
        
        const user = await User.findById(userId);
        if (!user || !user.projects.includes(projectId)) {
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.status(200).json({ project });
    } catch (error) {
        console.error('Get Project Error:', error);
        res.status(500).json({ error: 'Error fetching project' });
    }
};

// Update a project
exports.updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.userId;
        const updateData = req.body;

        if (req.file) {
            updateData.pdfFilePath = req.file.path;
        }
        
        const user = await User.findById(userId);
        if (!user || !user.projects.includes(projectId)) {
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        
        const project = await Project.findByIdAndUpdate(projectId, updateData, { new: true });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.status(200).json({ message: 'Project updated successfully', project });
    } catch (error) {
        console.error('Update Project Error:', error);
        res.status(500).json({ error: 'Error updating project' });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.userId;
        
        const user = await User.findById(userId);
        if (!user || !user.projects.includes(projectId)) {
            return res.status(403).json({ message: 'Unauthorized access to project' });
        }
        
        await User.findByIdAndUpdate(userId, { $pull: { projects: projectId } });
        await Project.findByIdAndDelete(projectId);
        
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Delete Project Error:', error);
        res.status(500).json({ error: 'Error deleting project' });
    }
};
