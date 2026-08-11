const db = require('../config/db');

const createUser = async (email, passwordHash, role = 'Team Member') => {
  const query = `
    INSERT INTO users (email, password_hash, role, created_at, updated_at)
    VALUES ($1, $2, $3, NOW(), NOW())
    RETURNING id, email, role, created_at;
  `;
  const values = [email, passwordHash, role];
  const result = await db.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1;';
  const result = await db.query(query, [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const query = 'SELECT id, email, role, created_at FROM users WHERE id = $1;';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};