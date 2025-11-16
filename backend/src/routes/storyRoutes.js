const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { authenticateToken } = require('../middleware/auth');
const { apiLimiter, storyCreationLimiter } = require('../middleware/rateLimiter');

router.post('/', storyCreationLimiter, authenticateToken, storyController.createStory);
router.get('/', apiLimiter, storyController.getAllStories);
router.get('/my-stories', apiLimiter, authenticateToken, storyController.getUserStories);
router.get('/:id', apiLimiter, storyController.getStory);
router.put('/:id', apiLimiter, authenticateToken, storyController.updateStory);
router.delete('/:id', apiLimiter, authenticateToken, storyController.deleteStory);

router.post('/:id/chapters', apiLimiter, authenticateToken, storyController.addChapter);
router.get('/:id/chapters', apiLimiter, storyController.getChapters);

router.post('/:id/like', apiLimiter, authenticateToken, storyController.likeStory);
router.delete('/:id/like', apiLimiter, authenticateToken, storyController.unlikeStory);

router.post('/:id/comments', apiLimiter, authenticateToken, storyController.addComment);
router.get('/:id/comments', apiLimiter, storyController.getComments);

module.exports = router;
