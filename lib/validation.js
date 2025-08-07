export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateOTP = (otp) => {
  return /^\d{4}$/.test(otp);
};

export const sanitizeEmail = (email) => {
  return email.toLowerCase().trim();
};
