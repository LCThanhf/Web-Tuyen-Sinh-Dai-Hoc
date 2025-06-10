import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateAdminSchool, validateAdminMajor, validateAdminCombination } from '../middleware/validation';

const router = Router();

// Apply authentication and admin role requirement to all routes
router.use(authenticateToken);
router.use(requireRole(['ADMIN', 'SUPER_ADMIN']));

// School Management
router.post('/schools', validateAdminSchool, AdminController.createSchool);
router.get('/schools', AdminController.getSchools);
router.get('/schools/:id', AdminController.getSchool);
router.put('/schools/:id', validateAdminSchool, AdminController.updateSchool);
router.delete('/schools/:id', AdminController.deleteSchool);

// Major Management
router.post('/majors', validateAdminMajor, AdminController.createMajor);
router.get('/majors', AdminController.getMajors);
router.get('/majors/:id', AdminController.getMajor);
router.put('/majors/:id', validateAdminMajor, AdminController.updateMajor);
router.delete('/majors/:id', AdminController.deleteMajor);

// Admission Combination Management
router.post('/combinations', validateAdminCombination, AdminController.createCombination);
router.get('/combinations', AdminController.getCombinations);
router.get('/combinations/:id', AdminController.getCombination);
router.put('/combinations/:id', validateAdminCombination, AdminController.updateCombination);
router.delete('/combinations/:id', AdminController.deleteCombination);

// Major-Combination Assignment
router.post('/majors/:majorId/combinations/:combinationId', AdminController.assignCombinationToMajor);
router.delete('/majors/:majorId/combinations/:combinationId', AdminController.removeCombinationFromMajor);
router.get('/majors/:majorId/combinations', AdminController.getMajorCombinations);

// Student Management
router.get('/students', AdminController.getStudents);
router.get('/students/:id', AdminController.getStudent);

// Document-specific routes (MUST come before generic routes)
router.get('/documents/personal-info', AdminController.getPersonalInfoDocuments);
router.put('/documents/personal-info/:id/approve', AdminController.approvePersonalInfo);
router.put('/documents/personal-info/:id/reject', AdminController.rejectPersonalInfo);

router.get('/documents/scores', AdminController.getScoreDocuments);
router.put('/documents/scores/:id/approve', AdminController.approveScores);
router.put('/documents/scores/:id/reject', AdminController.rejectScores);

router.get('/documents/priority', AdminController.getPriorityDocuments);
router.put('/documents/priority/:id/approve', AdminController.approvePriority);
router.put('/documents/priority/:id/reject', AdminController.rejectPriority);

router.get('/documents/achievement', AdminController.getAchievementDocuments);
router.put('/documents/achievement/:id/approve', AdminController.approveAchievement);
router.put('/documents/achievement/:id/reject', AdminController.rejectAchievement);

router.get('/documents/certificate', AdminController.getCertificateDocuments);
router.put('/documents/certificate/:id/approve', AdminController.approveCertificate);
router.put('/documents/certificate/:id/reject', AdminController.rejectCertificate);

// Generic Document Approval System (MUST come after specific routes)
router.get('/documents', AdminController.getPendingDocuments);
router.put('/documents/:type/:id/approve', AdminController.approveDocument);
router.put('/documents/:type/:id/reject', AdminController.rejectDocument);

// Application Management
router.get('/applications', AdminController.getApplications);
router.put('/applications/:id/approve', AdminController.approveApplication);
router.put('/applications/:id/reject', AdminController.rejectApplication);

export default router;
