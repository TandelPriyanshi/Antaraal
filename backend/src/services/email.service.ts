import * as nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';

config();

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Create Gmail transporter (will be initialized when needed)
let gmailTransporter: nodemailer.Transporter | null = null;
const createGmailTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // false for port 587, true for 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 15000,    // 15 seconds
    socketTimeout: 60000,     // 60 seconds
    logger: true,
    debug: true,
    tls: {
      rejectUnauthorized: false,
      ciphers: 'SSLv3'
    },
    pool: true, // Use connection pool
    maxConnections: 1,
    maxMessages: 1
  });
};

gmailTransporter = createGmailTransporter();

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}
export const sendEmail = async (options: EmailOptions): Promise<{ success: boolean; message: string; service: string }> => {
  const log = (message: string, data?: any) => {
    console.log(`[${new Date().toISOString()}] ${message}`, data || '');
  };

  // DEVELOPMENT MODE: Show OTP in console for testing
  if (process.env.NODE_ENV === 'development') {
    console.log('='.repeat(50));
    console.log('🚨 DEVELOPMENT MODE - OTP FOR TESTING');
    console.log(`📧 To: ${options.to}`);
    console.log(`🔑 OTP: ${options.text?.match(/OTP: (\d+)/)?.[1] || 'Check email content'}`);
    console.log('='.repeat(50));
  }

  // Try SendGrid first if API key is available
  if (process.env.SENDGRID_API_KEY) {
    try {
      log('📤 Attempting to send email via SendGrid...', { to: options.to });

      const msg = {
        to: options.to,
        from: process.env.SENDGRID_FROM_EMAIL || 'apikey@sendgrid.net',
        subject: options.subject,
        html: options.html,
        text: options.text || options.subject,
      };
      await sgMail.send(msg);
      log('✅ Email sent successfully via SendGrid');
      return { success: true, message: 'Email sent successfully', service: 'SendGrid' };

    } catch (error: any) {
      log('❌ SendGrid failed', {
        error: error?.message,
        code: error?.code,
        response: error?.response?.body?.errors,
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      });
      // Don't throw error, continue to Gmail fallback
    }
  }

  try {
    log('📤 Attempting to send email via Gmail SMTP...', { to: options.to });

    const mailOptions = {
      from: `"Antaraal" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.subject,
    };

    // Send the email with a timeout
    const sendPromise = new Promise<nodemailer.SentMessageInfo>((resolve, reject) => {
      if (!gmailTransporter) {
        return reject(new Error('Gmail transporter is not available'));
      }
      gmailTransporter.sendMail(mailOptions, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('SMTP connection timeout')), 60000)
    );

    const result = await Promise.race([sendPromise, timeoutPromise]) as nodemailer.SentMessageInfo;

    log('✅ Email sent successfully via Gmail SMTP', {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected
    });

    return {
      success: true,
      message: 'Email sent successfully',
      service: 'Gmail SMTP'
    };

  } catch (error: any) {
    log('❌ Gmail SMTP failed', {
      error: error?.message,
      code: error?.code,
      command: error?.command,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });

    if (error.code === 'EAUTH') {
      throw new Error('Authentication failed. Please check your email credentials.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Connection to email server failed. Please check your internet connection.');
    } else {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // If we reach here, both SendGrid and Gmail failed
  const fallbackError = '❌ Both SendGrid and Gmail SMTP failed to send email. Please check your email configuration.';
  log(fallbackError);
  throw new Error(fallbackError);
};

export const generateOTP = (): string => {
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