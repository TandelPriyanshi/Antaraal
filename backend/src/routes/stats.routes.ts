import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { getUserStats } from '../controllers/stats.controller';

const router = Router();

// All routes in this file are protected by JWT authentication
router.use(auth);

// Get user statistics
router.get('/', getUserStats);

export default router;
