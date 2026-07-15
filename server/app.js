const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cropRoutes = require("./routes/cropRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const profileRoutes = require("./routes/profileRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");

const app = express();


// Middleware
app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://agri-smart-self.vercel.app",
    ],
    credentials: true,}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/disease", diseaseRoutes);
// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to AgriSmart API 🚜",
  });
});

module.exports = app;