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
    subject: 'Your Locus Verification Code',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFF8F2;">
        <div style="background-color: #003B73; padding: 40px 20px; text-align: center;">
          <h1 style="color: #FFF8F2; margin: 0; font-size: 28px; font-weight: bold;">Locus Verification</h1>
          <p style="color: #FFF8F2; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your one-time verification code</p>
        </div>
        
        <div style="padding: 40px 30px; background-color: #FFF8F2;">
          <p style="color: #003B73; font-size: 18px; margin: 0 0 20px 0; line-height: 1.6; font-weight: 600;">
            Your verification code is ready
          </p>
          
          <p style="color: #777777; font-size: 16px; margin: 0 0 30px 0; line-height: 1.6;">
            Use this one-time verification code to complete your authentication. This code will expire in 5 minutes for your security.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <div style="background-color: #FFF8F2; border: 3px solid #003B73; color: #003B73; padding: 20px 32px; border-radius: 12px; display: inline-block; font-weight: bold; font-size: 36px; letter-spacing: 8px; font-family: monospace; box-shadow: 0 4px 12px rgba(0,59,115,0.15);">
              ${otp}
            </div>
          </div>
          
          <div style="background-color: #B6BEC7; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #003B73;">
            <p style="color: #003B73; font-size: 14px; margin: 0; font-weight: 500;">
              <strong>Security Notice:</strong> This verification code will expire in 5 minutes. Never share this code with anyone, including Locus support staff.
            </p>
          </div>
          
          <p style="color: #777777; font-size: 14px; margin: 20px 0 0 0; line-height: 1.5;">
            <strong>Didn't request this code?</strong> If you didn't attempt to verify your account, please ignore this email. Your account remains secure.
          </p>
        </div>
        
        <div style="background-color: #003B73; padding: 25px 20px; text-align: center;">
          <p style="color: #FFF8F2; margin: 0 0 8px 0; font-size: 16px; font-weight: 500;">
            Questions? We're here to help.
          </p>
          <p style="color: #FFF8F2; margin: 0; font-size: 14px; opacity: 0.8;">
            The Locus Team
          </p>
        </div>
        
        <div style="padding: 20px; background-color: #B6BEC7; text-align: center;">
          <p style="font-size: 12px; color: #777777; margin: 0; line-height: 1.4;">
            You received this email because a verification code was requested for this email address.<br>
            If you didn't request this code, please disregard this message.<br>
            <strong>Locus</strong> - Location-based chat platform
          </p>
        </div>
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