export const generateOTP = (length = 4) => {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp; // Example: "0482"
};


export const generateSecureOTP = (length = 4) => {
  if (length <= 0) return 0;

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(Math.random() * (max - min + 1)) + min; // Example: 4821
};
