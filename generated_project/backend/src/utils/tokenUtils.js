const jwt = require('jsonwebtoken');

const generateToken = (userId, email, role) => {
  const secret = process.env.JWT_SECRET || 'fallbacksecret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign({ id: userId, email, role }, secret, { expiresIn });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'fallbacksecret';
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};