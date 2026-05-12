const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    raisedByRole: String,
    sendToRole: {
      type: String,
      enum: ["admin", "teacher"],
      default: "admin"
    },
    sendToTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    category: String,
    message: String,
    referenceCode: String,
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
