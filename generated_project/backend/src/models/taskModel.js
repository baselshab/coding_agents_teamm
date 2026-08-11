const pool = require('../config/db');

class TaskModel {
  static async create({ title, description, status, dueDate, projectId, assigneeId, creatorId }) {
    const query = `
      INSERT INTO tasks (title, description, status, due_date, project_id, assignee_id, creator_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *;
    `;
    const values = [title, description, status || 'TODO', dueDate, projectId, assigneeId || null, creatorId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT t.*, 
             u1.name as assignee_name, u1.email as assignee_email,
             u2.name as creator_name, u2.email as creator_email
      FROM tasks t
      LEFT JOIN users u1 ON t.assignee_id = u1.id
      LEFT JOIN users u2 ON t.creator_id = u2.id
      WHERE t.id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByProjectId(projectId) {
    const query = `
      SELECT t.*, 
             u1.name as assignee_name, u1.email as assignee_email,
             u2.name as creator_name, u2.email as creator_email
      FROM tasks t
      LEFT JOIN users u1 ON t.assignee_id = u1.id
      LEFT JOIN users u2 ON t.creator_id = u2.id
      WHERE t.project_id = $1
      ORDER BY t.created_at DESC;
    `;
    const result = await pool.query(query, [projectId]);
    return result.rows;
  }

  static async update(id, { title, description, status, dueDate, assigneeId }) {
    const query = `
      UPDATE tasks 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          due_date = COALESCE($4, due_date),
          assignee_id = COALESCE($5, assignee_id),
          updated_at = NOW()
      WHERE id = $6
      RETURNING *;
    `;
    const values = [title, description, status, dueDate, assigneeId, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = TaskModel;