import connectDB from '../lib/mongodb.js';
import Otp from '../models/Otp.js';
import { generateOTP } from '../lib/otpGenerator.js';
import { sendOTPEmail } from '../lib/emailService.js';
import { validateEmail, sanitizeEmail } from '../lib/validation.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    await connectDB();

    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const sanitizedEmail = sanitizeEmail(email);

    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Generate new OTP
    const otp = generateOTP(6);
    
    // Hash the OTP before storing
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    
    // Delete any existing OTPs for this email
    await Otp.deleteMany({ email: sanitizedEmail });
    
    // Create new OTP record
    const otpRecord = new Otp({
      email: sanitizedEmail,
      otp: hashedOTP
    });
    
    await otpRecord.save();
    
    // Send email
    await sendOTPEmail(sanitizedEmail, otp);
    
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      expiresIn: '5 minutes'
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP. Please try again.'
    });
  }
}