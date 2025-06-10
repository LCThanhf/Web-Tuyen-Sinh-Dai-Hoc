import { Router } from 'express';
import { ResultsController } from '../controllers/resultsController';
import { authenticateToken, requireStudent } from '../middleware/auth';

const router = Router();

// Public route for checking results by CCCD (no authentication required)
router.get('/check/:cccd', ResultsController.checkResultsByCCCD);

// Public admission statistics (no authentication required)
router.get('/statistics', ResultsController.getAdmissionStatistics);

// Public admission updates feed (no authentication required)
router.get('/updates', ResultsController.getAdmissionUpdates);

// Student-specific routes (authentication required)
router.use(authenticateToken);
router.use(requireStudent);

// Get student's own admission results
router.get('/my-results', ResultsController.getStudentResults);

export default router;
