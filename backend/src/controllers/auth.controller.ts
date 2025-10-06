import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Users } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_CONFIG, BCRYPT_SALT_ROUNDS } from '../config/jwt.config';
import { sendEmail, generateOTP, generateEmailVerificationHTML } from '../services/email.service';

const userRepository = AppDataSource.getRepository(Users);

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, pic_url: profilePic } = req.body;

    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // Generate OTP and expiration time (10 minutes from now)
    const otp = generateOTP();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 10);

    // Create new user with email verification pending
    const user = new Users();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    user.isEmailVerified = false;
    user.emailVerificationToken = otp;
    if (profilePic) user.profilePic = profilePic;
    await userRepository.save(user);

    // Send verification email
    try {
      const emailResult = await sendEmail({
        to: email,
        subject: 'Verify Your Email - Antaraal',
        html: generateEmailVerificationHTML(otp, username),
        text: `Hi ${username}, please verify your email with OTP: ${otp}. This OTP will expire in 10 minutes.`,
      });
      
      // Return success response with user ID (but don't log in yet)
      return res.status(201).json({
        message: 'Registration successful. Please check your email to verify your account.',
        userId: user.id,
        email: user.email,
        requiresVerification: true,
        emailSent: emailResult.success,
        service: emailResult.service
      });
      
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Still return success but indicate email might not have been sent
      // This is to prevent OTP guessing attacks
      return res.status(201).json({
        message: 'Registration successful, but we encountered an issue sending the verification email. You can request a new one later.',
        userId: user.id,
        email: user.email,
        requiresVerification: true,
        emailSent: false
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Backend: Login attempt for email:', email);

    // Find user
    const user = await userRepository.findOne({ where: { email } });
    console.log('Backend: User found:', user ? 'YES' : 'NO');

    if (!user) {
      console.log('Backend: User not found, returning 401');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password first
    console.log('Backend: Checking password');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Backend: Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Backend: Password invalid, returning 401');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified only after password is correct
    console.log('Backend: Email verified:', user.isEmailVerified);
    if (!user.isEmailVerified) {
      console.log('Backend: Email not verified, returning verification required');
      return res.status(401).json({
        message: 'Please verify your email before logging in',
        requiresVerification: true,
        userId: user.id,
        email: user.email
      });
    }

    console.log('Backend: Login successful, generating token');
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_CONFIG.SECRET,
      { expiresIn: JWT_CONFIG.EXPIRES_IN } as jwt.SignOptions
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Backend: Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.body;

    // Find user
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Check if OTP is valid and not expired
    if (user.emailVerificationToken !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Verify email and clear OTP data
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await userRepository.save(user);

    // Generate token for immediate login
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_CONFIG.SECRET,
      { expiresIn: JWT_CONFIG.EXPIRES_IN } as jwt.SignOptions
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Email verified successfully. Please sign in to continue.',
      user: userWithoutPassword,
      token,
      redirectToSignIn: true
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Error verifying email' });
  }
};

export const getOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the current OTP for development purposes
    if (process.env.NODE_ENV === 'development' && user.emailVerificationToken) {
      return res.json({
        otp: user.emailVerificationToken,
        expires: user.emailVerificationExpires,
        message: 'Development mode: OTP shown for testing'
      });
    }

    return res.status(404).json({ message: 'OTP not found or not in development mode' });

  } catch (error) {
    console.error('Get OTP error:', error);
    res.status(500).json({ message: 'Error retrieving OTP' });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new OTP and expiration time (10 minutes from now)
    const otp = generateOTP();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 10);

    // Update user with new OTP
    user.emailVerificationToken = otp;
    user.emailVerificationExpires = otpExpires;
    await userRepository.save(user);

    // Send verification email
    try {
      const emailResult = await sendEmail({
        to: email,
        subject: 'Verify Your Email - Antaraal (Resent)',
        html: generateEmailVerificationHTML(otp, user.username),
        text: `Hi ${user.username}, please verify your email with OTP: ${otp}. This OTP will expire in 10 minutes.`,
      });

      return res.json({
        message: 'Verification code sent successfully',
        userId: user.id,
        emailSent: emailResult.success,
        service: emailResult.service
      });

    } catch (emailError: any) {
      console.error('Error sending verification email:', emailError);
      // Still return success but indicate email might not have been sent
      // This is to prevent OTP guessing attacks
      return res.status(202).json({
        message: emailError.message || 'Failed to send verification email. Please try again later.',
        userId: user.id,
        emailSent: false
      });
    }

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Error resending verification code' });
  }
};
