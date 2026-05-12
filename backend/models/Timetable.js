const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    department: String,
    section: String,
    semester: String,
    day: String,
    periods: [
      {
        time: String,
        subject: String,
        teacher: String,
        room: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);
