const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment"
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    answer: String,
    status: {
      type: String,
      enum: ["submitted", "late"],
      default: "submitted"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
