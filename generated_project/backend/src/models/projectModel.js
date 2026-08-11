const db = require('../config/db');

const ProjectModel = {
  async createProject(title, description, ownerId) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const projectResult = await client.query(
        'INSERT INTO projects (title, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
        [title, description, ownerId]
      );
      const project = projectResult.rows[0];

      await client.query(
        'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3)',
        [project.id, ownerId, 'Project Manager']
      );

      await client.query('COMMIT');
      return project;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    },

  async findByUserId(userId) {
    const result = await db.query(
      `SELECT p.* FROM projects p 
       JOIN project_members pm ON p.id = pm.project_id 
       WHERE pm.user_id = $1`,
      [userId]
    );
    return result.rows;
  },

  async findById(projectId) {
    const result = await db.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    return result.rows[0];
  },

  async getMemberRole(projectId, userId) {
    const result = await db.query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );
    return result.rows[0] ? result.rows[0].role : null;
  },

  async addInvitation(projectId, email, token, expiresAt) {
    const result = await db.query(
      `INSERT INTO project_invitations (project_id, email, token, expires_at, status) 
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [projectId, email, token, expiresAt]
    );
    return result.rows[0];
  }
};

module.exports = ProjectModel;