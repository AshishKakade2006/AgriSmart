const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    sowingDate: {
      type: Date,
      required: true,
    },

    expectedHarvest: {
      type: Date,
      required: true,
    },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Crop", cropSchema);