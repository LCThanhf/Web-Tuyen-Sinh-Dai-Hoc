import express from 'express';

const router = express.Router();

// TODO: Implement application management routes
// Examples:
// - GET /api/applications - Get student's applications
// - POST /api/applications - Create new application
// - PUT /api/applications/:id - Update application
// - DELETE /api/applications/:id - Delete application
// - GET /api/applications/school/:schoolId - Get applications by school (admin)

router.get('/health', (req, res) => {
  res.json({ message: 'Application routes working' });
});

export default router;