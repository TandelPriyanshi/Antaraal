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
    user.emailVerificationExpires = otpExpires;
    if (profilePic) user.profilePic = profilePic;
    await userRepository.save(user);

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'Verify Your Email - Antaraal',
        html: generateEmailVerificationHTML(otp, username),
        text: `Hi ${username}, please verify your email with OTP: ${otp}. This OTP will expire in 10 minutes.`,
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Don't fail registration if email fails, but log it
      // In production, you might want to handle this differently
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email for verification code.',
      userId: user.id,
      email: user.email,
      requiresVerification: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        message: 'Please verify your email before logging in',
        requiresVerification: true,
        userId: user.id
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

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
    console.error('Login error:', error);
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
      await sendEmail({
        to: email,
        subject: 'Verify Your Email - Antaraal (Resent)',
        html: generateEmailVerificationHTML(otp, user.username),
        text: `Hi ${user.username}, please verify your email with OTP: ${otp}. This OTP will expire in 10 minutes.`,
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return res.status(500).json({ message: 'Error sending email' });
    }

    res.json({
      message: 'Verification code sent successfully',
      userId: user.id
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Error resending verification code' });
  }
};
