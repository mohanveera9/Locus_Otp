const OTPService = require('../services/otpService');

const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const result = await OTPService.sendOTP(email);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    const result = await OTPService.verifyOTP(email, otp);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};
