const Crop = require("../models/Crop");

// Create Crop
const createCrop = async (req, res) => {
  try {
    const {
      cropName,
      area,
      location,
      sowingDate,
      expectedHarvest,
    } = req.body;

    const crop = await Crop.create({
      cropName,
      area,
      location,
      sowingDate,
      expectedHarvest,
      farmer: req.user.id,
    });

    res.status(201).json({
      success: true,
      crop,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get all crops of logged in farmer
const getMyCrops = async (req, res) => {
  try {

    const crops = await Crop.find({
      farmer: req.user.id,
    });

    res.status(200).json({
      success: true,
      count: crops.length,
      crops,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};
// Get a single crop
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.id,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    res.status(200).json({
      success: true,
      crop,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update crop


// Update crop
const updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndUpdate(
      {
        _id: req.params.id,
        farmer: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    res.status(200).json({
      success: true,
      crop,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete crop
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user.id,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Crop deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalCrops = await Crop.countDocuments({
      farmer: req.user.id,
    });
const recentCrops = await Crop.find({
    farmer: req.user.id,
})
.sort({ createdAt: -1 })
.limit(5);
    res.status(200).json({
      success: true,
      stats: {
        totalCrops,
        healthyCrops: 0,
        diseasedCrops: 0,
      },
      recentCrops,
    });
    // Get Upcoming Harvests


  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

const getUpcomingHarvests = async (req, res) => {
  try {
    const crops = await Crop.find({
      farmer: req.user.id,
    }).sort({
      expectedHarvest: 1,
    });

    res.status(200).json({
      success: true,
      crops,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getAnalytics = async (req, res) => {
  try {
    const crops = await Crop.find();

    const totalCrops = crops.length;

    const activeCrops = crops.filter(
      crop => crop.status !== "Harvested"
    ).length;

    const harvested = crops.filter(
      crop => crop.status === "Harvested"
    ).length;

    const estimatedRevenue = crops.reduce(
      (sum, crop) => sum + (crop.expectedYield || 0) * (crop.pricePerKg || 0),
      0
    );

    const cropDistribution = {};

    crops.forEach(crop => {
      cropDistribution[crop.cropName] =
        (cropDistribution[crop.cropName] || 0) + 1;
    });

    res.json({
      totalCrops,
      activeCrops,
      harvested,
      estimatedRevenue,
      cropDistribution
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  createCrop,
  getMyCrops,
  getCropById,
  updateCrop,
  deleteCrop,
  getDashboardStats,
  getUpcomingHarvests,

};
