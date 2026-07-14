const express = require("express");

const protect = require("../middleware/authMiddleware");


const {
  createCrop,
  getMyCrops,
  getCropById,
  updateCrop,
  deleteCrop,
  getDashboardStats,
  getUpcomingHarvests,
  
} = require("../controllers/cropController");

const router = express.Router();

// Create a new crop
router.post("/", protect, createCrop);

// Get all crops of logged-in farmer
router.get("/", protect, getMyCrops);
router.get("/stats", protect, getDashboardStats);
router.get("/upcoming", protect, getUpcomingHarvests);

router.get("/:id", protect, getCropById);
router.put("/:id", protect, updateCrop);
router.delete("/:id", protect, deleteCrop);


module.exports = router;