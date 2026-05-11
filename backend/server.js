require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// ✅ ALL PATHS FIXED (IMPORTANT)
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const resultRoutes = require("./routes/resultRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ✅ Connect DB
connectDB();

// ✅ Middlewares
app.use(express.json());
app.use(cors());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 API Running Locally");
});

// ✅ START SERVER (IMPORTANT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});