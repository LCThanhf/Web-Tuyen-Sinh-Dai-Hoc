import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All analytics routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Core Analytics Routes - Basic requirements

// Dashboard overview statistics
router.get('/dashboard', AnalyticsController.getDashboardStats);

// School-wise application statistics  
router.get('/schools', AnalyticsController.getSchoolApplicationStats);

// Major-wise application statistics
router.get('/majors', AnalyticsController.getMajorApplicationStats);

// Application status statistics
router.get('/status', AnalyticsController.getApplicationStatusStats);

// Recent applications activity
router.get('/recent', AnalyticsController.getRecentApplications);

// Document verification statistics
router.get('/documents', AnalyticsController.getDocumentStats);

// Basic application trends (last 30 days)
router.get('/trends', AnalyticsController.getApplicationTrends);

export default router;
