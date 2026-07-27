const express = require('express');
const router = express.Router();
const personalInfoController = require('../controllers/personalInfoController');
const auth = require('../middleware/auth');

// GET personal info
router.get('/', personalInfoController.getPersonalInfo);

// PUT update personal info — text fields only now.
// Files go straight from the browser to Cloudinary (see /media below),
// so no multer/upload middleware is needed here anymore.
router.put('/', auth, personalInfoController.updatePersonalInfo);

// PUT persist a profile image / CV that the browser already uploaded
// directly to Cloudinary (via an unsigned upload preset).
router.put('/media', auth, personalInfoController.setMedia);

module.exports = router;