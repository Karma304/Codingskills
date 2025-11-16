const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/generate-story', aiLimiter, authenticateToken, aiController.generateStory);
router.post('/enhance-story', aiLimiter, authenticateToken, aiController.enhanceStory);
router.post('/generate-character', aiLimiter, authenticateToken, aiController.generateCharacter);

module.exports = router;
