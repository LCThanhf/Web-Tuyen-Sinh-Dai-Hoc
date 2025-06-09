import { Router } from 'express';
import { VirtualFilterController } from '../controllers/virtualFilterController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// All virtual filter routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Main virtual filtering endpoint
router.post('/run', [
  body('schoolId').optional().isUUID().withMessage('Valid school ID required'),
  body('majorId').optional().isUUID().withMessage('Valid major ID required'),
  body('minScore').optional().isFloat({ min: 0 }).withMessage('Minimum score must be non-negative'),
  body('maxResults').optional().isInt({ min: 1 }).withMessage('Max results must be positive'),
  body('simulationMode').optional().isBoolean().withMessage('Simulation mode must be boolean'),
  handleValidationErrors
], VirtualFilterController.runVirtualFilter);

// Get admission quotas and fill status
router.get('/quotas', VirtualFilterController.getAdmissionQuotas);

// Get cutoff score predictions
router.get('/cutoffs', VirtualFilterController.getCutoffPrediction);

// Simulate quota scenarios
router.post('/simulate', [
  body('majorId').isUUID().withMessage('Valid major ID required'),
  body('scenarios').isArray({ min: 1 }).withMessage('At least one scenario required'),
  body('scenarios.*.quota').isInt({ min: 0 }).withMessage('Quota must be non-negative integer'),
  handleValidationErrors
], VirtualFilterController.simulateQuotaScenarios);

export default router;
