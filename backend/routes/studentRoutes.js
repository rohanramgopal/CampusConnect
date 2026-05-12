const express = require("express");
const Timetable = require("../models/Timetable");
const Announcement = require("../models/Announcement");
const Exam = require("../models/Exam");
const Event = require("../models/Event");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Complaint = require("../models/Complaint");
const Message = require("../models/Message");
const User = require("../models/User");
const Mark = require("../models/Mark");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

router.use(protect, allowRoles("student"));

router.get("/teachers", async (req, res) => {
  const teachers = await User.find({
    role: "teacher",
    department: req.user.department,
    section: req.user.section,
    semester: req.user.semester
  }).select("-password");

  res.json(teachers);
});

router.get("/timetable", async (req, res) => {
  const data = await Timetable.find({
    department: req.user.department,
    section: req.user.section,
    semester: req.user.semester
  });

  res.json(data);
});

router.get("/announcements", async (req, res) => {
  const announcements = await Announcement.find({
    $or: [
      { targetRole: "all" },
      { targetRole: "student" },
      { department: req.user.department },
      { section: req.user.section }
    ]
  }).sort({ createdAt: -1 });

  res.json(announcements);
});

router.get("/exams", async (req, res) => {
  const exams = await Exam.find({
    department: req.user.department,
    section: req.user.section,
    semester: req.user.semester
  });

  res.json(exams);
});

router.get("/events", async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

router.get("/assignments", async (req, res) => {
  const assignments = await Assignment.find({
    department: req.user.department,
    section: req.user.section,
    semester: req.user.semester
  });

  res.json(assignments);
});

router.post("/assignments/:id/submit", async (req, res) => {
  const submission = await Submission.create({
    assignmentId: req.params.id,
    studentId: req.user.id,
    answer: req.body.answer
  });

  res.status(201).json(submission);
});

router.post("/complaints", async (req, res) => {
  const referenceCode = "CC-" + Date.now();

  const complaint = await Complaint.create({
    raisedBy: req.user.id,
    raisedByRole: req.user.role,
    sendToRole: req.body.sendToRole || "admin",
    sendToTeacherId: req.body.sendToTeacherId || null,
    category: req.body.category,
    message: req.body.message,
    referenceCode
  });

  res.status(201).json({
    message: "Complaint submitted successfully",
    referenceCode,
    complaint
  });
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

router.get("/marks", async (req, res) => {
  const marks = await Mark.find({ studentId: req.user.id })
    .populate("teacherId", "name email subject");

  res.json(marks);
});

module.exports = router;
