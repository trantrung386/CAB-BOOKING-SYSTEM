require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3010,
  mongoUri: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL,
  rabbitmqUrl: process.env.RABBITMQ_URL,
  jwtSecret: process.env.JWT_SECRET,
  accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || 30,
};