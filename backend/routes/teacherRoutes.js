const express = require("express");
const Timetable = require("../models/Timetable");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Message = require("../models/Message");
const User = require("../models/User");
const Mark = require("../models/Mark");
const Complaint = require("../models/Complaint");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

router.use(protect, allowRoles("teacher"));

router.get("/students", async (req, res) => {
  const students = await User.find({
    role: "student",
    department: req.user.department,
    section: req.user.section,
    semester: req.user.semester
  }).select("-password");

  res.json(students);
});

router.get("/timetable", async (req, res) => {
  const data = await Timetable.find({
    department: req.user.department,
    section: req.user.section,
    semester: req.user.semester
  });

  res.json(data);
});

router.post("/assignments", async (req, res) => {
  const assignment = await Assignment.create({
    ...req.body,
    teacherId: req.user.id
  });

  res.status(201).json(assignment);
});

router.get("/assignments", async (req, res) => {
  const assignments = await Assignment.find({ teacherId: req.user.id });
  res.json(assignments);
});

router.get("/assignments/:id/submissions", async (req, res) => {
  const submissions = await Submission.find({ assignmentId: req.params.id })
    .populate("studentId", "name email department section semester");

  res.json(submissions);
});

router.post("/messages/class", async (req, res) => {
  const message = await Message.create({
    senderId: req.user.id,
    senderName: req.user.name,
    senderRole: req.user.role,
    messageType: "class",
    department: req.user.department,
    section: req.user.section,
    semester: req.user.semester,
    message: req.body.message
  });

  res.status(201).json(message);
});

router.post("/messages/direct", async (req, res) => {
  const message = await Message.create({
    senderId: req.user.id,
    senderName: req.user.name,
    senderRole: req.user.role,
    receiverId: req.body.receiverId,
    messageType: "direct",
    department: req.user.department,
    section: req.user.section,
    semester: req.user.semester,
    message: req.body.message
  });

  res.status(201).json(message);
});

router.get("/messages", async (req, res) => {
  const messages = await Message.find({
    $or: [
      {
        messageType: "class",
        department: req.user.department,
        section: req.user.section,
        semester: req.user.semester
      },
      {
        messageType: "direct",
        receiverId: req.user.id
      },
      {
        messageType: "direct",
        senderId: req.user.id
      }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
});

router.post("/marks", async (req, res) => {
  const mark = await Mark.create({
    ...req.body,
    teacherId: req.user.id,
    department: req.user.department,
    section: req.user.section,
    semester: req.user.semester
  });

  res.status(201).json(mark);
});

router.get("/marks", async (req, res) => {
  const marks = await Mark.find({ teacherId: req.user.id })
    .populate("studentId", "name email");
  res.json(marks);
});

router.get("/complaints", async (req, res) => {
  const complaints = await Complaint.find({
    sendToRole: "teacher",
    sendToTeacherId: req.user.id
  }).sort({ createdAt: -1 });

  res.json(complaints);
});


router.get("/announcements", async (req, res) => {
  const Announcement = require("../models/Announcement");

  const announcements = await Announcement.find({
    $or: [
      { targetRole: "all" },
      { targetRole: "teacher" },
      {
        targetRole: "teacher",
        department: req.user.department,
        section: req.user.section
      }
    ]
  }).sort({ createdAt: -1 });

  res.json(announcements);
});


module.exports = router;
