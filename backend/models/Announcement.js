const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: String,
    message: String,
    targetRole: {
      type: String,
      enum: ["all", "teacher", "student"],
      default: "all"
    },
    department: String,
    section: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
