const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addResult,
  getResults,
  getResultById,
  deleteResult,
} = require("../controllers/resultController");

router.post("/", protect, addResult);
router.get("/", protect, getResults);
router.get("/:id", protect, getResultById);
router.delete("/:id", protect, deleteResult);

module.exports = router;