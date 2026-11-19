const express = require("express");
const router  = express.Router();
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const auth    = require("../middleware/auth");

const JWT_SECRET = "finance_tracker_secret_2024";

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 12);
    await new User({ name, email, password: hashed }).save();
    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, budget: user.budget } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SAVE BUDGET
router.put("/budget", auth, async (req, res) => {
  try {
    const { budget } = req.body;
    await User.findByIdAndUpdate(req.user.id, { budget });
    res.json({ message: "Budget saved", budget });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
