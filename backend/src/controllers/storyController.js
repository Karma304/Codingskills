const Story = require('../models/Story');
const Social = require('../models/Social');

exports.createStory = async (req, res) => {
  try {
    const { title, description, genre, setting, characters, content, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const story = await Story.create({
      userId: req.userId,
      title,
      description,
      genre,
      setting,
      characters,
      content,
      status: status || 'draft'
    });

    res.status(201).json({
      message: 'Story created successfully',
      story
    });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
};

exports.getStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json({ story });
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ error: 'Failed to get story' });
  }
};

exports.getAllStories = async (req, res) => {
  try {
    const { limit, offset, genre } = req.query;
    const stories = await Story.findAll({
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
      genre: genre || null
    });

    res.json({ stories, count: stories.length });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ error: 'Failed to get stories' });
  }
};

exports.getUserStories = async (req, res) => {
  try {
    const stories = await Story.findByUserId(req.userId);
    res.json({ stories, count: stories.length });
  } catch (error) {
    console.error('Get user stories error:', error);
    res.status(500).json({ error: 'Failed to get user stories' });
  }
};

exports.updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story.user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this story' });
    }

    const updatedStory = await Story.update(id, updates);
    res.json({ message: 'Story updated successfully', story: updatedStory });
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({ error: 'Failed to update story' });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story.user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this story' });
    }

    await Story.delete(id);
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
};

exports.addChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, orderIndex } = req.body;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story.user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to add chapters to this story' });
    }

    const chapter = await Story.addChapter(id, { title, content, orderIndex });
    res.status(201).json({ message: 'Chapter added successfully', chapter });
  } catch (error) {
    console.error('Add chapter error:', error);
    res.status(500).json({ error: 'Failed to add chapter' });
  }
};

exports.getChapters = async (req, res) => {
  try {
    const { id } = req.params;
    const chapters = await Story.getChapters(id);
    res.json({ chapters, count: chapters.length });
  } catch (error) {
    console.error('Get chapters error:', error);
    res.status(500).json({ error: 'Failed to get chapters' });
  }
};

exports.likeStory = async (req, res) => {
  try {
    const { id } = req.params;
    const like = await Social.addLike(req.userId, id);
    res.json({ message: 'Story liked successfully', like });
  } catch (error) {
    console.error('Like story error:', error);
    res.status(500).json({ error: 'Failed to like story' });
  }
};

exports.unlikeStory = async (req, res) => {
  try {
    const { id } = req.params;
    await Social.removeLike(req.userId, id);
    res.json({ message: 'Story unliked successfully' });
  } catch (error) {
    console.error('Unlike story error:', error);
    res.status(500).json({ error: 'Failed to unlike story' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const comment = await Social.addComment(req.userId, id, content);
    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Social.getComments(id);
    res.json({ comments, count: comments.length });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
};
