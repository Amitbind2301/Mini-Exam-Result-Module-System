const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    subjectCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    fullMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    passMarks: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================
// CREATE VALIDATION
// ==========================
subjectSchema.pre("save", function () {
  if (this.fullMarks <= this.passMarks) {
    throw new Error(
      "Full marks must be greater than pass marks"
    );
  }
});

// ==========================
// UPDATE VALIDATION
// ==========================
subjectSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (
    update.fullMarks !== undefined &&
    update.passMarks !== undefined
  ) {
    if (
      Number(update.fullMarks) <=
      Number(update.passMarks)
    ) {
      throw new Error(
        "Full marks must be greater than pass marks"
      );
    }
  }
});

module.exports = mongoose.model(
  "Subject",
  subjectSchema
);