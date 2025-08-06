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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0;">OTP Verification</h2>
        </div>
        <p style="font-size: 16px; color: #555;">Hello,</p>
        <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) for verification is:</p>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 30px 0; padding: 25px; text-align: center; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <div style="font-size: 32px; font-weight: bold; color: white; letter-spacing: 8px; font-family: 'Courier New', monospace;">
            ${otp}
          </div>
        </div>
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            ⚠️ This OTP will expire in <strong>5 minutes</strong>. Please do not share this code with anyone.
          </p>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          If you didn't request this OTP, please ignore this email or contact support if you have concerns.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
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
