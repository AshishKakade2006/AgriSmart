const User = require("../models/User");

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      user,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
      }
    ).select("-password");

    res.json({
      success: true,
      user,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

module.exports = {
  getProfile,
  updateProfile,
};