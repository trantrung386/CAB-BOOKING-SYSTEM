const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
  getProfile,
  updateProfile,
  addFavorite,
  getLoyalty,
} = require('../controllers/user.controller');

router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.post('/favorites', addFavorite);
router.get('/loyalty', getLoyalty);

// Có thể thêm sau: GET /rides (gọi sang ride-service hoặc dùng aggregate)

module.exports = router;