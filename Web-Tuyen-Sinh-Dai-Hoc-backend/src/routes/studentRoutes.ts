import { Router } from 'express';
import { StudentController } from '../controllers/studentController';
import { ApplicationController } from '../controllers/applicationController';
import { authenticateToken, requireStudent } from '../middleware/auth';
import { 
  validatePersonalInfo, 
  validateScore, 
  validatePriority
} from '../middleware/validation';

const router = Router();

// All student routes require authentication and student role
router.use(authenticateToken);
router.use(requireStudent);

// Personal Information routes
router.get('/personal-info', StudentController.getPersonalInfo);
router.put('/personal-info', validatePersonalInfo, StudentController.updatePersonalInfo);

// Scores routes
router.get('/scores', StudentController.getScores);
router.post('/scores', validateScore, StudentController.upsertScore);

// Priority routes
router.get('/priority', StudentController.getPriority);
router.put('/priority', validatePriority, StudentController.updatePriority);

// Achievement routes
router.get('/achievement', StudentController.getAchievement);
router.put('/achievement', StudentController.updateAchievement);

// Certificate routes
router.get('/certificate', StudentController.getCertificate);
router.put('/certificate', StudentController.updateCertificate);

// Application routes
router.get('/applications', ApplicationController.getApplications);
router.post('/applications', ApplicationController.submitApplication);
router.delete('/applications/:id', ApplicationController.deleteApplication);

// Delete routes for documents
router.delete('/scores/:id', StudentController.deleteScore);
router.delete('/personal-info', StudentController.deletePersonalInfo);
router.delete('/priority', StudentController.deletePriority);
router.delete('/achievement', StudentController.deleteAchievement);
router.delete('/certificate', StudentController.deleteCertificate);

export default router;