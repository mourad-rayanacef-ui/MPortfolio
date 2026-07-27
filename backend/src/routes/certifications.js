const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certificationController');
const auth = require('../middleware/auth');

router.get('/', certificationController.getAllCertifications);
router.post('/', auth, certificationController.createCertification);
router.put('/:id', auth, certificationController.updateCertification);
router.delete('/:id', auth, certificationController.deleteCertification);

module.exports = router;