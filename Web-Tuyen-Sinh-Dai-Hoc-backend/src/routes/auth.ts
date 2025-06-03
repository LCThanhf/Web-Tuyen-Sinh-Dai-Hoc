import express from 'express';
import { body } from 'express-validator';
import { register, login, refreshToken, logout } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Register route - only basic fields required
router.post('/register', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('citizenId').matches(/^[0-9]{9,12}$/).withMessage('Invalid citizen ID format'),
  body('phone').matches(/^[0-9]{10,11}$/).withMessage('Invalid phone number'),
  body('dob').notEmpty().withMessage('Date of birth is required'),
  body('gender').isIn(['MALE', 'FEMALE']).withMessage('Invalid gender'),
  validateRequest
], register);

// Login route - now accepts CCCD instead of email
router.post('/login', [
  body('cccd').matches(/^[0-9]{9,12}$/).withMessage('Invalid CCCD format'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
], login);

// Refresh token
router.post('/refresh', refreshToken);

// Logout
router.post('/logout', logout);

export default router;