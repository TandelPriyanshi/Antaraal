import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Users } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_CONFIG, BCRYPT_SALT_ROUNDS } from '../config/jwt.config';

const userRepository = Users.getRepository(AppDataSource);

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, pic_url } = req.body;

    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // Create new user
    const user = new Users();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    if (pic_url) user.pic_url = pic_url;
    await userRepository.save(user);

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_CONFIG.SECRET,
      { expiresIn: JWT_CONFIG.EXPIRES_IN } as jwt.SignOptions
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      user: userWithoutPassword,
      token
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
