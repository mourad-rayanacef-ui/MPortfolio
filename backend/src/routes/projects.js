const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', projectController.getAllProjects);
router.post('/', auth, upload.single('image'), projectController.createProject);
router.put('/:id', auth, upload.single('image'), projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;