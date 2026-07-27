const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certificationController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', certificationController.getAllCertifications);

// ✅ Use upload.fields() for multiple files
router.post('/', auth, upload.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'logo', maxCount: 1 }
]), certificationController.createCertification);

router.put('/:id', auth, upload.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'logo', maxCount: 1 }
]), certificationController.updateCertification);

router.delete('/:id', auth, certificationController.deleteCertification);

module.exports = router;