require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const resultRoutes = require("./routes/resultRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ✅ Middlewares
app.use(express.json());

app.use(cors({
  origin: "https://your-frontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "🚀 API is running successfully"
  });
});

const PORT = process.env.PORT || 5000;

// ✅ Safe DB + Server start
let isConnected = false;

const startServer = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();