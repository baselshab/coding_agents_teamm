const pool = require('../config/db');

const Comment = {
  async create({ task_id, user_id, content }) {
    const query = `
      INSERT INTO comments (task_id, user_id, content, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, task_id, user_id, content, created_at;
    `;
    const values = [task_id, user_id, content];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByTaskId(task_id) {
    const query = `
      SELECT c.id, c.task_id, c.user_id, c.content, c.created_at, u.name as user_name, u.email as user_email
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.task_id = $1
      ORDER BY c.created_at ASC;
    `;
    const result = await pool.query(query, [task_id]);
    return result.rows;
  }
};

module.exports = Comment;