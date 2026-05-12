const express = require("express");
const User = require("../models/User");
const Timetable = require("../models/Timetable");
const Announcement = require("../models/Announcement");
const Exam = require("../models/Exam");
const Event = require("../models/Event");
const Complaint = require("../models/Complaint");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

router.use(protect, allowRoles("admin"));

router.get("/dashboard", async (req, res) => {
  const users = await User.countDocuments();
  const complaints = await Complaint.countDocuments();
  const announcements = await Announcement.countDocuments();
  res.json({ users, complaints, announcements });
});

router.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.post("/timetable", async (req, res) => {
  const timetable = await Timetable.create(req.body);
  res.status(201).json(timetable);
});

router.get("/timetable", async (req, res) => {
  const data = await Timetable.find();
  res.json(data);
});

router.post("/announcements", async (req, res) => {
  const announcement = await Announcement.create(req.body);
  res.status(201).json(announcement);
});

router.post("/exams", async (req, res) => {
  const exam = await Exam.create(req.body);
  res.status(201).json(exam);
});

router.post("/events", async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
});

router.get("/complaints", async (req, res) => {
  const complaints = await Complaint.find().sort({ createdAt: -1 });
  res.json(complaints);
});

router.put("/complaints/:id", async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(complaint);
});

module.exports = router;
