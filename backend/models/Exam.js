const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: String,
    subject: String,
    department: String,
    section: String,
    semester: String,
    date: String,
    time: String,
    room: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
