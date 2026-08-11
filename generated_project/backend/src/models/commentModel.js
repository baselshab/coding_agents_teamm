const pool = require('../config/db');

const Comment = {
  async create(taskId, authorId, content) {
    const query = `
      INSERT INTO comments (task_id, author_id, content, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, task_id AS "taskId", author_id AS "authorId", content, created_at AS "createdAt"
    `;
    const values = [taskId, authorId, content];
    const result = await pool.query(query, values);
    const comment = result.rows[0];
    
    // Fetch author details
    const userQuery = 'SELECT id, name, email FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [authorId]);
    comment.author = userResult.rows[0];
    
    return comment;
  },

  async findByTaskId(taskId) {
    const query = `
      SELECT c.id, c.task_id AS "taskId", c.author_id AS "authorId", c.content, c.created_at AS "createdAt",
             u.id AS "author_id", u.name AS "author_name", u.email AS "author_email"
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.task_id = $1
      ORDER BY c.created_at ASC
    `;
    const result = await pool.query(query, [taskId]);
    return result.rows.map(row => ({
      id: row.id,
      taskId: row.taskId,
      authorId: row.authorId,
      content: row.content,
      createdAt: row.createdAt,
      author: {
        id: row.author_id,
        name: row.author_name,
        email: row.author_email
      }
    }));
  },

  async isUserProjectMember(userId, taskId) {
    const query = `
      SELECT 1 FROM project_members pm
      JOIN tasks t ON t.project_id = pm.project_id
      WHERE t.id = $1 AND pm.user_id = $2
    `;
    const result = await pool.query(query, [taskId, userId]);
    return result.rows.length > 0;
  }
};

module.exports = Comment;
