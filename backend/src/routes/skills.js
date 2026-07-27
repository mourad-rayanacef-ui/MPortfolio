const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', skillController.getAllSkills);
router.post('/', auth, upload.single('iconImage'), skillController.createSkill);
router.put('/:id', auth, upload.single('iconImage'), skillController.updateSkill);
router.delete('/:id', auth, skillController.deleteSkill);

module.exports = router;