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

// ✅ DB connect (safe for serverless)
connectDB();

// ✅ Middlewares
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 Exam Result API Running on Vercel");
});

// ❌ REMOVE this (important)
// app.listen(...)

// ✅ Export for Vercel
module.exports = serverless(app);