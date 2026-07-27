const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', experienceController.getAllExperiences);
router.get('/:id', experienceController.getExperience);
router.post('/', auth, upload.single('companyLogo'), experienceController.createExperience);
router.put('/:id', auth, upload.single('companyLogo'), experienceController.updateExperience);
router.delete('/:id', auth, experienceController.deleteExperience);

module.exports = router;