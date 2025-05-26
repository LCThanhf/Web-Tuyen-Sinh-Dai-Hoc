const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const applicationController = require('../controllers/applicationController');

router.post('/submit', upload.single('document'), applicationController.submit);
router.get('/user/:user_id', applicationController.getByUser);

router.get('/all', applicationController.getAll);
router.put('/update-status/:id', applicationController.updateStatus);


module.exports = router;
