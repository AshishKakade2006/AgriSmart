const mongoose = require("mongoose");

const diseaseScanSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    crop: {
      type: String,
      default: "Unknown",
    },

    disease: {
      type: String,
      required: true,
    },

    confidence: {
      type: Number,
      default: 0,
    },

    severity: {
      type: String,
      default: "Unknown",
    },

    recommendation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DiseaseScan", diseaseScanSchema);