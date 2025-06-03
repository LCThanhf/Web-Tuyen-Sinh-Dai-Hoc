import express from 'express';
import { body, query } from 'express-validator';
import {
  getAllMajors,
  getMajorsBySchool,
  createMajor,
  updateMajor,
  deleteMajor
} from '../controllers/majorController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Get all majors (with optional school filter)
router.get('/', [
  query('schoolId').optional().isString().withMessage('School ID must be a string'),
  validateRequest
], getAllMajors);

// Get majors by school
router.get('/school/:schoolId', getMajorsBySchool);

// Create new major (admin only)
router.post('/', [
  authenticateToken,
  requireRole(['ADMIN']),
  body('name').notEmpty().withMessage('Major name is required'),
  body('code').notEmpty().withMessage('Major code is required'),
  body('schoolId').notEmpty().withMessage('School ID is required'),
  body('quota').isInt({ min: 1 }).withMessage('Quota must be a positive integer'),
  validateRequest
], createMajor);

// Update major (admin only)
router.put('/:majorId', [
  authenticateToken,
  requireRole(['ADMIN']),
  body('name').optional().notEmpty().withMessage('Major name cannot be empty'),
  body('code').optional().notEmpty().withMessage('Major code cannot be empty'),
  body('quota').optional().isInt({ min: 1 }).withMessage('Quota must be a positive integer'),
  validateRequest
], updateMajor);

// Delete major (admin only)
router.delete('/:majorId', authenticateToken, requireRole(['ADMIN']), deleteMajor);

router.get('/health', (req, res) => {
  res.json({ message: 'Major routes working' });
});

export default router;