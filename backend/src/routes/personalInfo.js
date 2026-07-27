const express = require('express');
const router = express.Router();
const personalInfoController = require('../controllers/personalInfoController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET personal info
router.get('/', personalInfoController.getPersonalInfo);

// PUT update personal info - handle multiple fields
router.put('/', auth, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]), personalInfoController.updatePersonalInfo);

// POST upload profile image (separate endpoint)
router.post('/upload-image', auth, upload.single('profileImage'), personalInfoController.uploadProfileImage);

// POST upload CV (separate endpoint)
router.post('/upload-cv', auth, upload.single('cv'), personalInfoController.uploadCV);

module.exports = router;