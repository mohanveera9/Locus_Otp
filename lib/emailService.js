import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">OTP Verification</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <div style="background: #f0f0f0; padding: 25px; text-align: center; font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; border-radius: 10px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #666;">This OTP will expire in 5 minutes. Please do not share this code with anyone.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send OTP email');
  }
};