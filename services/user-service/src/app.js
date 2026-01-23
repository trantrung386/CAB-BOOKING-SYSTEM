const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const userRoutes = require('./routes/user.routes');
const amqp = require('amqplib');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect DB
mongoose.connect(config.mongoUri)
  .then(() => console.log('MongoDB connected - User Service'))
  .catch(err => console.error('MongoDB connection error:', err));

// RabbitMQ connection (consumer ví dụ)
async function connectRabbitMQ() {
  try {
    const conn = await amqp.connect(config.rabbitmqUrl);
    const channel = await conn.createChannel();
    const exchange = 'ride-events';
    await channel.assertExchange(exchange, 'topic', { durable: true });

    const q = await channel.assertQueue('user_queue', { durable: true });
    await channel.bindQueue(q.queue, exchange, 'ride.completed');

    channel.consume(q.queue, async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        if (data.event === 'ride.completed') {
          await require('./services/user.service').updateAfterRideCompleted(
            data.userId,
            data.ride
          );
          console.log(`Updated user stats for ride ${data.ride.rideId}`);
        }
        channel.ack(msg);
      }
    });

    console.log('User Service connected to RabbitMQ');
  } catch (err) {
    console.error('RabbitMQ connection error:', err);
  }
}

// Thêm log để biết đang dev local
connectRabbitMQ();

app.listen(config.port, () => {
  console.log(`User Service running on port ${config.port}`);
});