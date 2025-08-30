import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route example
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
