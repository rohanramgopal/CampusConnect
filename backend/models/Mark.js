const mongoose = require("mongoose");

const markSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    subject: String,
    examName: String,
    marksObtained: Number,
    totalMarks: Number,
    department: String,
    section: String,
    semester: String,
    remarks: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mark", markSchema);
