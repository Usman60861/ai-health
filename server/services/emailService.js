import nodemailer from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  // Gmail ke liye configuration
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD // Your Gmail App Password
    }
  });
};

// Send verification code email
export const sendVerificationEmail = async (email, code) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"AI Health Assistant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification Code - AI Health Assistant',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 30px;
              text-align: center;
              color: white;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .code {
              font-size: 36px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 8px;
              margin: 30px 0;
              padding: 20px;
              background: #f8f9ff;
              border-radius: 8px;
              display: inline-block;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            .warning {
              color: #e74c3c;
              font-size: 14px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 AI Health Assistant</h1>
              <p>Email Verification</p>
            </div>
            <div class="content">
              <h2>Welcome!</h2>
              <p>Thank you for signing up. Please use the verification code below to complete your registration:</p>
              
              <div class="code">${code}</div>
              
              <p>This code will expire in <strong>10 minutes</strong>.</p>
              
              <p class="warning">⚠️ If you didn't request this code, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 AI Health Assistant. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"AI Health Assistant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - AI Health Assistant',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 30px;
              text-align: center;
              color: white;
            }
            .content {
              padding: 40px 30px;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 AI Health Assistant</h1>
              <p>Password Reset Request</p>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              
              <center>
                <a href="${resetUrl}" class="button" style="color: white !important;">Reset Password</a>
              </center>
              
              <p style="margin-top: 20px;">Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; font-size: 12px; color: #333;">
                ${resetUrl}
              </p>
              
              <p>This link will expire in <strong>1 hour</strong>.</p>
              
              <p style="color: #e74c3c; margin-top: 20px;">⚠️ If you didn't request this, please ignore this email and your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>© 2024 AI Health Assistant. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};
