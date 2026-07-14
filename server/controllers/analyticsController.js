const Crop = require("../models/Crop");

const getAnalytics = async (req, res) => {
  try {
    const crops = await Crop.find({
      farmer: req.user.id,
    });

    // Crop count
    const cropDistribution = {};

    // Area per crop
    const areaDistribution = {};

    crops.forEach((crop) => {
      cropDistribution[crop.cropName] =
        (cropDistribution[crop.cropName] || 0) + 1;

      areaDistribution[crop.cropName] =
        (areaDistribution[crop.cropName] || 0) + crop.area;
    });

    res.json({
      success: true,
      cropDistribution,
      areaDistribution,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getAnalytics,
};