const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');

router.get('/', universityController.getAll);
router.post('/', universityController.create);

module.exports = router;
