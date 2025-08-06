import connectDB from '../lib/mongodb.js';
import otp from '../models/otp.js';
import { validateEmail, validateOTP, sanitizeEmail } from '../lib/validation.js';
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

    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const sanitizedEmail = sanitizeEmail(email);

    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (!validateOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be a 6-digit number'
      });
    }

    // Find the OTP record
    const otpRecord = await Otp.findOne({ 
      email: sanitizedEmail, 
      verified: false 
    }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or already verified. Please request a new OTP.'
      });
    }
    
    // Check attempts
    if (otpRecord.attempts >= 3) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }
    
    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, otpRecord.otp);
    
    if (!isValidOTP) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();
      
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - otpRecord.attempts} attempts remaining.`
      });
    }
    
    // Mark as verified and delete
    await Otp.deleteOne({ _id: otpRecord._id });
    
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully!'
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify OTP. Please try again.'
    });
  }
}
