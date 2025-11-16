const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, storyController.createStory);
router.get('/', storyController.getAllStories);
router.get('/my-stories', authenticateToken, storyController.getUserStories);
router.get('/:id', storyController.getStory);
router.put('/:id', authenticateToken, storyController.updateStory);
router.delete('/:id', authenticateToken, storyController.deleteStory);

router.post('/:id/chapters', authenticateToken, storyController.addChapter);
router.get('/:id/chapters', storyController.getChapters);

router.post('/:id/like', authenticateToken, storyController.likeStory);
router.delete('/:id/like', authenticateToken, storyController.unlikeStory);

router.post('/:id/comments', authenticateToken, storyController.addComment);
router.get('/:id/comments', storyController.getComments);

module.exports = router;
