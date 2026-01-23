const jwt = require('jsonwebtoken');
const config = require('./src/config');

const payload = {
  userId: 'test-user-123',
  email: 'khang@example.com',
  role: 'customer'
};

const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
console.log('Bearer Token:', token);