const express = require('express');
const cors = require('cors');
require('dotenv').config();

const storyRoutes = require('./routes/storyRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(apiLimiter);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to StoryVerse API',
    version: '1.0.0'
  });
});

app.use('/api/stories', storyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`StoryVerse API server running on port ${PORT}`);
});

module.exports = app;
