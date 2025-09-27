import { Request, Response, NextFunction } from 'express';
import { auth } from './auth.middleware';

// List of public routes that don't require authentication
const publicRoutes = [
  { path: '/api/auth/register', method: 'POST' },
  { path: '/api/auth/login', method: 'POST' },
  { path: '/api/auth/verify-email', method: 'POST' },
  { path: '/api/auth/resend-otp', method: 'POST' },
  { path: '/health', method: 'GET' },
];

/**
 * Middleware to protect all routes by default
 * Excludes routes defined in publicRoutes
 */
export const protectAllRoutes = (req: Request, res: Response, next: NextFunction) => {
  // Check if the current route is in the public routes list
  const isPublicRoute = publicRoutes.some(
    (route) => {
      const pathMatch = req.path === route.path;
      const methodMatch = req.method === route.method;
      return pathMatch && methodMatch;
    }
  );

  // If it's a public route, skip authentication
  if (isPublicRoute) {
    return next();
  }

  // Otherwise, require authentication
  return auth(req, res, next);
};
