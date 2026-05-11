require("dotenv").config();

const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const resultRoutes = require("./routes/resultRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ✅ DB connection cache (IMPORTANT)
let isConnected = false;

const connectDatabase = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("✅ MongoDB Connected");
  }
};

// ✅ Middlewares
app.use(express.json());

app.use(
  cors({
    origin: "*", // later frontend URL daal dena
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
  res.send("🚀 Exam Result API Running on Vercel");
});

// ✅ Export for Vercel (NO app.listen)
module.exports = async (req, res) => {
  await connectDatabase();
  return serverless(app)(req, res);
};