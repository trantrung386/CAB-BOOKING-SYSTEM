const User = require('../models/user.model');
// const redis = require('redis');
// const client = redis.createClient({ url: require('../config').redisUrl });
// client.connect().catch(console.error);

// const CACHE_TTL = 300; // 5 phút

class UserService {
  async getProfile(userId) {
    // const cacheKey = `user:profile:${userId}`;
    // const cached = await client.get(cacheKey);
    // if (cached) return JSON.parse(cached);

    const user = await User.findOne({ userId }).lean();
    if (!user) throw new Error('User not found');

    // await client.setEx(cacheKey, CACHE_TTL, JSON.stringify(user));
    return user;
  }

  async updateProfile(userId, data) {
    const allowed = [
      'fullName', 'avatar', 'gender', 'dateOfBirth',
      'preferences', 'favoriteLocations'
    ];

    const updateData = {};
    allowed.forEach(key => {
      if (data[key] !== undefined) updateData[key] = data[key];
    });

    const user = await User.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true, lean: true }
    );

    if (!user) throw new Error('User not found');

    // Xóa cache
    // await client.del(`user:profile:${userId}`);

    return user;
  }

  async addFavoriteLocation(userId, location) {
    const user = await User.findOneAndUpdate(
      { userId },
      { $push: { favoriteLocations: location } },
      { new: true, lean: true }
    );
    if (!user) throw new Error('User not found');

    // await client.del(`user:profile:${userId}`);
    return user.favoriteLocations;
  }

  async getLoyalty(userId) {
    const user = await User.findOne({ userId }).select('loyalty stats').lean();
    if (!user) throw new Error('User not found');
    return user;
  }

  // Gọi từ ride-service qua RabbitMQ event (tạm comment logic cache)
  async updateAfterRideCompleted(userId, rideData) {
    const { fare, distance } = rideData;
    const pointsEarned = Math.floor(fare * 0.1); // ví dụ 10% thành points

    const user = await User.findOneAndUpdate(
      { userId },
      {
        $inc: {
          'stats.totalRides': 1,
          'stats.totalSpent': fare,
          'loyalty.points': pointsEarned
        },
        $set: { 'loyalty.lastEarned': new Date() }
      },
      { new: true, lean: true }
    );

    // Cập nhật tier nếu cần
    if (user.loyalty.points >= 1000) user.loyalty.tier = 'gold';
    else if (user.loyalty.points >= 500) user.loyalty.tier = 'silver';

    await User.updateOne({ userId }, { $set: { 'loyalty.tier': user.loyalty.tier } });

    // await client.del(`user:profile:${userId}`);
  }
}

module.exports = new UserService();