const jwt = require('jsonwebtoken');
const config = require('../config');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized - no token' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // { userId, role, ... }
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Not authorized - token invalid' });
  }
};

module.exports = { protect };