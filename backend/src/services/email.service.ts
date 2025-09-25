import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export const generateOTP = (): string => {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateEmailVerificationHTML = (otp: string, username: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Email Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          color: #6366f1;
          font-size: 24px;
          font-weight: bold;
        }
        .otp-code {
          background-color: #f8fafc;
          border: 2px dashed #6366f1;
          padding: 20px;
          text-align: center;
          font-size: 32px;
          font-weight: bold;
          color: #6366f1;
          letter-spacing: 4px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .warning {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          color: #92400e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Antaraal</div>
          <h1>Email Verification</h1>
        </div>

        <p>Hi ${username},</p>
        <p>Welcome to Antaraal! Please verify your email address to complete your account setup.</p>

        <div class="otp-code">
          ${otp}
        </div>

        <div class="warning">
          <strong>Security Note:</strong> This OTP will expire in 10 minutes for your security.
        </div>

        <p>If you didn't create an account with Antaraal, please ignore this email.</p>

        <div class="footer">
          <p>This email was sent from Antaraal. Please do not reply to this email.</p>
          <p>&copy; 2024 Antaraal. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
