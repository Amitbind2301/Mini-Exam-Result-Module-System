const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    examName: {
      type: String,
      required: true,
    },

    subjects: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        marksObtained: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

resultSchema.index({ studentId: 1, examName: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);