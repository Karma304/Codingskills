const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

class Social {
  static async addLike(userId, storyId) {
    const query = `
      INSERT INTO likes (user_id, story_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, story_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [userId, storyId]);
    return result.rows[0];
  }

  static async removeLike(userId, storyId) {
    const query = `
      DELETE FROM likes 
      WHERE user_id = $1 AND story_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [userId, storyId]);
    return result.rows[0];
  }

  static async getLikes(storyId) {
    const query = `
      SELECT l.*, u.username
      FROM likes l
      JOIN users u ON l.user_id = u.id
      WHERE l.story_id = $1
      ORDER BY l.created_at DESC
    `;
    const result = await pool.query(query, [storyId]);
    return result.rows;
  }

  static async addComment(userId, storyId, content) {
    const query = `
      INSERT INTO comments (user_id, story_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [userId, storyId, content]);
    return result.rows[0];
  }

  static async getComments(storyId) {
    const query = `
      SELECT c.*, u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.story_id = $1
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query, [storyId]);
    return result.rows;
  }

  static async deleteComment(commentId, userId) {
    const query = `
      DELETE FROM comments 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [commentId, userId]);
    return result.rows[0];
  }
}

module.exports = Social;
