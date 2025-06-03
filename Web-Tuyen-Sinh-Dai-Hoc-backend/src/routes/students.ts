import express from 'express';
import { body } from 'express-validator';
import { 
  getProfile, 
  updatePersonalInfo, 
  getPersonalInfoStatus,
  updatePersonalInfoStatus 
} from '../controllers/studentController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Get student profile
router.get('/profile', authenticateToken, requireRole(['STUDENT']), getProfile);

// Update personal information
router.put('/personal-info', [
  authenticateToken,
  requireRole(['STUDENT']),
  body('fullName').optional().isLength({ min: 1 }).withMessage('Full name cannot be empty'),
  body('phone').optional().matches(/^[0-9]{10,11}$/).withMessage('Invalid phone number'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  validateRequest
], updatePersonalInfo);

// Get personal info status
router.get('/personal-info/status', authenticateToken, requireRole(['STUDENT']), getPersonalInfoStatus);

// Admin routes for updating status
router.put('/personal-info/:studentId/status', [
  authenticateToken,
  requireRole(['ADMIN']),
  body('status').isIn(['PENDING', 'APPROVED', 'REJECTED']).withMessage('Invalid status'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
  validateRequest
], updatePersonalInfoStatus);

export default router;