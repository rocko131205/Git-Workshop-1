const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new user
router.post('/signup', authController.signup);

// Generate OTP
router.post('/generate-otp', authController.generateOtp);

// Verify OTP and login
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;