const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

class Story {
  static async create({ 
    userId, 
    title, 
    description, 
    genre, 
    setting, 
    characters = [], 
    content,
    status = 'draft'
  }) {
    const query = `
      INSERT INTO stories (
        user_id, title, description, genre, setting, 
        characters, content, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      userId, title, description, genre, setting,
      JSON.stringify(characters), content, status
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT s.*, u.username as author_username,
        (SELECT COUNT(*) FROM likes WHERE story_id = s.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE story_id = s.id) as comments_count
      FROM stories s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll({ limit = 20, offset = 0, genre = null, status = 'published' }) {
    let query = `
      SELECT s.*, u.username as author_username,
        (SELECT COUNT(*) FROM likes WHERE story_id = s.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE story_id = s.id) as comments_count
      FROM stories s
      JOIN users u ON s.user_id = u.id
      WHERE s.status = $1
    `;
    const values = [status];
    
    if (genre) {
      query += ` AND s.genre = $${values.length + 1}`;
      values.push(genre);
    }
    
    query += ` ORDER BY s.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);
    
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findByUserId(userId) {
    const query = `
      SELECT s.*,
        (SELECT COUNT(*) FROM likes WHERE story_id = s.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE story_id = s.id) as comments_count
      FROM stories s
      WHERE s.user_id = $1
      ORDER BY s.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async update(id, updates) {
    const allowedFields = ['title', 'description', 'content', 'status', 'genre', 'setting'];
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramIndex}`);
        values.push(updates[key]);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const query = `
      UPDATE stories 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM stories WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async addChapter(storyId, { title, content, orderIndex }) {
    const query = `
      INSERT INTO chapters (story_id, title, content, order_index)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [storyId, title, content, orderIndex]);
    return result.rows[0];
  }

  static async getChapters(storyId) {
    const query = `
      SELECT * FROM chapters 
      WHERE story_id = $1 
      ORDER BY order_index ASC
    `;
    const result = await pool.query(query, [storyId]);
    return result.rows;
  }
}

module.exports = Story;
