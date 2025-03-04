const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Project = require('../models/Project'); // Ensure this points to the correct schema

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save to 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Multer upload setup
const upload = multer({ storage });

// File upload route
router.post('/upload', upload.array('documents', 10), async (req, res) => {
  try {
    console.log('📁 Received files:', req.files);
    console.log('📝 Received form data:', req.body);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Store file paths
    const filePaths = req.files.map(file => file.path);

    // Create project data
    const projectData = {
      ...req.body,
      documents: filePaths,
    };

    // Save project to DB
    const project = new Project(projectData);
    await project.save();

    res.status(201).json({ message: 'Project uploaded successfully', project });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

module.exports = router;
