require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const subjectRoutes = require("./routes/subjectRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// ROUTE
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use("/api/subjects", subjectRoutes);
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.get("/", (req, res) => {
  res.send("Exam Result API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server Running on Port " + PORT);
});