const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/university', statsController.byUniversity);
router.get('/major', statsController.byMajor);
router.get('/status', statsController.byStatus);

module.exports = router;
