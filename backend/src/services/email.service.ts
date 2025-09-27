import * as nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';

config();

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
}

// Gmail transporter (fallback)
const gmailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    console.log('🔄 Attempting to send email to:', options.to);
    console.log('📧 SendGrid API Key:', process.env.SENDGRID_API_KEY ? 'Set' : 'Not set');
    console.log('📧 Gmail credentials:', process.env.EMAIL_USER ? 'Set' : 'Not set');

    // Try SendGrid first (if API key is available)
    if (process.env.SENDGRID_API_KEY) {
      try {
        console.log('📤 Trying SendGrid...');

        const msg = {
          to: options.to,
          from: process.env.EMAIL_USER || 'noreply@antaraal.com',
          subject: options.subject,
          html: options.html,
          text: options.text,
        };

        await sgMail.send(msg);
        console.log(`✅ Email sent successfully via SendGrid to ${options.to}`);
        return;
      } catch (sendGridError) {
        console.error('❌ SendGrid failed:', sendGridError);
        console.log('🔄 Falling back to Gmail...');
      }
    }

    // Fallback to Gmail
    console.log('📤 Trying Gmail SMTP...');

    // Verify Gmail connection
    try {
      await gmailTransporter.verify();
      console.log('✅ Gmail SMTP connection verified');
    } catch (verifyError) {
      console.error('❌ Gmail SMTP connection failed:', verifyError);
      throw new Error(`Gmail SMTP connection failed: ${verifyError}`);
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const result = await gmailTransporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully via Gmail! Message ID: ${result.messageId}`);

  } catch (error: any) {
    console.error('❌ Final email error:', {
      message: error.message,
      code: error.code,
      response: error.response,
      command: error.command
    });

    // Provide specific error messages
    if (error.code === 'EAUTH') {
      throw new Error('❌ AUTHENTICATION FAILED! Check your Gmail app password or SendGrid API key.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('❌ CONNECTION FAILED! Check your internet connection and firewall settings.');
    } else {
      throw new Error(`❌ EMAIL FAILED: ${error.message}`);
    }
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