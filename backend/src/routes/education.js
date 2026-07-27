const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', educationController.getEducation);

// Support both general create/update and ID-specific updates/creations
router.post('/', auth, upload.single('certificate'), educationController.createEducation);
router.put('/:id', auth, upload.single('certificate'), educationController.updateEducation);
router.delete('/:id', auth, educationController.deleteEducation);

// ✅ Use upload.fields() for certification routes with multiple files
router.post('/certifications', auth, upload.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'logo', maxCount: 1 }
]), educationController.addCertification);

router.put('/certifications/:id', auth, upload.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'logo', maxCount: 1 }
]), educationController.updateCertification);

router.delete('/certifications/:id', auth, educationController.deleteCertification);

router.post('/courses', auth, educationController.addCourse);
router.put('/courses/:id', auth, educationController.updateCourse);
router.delete('/courses/:id', auth, educationController.deleteCourse);

module.exports = router;