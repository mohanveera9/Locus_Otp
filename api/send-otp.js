import connectDB from '../lib/mongodb.js';
import Otp from '../models/Otp.js';
import { generateOTP } from '../lib/otpGenerator.js';
import { sendOTPEmail } from '../lib/emailService.js';
import { validateEmail, sanitizeEmail } from '../lib/validation.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const sanitizedEmail = sanitizeEmail(email);
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    const otp = generateOTP(4);
    const hashedOTP = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({ email: sanitizedEmail });
    
    const otpRecord = new Otp({
      email: sanitizedEmail,
      otp: hashedOTP
    });
    
    await otpRecord.save();
    await sendOTPEmail(sanitizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: '5 minutes'
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP'
    });
  }
}