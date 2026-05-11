const Subject = require("../models/Subject");

// ======================
// CREATE SUBJECT
// ======================
exports.addSubject = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const {
      subjectName,
      subjectCode,
      fullMarks,
      passMarks,
    } = req.body;

    // VALIDATION
    if (
      !subjectName?.trim() ||
      !subjectCode?.trim() ||
      fullMarks == null ||
      passMarks == null
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (Number(fullMarks) <= Number(passMarks)) {
      return res.status(400).json({
        message:
          "Full marks must be greater than pass marks",
      });
    }

    // DUPLICATE CHECK
    const existingSubject =
      await Subject.findOne({
        subjectCode:
          subjectCode.trim().toUpperCase(),
      });

    if (existingSubject) {
      return res.status(400).json({
        message:
          "Subject code already exists",
      });
    }

    // CREATE
    const subject =
      await Subject.create({
        subjectName:
          subjectName.trim(),
        subjectCode:
          subjectCode
            .trim()
            .toUpperCase(),
        fullMarks: Number(fullMarks),
        passMarks: Number(passMarks),
      });

    return res.status(201).json({
      success: true,
      message:
        "Subject added successfully",
      data: subject,
    });

  } catch (error) {
    console.log(
      "FULL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Server Error",
    });
  }
};

// ======================
// GET ALL SUBJECTS
// ======================
exports.getSubjects = async (req, res) => {
  try {
    const subjects =
      await Subject.find().sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      data: subjects,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ======================
// UPDATE SUBJECT
// ======================
exports.updateSubject = async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
    };

    if (updatedData.subjectCode) {
      updatedData.subjectCode =
        updatedData.subjectCode
          .trim()
          .toUpperCase();
    }

    const subject =
      await Subject.findByIdAndUpdate(
        req.params.id,
        updatedData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message:
          "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Subject updated successfully",
      data: subject,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ======================
// DELETE SUBJECT
// ======================
exports.deleteSubject = async (req, res) => {
  try {
    const subject =
      await Subject.findByIdAndDelete(
        req.params.id
      );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message:
          "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Subject deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};