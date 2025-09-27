import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-otp', authController.resendOTP);

// Protected route example
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// Debug route to test middleware
router.post('/debug-resend-otp', (req, res) => {
  console.log('Debug route hit:', req.path, req.method);
  res.json({ message: 'Debug endpoint working' });
});

export default router;
