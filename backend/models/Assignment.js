const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    subject: String,
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    department: String,
    section: String,
    semester: String,
    dueDate: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
