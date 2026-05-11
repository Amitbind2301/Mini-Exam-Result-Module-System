const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Result = require("../models/Result");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalSubjects = await Subject.countDocuments();
    const totalResults = await Result.countDocuments();

    const results = await Result.find().populate("subjects.subjectId");

    let passedStudents = 0;
    let failedStudents = 0;

    results.forEach((result) => {
      const isPass = result.subjects.every((subject) => {
        if (!subject.subjectId) return false;

        return (
          Number(subject.marksObtained) >=
          Number(subject.subjectId.passMarks)
        );
      });

      if (isPass) {
        passedStudents++;
      } else {
        failedStudents++;
      }
    });

    res.status(200).json({
      totalStudents,
      totalSubjects,
      totalResults,
      passedStudents,
      failedStudents,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Dashboard stats fetch failed",
    });
  }
};