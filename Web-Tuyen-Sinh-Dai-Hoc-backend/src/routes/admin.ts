import express from 'express';
import { body, query } from 'express-validator';
import {
  getDashboardStats,
  getAllStudents,
  getStudentDetails,
  updateStudentStatus
} from '../controllers/adminController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Dashboard statistics
router.get('/dashboard/stats', authenticateToken, requireRole(['ADMIN']), getDashboardStats);

// Get all students with pagination and filtering
router.get('/students', [
  authenticateToken,
  requireRole(['ADMIN']),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['all', 'pending', 'approved', 'rejected']).withMessage('Invalid status'),
  validateRequest
], getAllStudents);

// Get specific student details
router.get('/students/:studentId', authenticateToken, requireRole(['ADMIN']), getStudentDetails);

// Update student status
router.put('/students/:studentId/status', [
  authenticateToken,
  requireRole(['ADMIN']),
  body('status').isIn(['PENDING', 'APPROVED', 'REJECTED']).withMessage('Invalid status'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
  body('type').optional().isIn(['personal', 'priority', 'score', 'achievement']).withMessage('Invalid type'),
  validateRequest
], updateStudentStatus);

router.get('/health', (req, res) => {
  res.json({ message: 'Admin routes working' });
});

export default router;