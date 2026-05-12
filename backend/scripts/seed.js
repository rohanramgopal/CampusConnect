const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const users = [
      {
        name: "Admin",
        email: "admin@campus.com",
        password: "123456",
        role: "admin"
      },
      {
        name: "Teacher One",
        email: "teacher@campus.com",
        password: "123456",
        role: "teacher",
        department: "ECE",
        section: "A",
        semester: "8",
        subject: "Cybersecurity"
      },
      {
        name: "Student One",
        email: "student@campus.com",
        password: "123456",
        role: "student",
        department: "ECE",
        section: "A",
        semester: "8"
      }
    ];

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        u.password = await bcrypt.hash(u.password, 10);
        await User.create(u);
        console.log("Created:", u.email);
      } else {
        console.log("Already exists:", u.email);
      }
    }

    console.log("Seed completed");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
