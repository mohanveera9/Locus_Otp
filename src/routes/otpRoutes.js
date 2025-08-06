const express = require('express');
const { sendOTP, verifyOTP } = require('../controllers/otpController');
const { validateEmail, validateOTP, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/otp/send
// @desc    Send OTP to email
// @access  Public
router.post('/send', validateEmail, handleValidationErrors, sendOTP);

// @route   POST /api/otp/verify
// @desc    Verify OTP
// @access  Public
router.post('/verify', validateOTP, handleValidationErrors, verifyOTP);

module.exports = router;
