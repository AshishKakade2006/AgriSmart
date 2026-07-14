const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../config/multer");
const { detectDisease } = require("../controllers/diseaseController");

const router = express.Router();

router.post(
  "/detect",
  protect,
  upload.single("image"),
  detectDisease
);

module.exports = router;