const express = require("express");
const router = express.Router();

const {
  addSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, addSubject);
router.get("/", protect, getSubjects);
router.put("/:id", protect, updateSubject);
router.delete("/:id", protect, deleteSubject);

module.exports = router;