require("dotenv").config();

const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const connectDB = require("../config/db");

const authRoutes = require("../routes/authRoutes");
const studentRoutes = require("../routes/studentRoutes");
const resultRoutes = require("../routes/resultRoutes");
const subjectRoutes = require("../routes/subjectRoutes");
const dashboardRoutes = require("../routes/dashboardRoutes");

const app = express();

// ✅ DB connection cache (VERY IMPORTANT for Vercel)
let isConnected = false;

const connectDatabase = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("✅ MongoDB Connected");
    } catch (error) {
      console.error("❌ DB Connection Error:", error.message);
      throw error;
    }
  }
};

// ✅ Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*", // baad me frontend URL daal dena
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.status(200).send("🚀 API Running on Vercel");
});

// ✅ Global error handler (extra safety)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Vercel serverless export
module.exports = async (req, res) => {
  await connectDatabase();
  return serverless(app)(req, res);
};