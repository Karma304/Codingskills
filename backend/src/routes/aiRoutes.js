const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

router.post('/generate-story', authenticateToken, aiController.generateStory);
router.post('/enhance-story', authenticateToken, aiController.enhanceStory);
router.post('/generate-character', authenticateToken, aiController.generateCharacter);

module.exports = router;
