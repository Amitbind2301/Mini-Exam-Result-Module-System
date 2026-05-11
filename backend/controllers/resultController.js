const Result = require("../models/Result");
const Subject = require("../models/Subject");

// ======================
// CREATE RESULT
// ======================
exports.addResult = async (req, res) => {
  try {
    const { studentId, examName, subjects } = req.body;

    // VALIDATION
    if (!studentId || !examName) {
      return res.status(400).json({
        success: false,
        message: "Student and Exam name are required",
      });
    }

    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one subject is required",
      });
    }

    // VALIDATE SUBJECTS
    for (let item of subjects) {
      if (!item.subjectId) {
        return res.status(400).json({
          success: false,
          message: "Subject ID is required",
        });
      }

      const subject = await Subject.findById(item.subjectId);

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: "Subject not found",
        });
      }

      if (
        item.marksObtained === undefined ||
        item.marksObtained === null
      ) {
        return res.status(400).json({
          success: false,
          message: `Marks required for ${subject.subjectName}`,
        });
      }

      if (Number(item.marksObtained) < 0) {
        return res.status(400).json({
          success: false,
          message: `Marks cannot be negative for ${subject.subjectName}`,
        });
      }

      if (Number(item.marksObtained) > Number(subject.fullMarks)) {
        return res.status(400).json({
          success: false,
          message: `${subject.subjectName}: Marks cannot exceed Full Marks (${subject.fullMarks})`,
        });
      }
    }

    // CREATE RESULT
    const result = await Result.create({
      studentId,
      examName: examName.trim(),
      subjects,
    });

    return res.status(201).json({
      success: true,
      message: "Result created successfully",
      data: result,
    });
  } catch (error) {
    console.log("Add Result Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ======================
// GET ALL RESULTS
// ======================
exports.getResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate(
        "studentId",
        "name rollNumber className section"
      )
      .populate(
        "subjects.subjectId",
        "subjectName subjectCode fullMarks passMarks"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.log("Get Results Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ======================
// GET SINGLE RESULT BY ID
// ======================
exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate(
        "studentId",
        "name rollNumber className section"
      )
      .populate(
        "subjects.subjectId",
        "subjectName subjectCode fullMarks passMarks"
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log("Get Result By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ======================
// DELETE RESULT
// ======================
exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    await Result.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Result deleted successfully",
    });
  } catch (error) {
    console.log("Delete Result Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Delete failed",
    });
  }
};