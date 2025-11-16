const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, userController.register);
router.post('/login', authLimiter, userController.login);
router.get('/profile', apiLimiter, authenticateToken, userController.getProfile);
router.put('/preferences', apiLimiter, authenticateToken, userController.updatePreferences);

module.exports = router;
