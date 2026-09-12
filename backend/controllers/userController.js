const { updateProfileService } = require('../services/userService');

const updateProfileController = async (req, res) => {
  try {
    const user = await updateProfileService(req.user.email, req.body || {});
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to update profile',
    });
  }
};

module.exports = { updateProfileController };
