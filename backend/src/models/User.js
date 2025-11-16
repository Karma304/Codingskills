const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

class User {
  static async create({ username, email, password, preferences = {} }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, email, password, preferences)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, preferences, created_at
    `;
    const values = [username, email, hashedPassword, JSON.stringify(preferences)];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT id, username, email, preferences, created_at, updated_at
      FROM users WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updatePreferences(userId, preferences) {
    const query = `
      UPDATE users 
      SET preferences = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, username, email, preferences
    `;
    const result = await pool.query(query, [JSON.stringify(preferences), userId]);
    return result.rows[0];
  }

  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;
