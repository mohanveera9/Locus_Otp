const bcrypt = require('bcryptjs');
const Otp = require('../models/Otp');
const { generateOTP } = require('../utils/otpGenerator');
const { sendOTPEmail } = require('../utils/emailService');

class OTPService {
  async sendOTP(email) {
    try {
      // Generate new OTP
      const otp = generateOTP(6);
      
      // Hash the OTP before storing
      const saltRounds = 10;
      const hashedOTP = await bcrypt.hash(otp, saltRounds);
      
      // Delete any existing OTPs for this email
      await Otp.deleteMany({ email });
      
      // Create new OTP record
      const otpRecord = new Otp({
        email,
        otp: hashedOTP
      });
      
      await otpRecord.save();
      
      // Send email
      await sendOTPEmail(email, otp);
      
      return {
        success: true,
        message: 'OTP sent successfully',
        expiresIn: '5 minutes'
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to send OTP');
    }
  }

  async verifyOTP(email, otp) {
    try {
      // Find the OTP record
      const otpRecord = await Otp.findOne({ 
        email, 
        verified: false 
      }).sort({ createdAt: -1 });
      
      if (!otpRecord) {
        return {
          success: false,
          message: 'OTP not found or already verified'
        };
      }
      
      // Check attempts
      if (otpRecord.attempts >= 3) {
        await Otp.deleteOne({ _id: otpRecord._id });
        return {
          success: false,
          message: 'Too many failed attempts. Please request a new OTP'
        };
      }
      
      // Verify OTP
      const isValidOTP = await bcrypt.compare(otp, otpRecord.otp);
      
      if (!isValidOTP) {
        // Increment attempts
        otpRecord.attempts += 1;
        await otpRecord.save();
        
        return {
          success: false,
          message: `Invalid OTP. ${3 - otpRecord.attempts} attempts remaining`
        };
      }
      
      // Mark as verified and delete
      await Otp.deleteOne({ _id: otpRecord._id });
      
      return {
        success: true,
        message: 'OTP verified successfully'
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to verify OTP');
    }
  }
}

module.exports = new OTPService();
