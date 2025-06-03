import express from 'express';
import { body, query } from 'express-validator';
import {
  getStudentProofs,
  createProof,
  updateProofStatus,
  getAllProofsForAdmin
} from '../controllers/proofController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Health check - MUST come first
router.get('/health', (req, res) => {
  res.json({ message: 'Proof routes working' });
});

// Get all proofs for admin review - specific routes before parameter routes
router.get('/admin', [
  authenticateToken,
  requireRole(['ADMIN']),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['all', 'pending', 'approved', 'rejected']).withMessage('Invalid status'),
  validateRequest
], getAllProofsForAdmin);

// Get student's proofs
router.get('/', authenticateToken, requireRole(['STUDENT']), getStudentProofs);

// Create new proof
router.post('/', [
  authenticateToken,
  requireRole(['STUDENT']),
  body('type').notEmpty().withMessage('Proof type is required'),
  body('fileName').optional().isString().withMessage('File name must be a string'),
  body('filePath').optional().isString().withMessage('File path must be a string'),
  body('isRequired').optional().isBoolean().withMessage('Is required must be a boolean'),
  validateRequest
], createProof);

// Update proof status (admin only)
router.put('/:proofId/status', [
  authenticateToken,
  requireRole(['ADMIN']),
  body('status').isIn(['PENDING', 'APPROVED', 'REJECTED']).withMessage('Invalid status'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
  validateRequest
], updateProofStatus);

export default router;