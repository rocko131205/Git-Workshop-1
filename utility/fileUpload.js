// fileUploads.js
const multer = require('multer');
const path = require('path');

// Set storage engine for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filenames
    }
});

// File filter to accept only PDF files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

// Configure multer upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
    fileFilter: fileFilter
});

module.exports = upload;
