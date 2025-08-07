export const generateOTP = (length = 4) => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  
  return otp;
};

export const generateSecureOTP = (length = 4) => {
  const max = Math.pow(10, length) - 1;
  const min = Math.pow(10, length - 1);
  
  return Math.floor(Math.random() * (max - min + 1)) + min;
};