const userService = require('../services/user.service');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getProfile(req.user.userId);
  res.status(200).json({ success: true, data: user });
});

const updateProfile = catchAsync(async (req, res) => {
  const updated = await userService.updateProfile(req.user.userId, req.body);
  res.status(200).json({ success: true, data: updated });
});

const addFavorite = catchAsync(async (req, res) => {
  const locations = await userService.addFavoriteLocation(req.user.userId, req.body);
  res.status(201).json({ success: true, data: locations });
});

const getLoyalty = catchAsync(async (req, res) => {
  const data = await userService.getLoyalty(req.user.userId);
  res.status(200).json({ success: true, data });
});

module.exports = {
  getProfile,
  updateProfile,
  addFavorite,
  getLoyalty,
};