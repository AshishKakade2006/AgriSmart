const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["farmer", "buyer"],
      default: "farmer",
    },
    phone: {
  type: String,
  default: "",
},

farmLocation: {
  type: String,
  default: "",
},

farmSize: {
  type: Number,
  default: 0,
},

profileImage: {
  type: String,
  default: "",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);