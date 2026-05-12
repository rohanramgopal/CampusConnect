const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    senderName: String,
    senderRole: String,

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    messageType: {
      type: String,
      enum: ["class", "direct"],
      default: "class"
    },

    department: String,
    section: String,
    semester: String,
    message: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
