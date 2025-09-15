const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
  origin: "https://ruhul-arian.github.io",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ===== MongoDB Connection =====
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ===== User Schema =====
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: { type: String, unique: true },
  phone: String,
  password: String
});
const User = mongoose.model("User", userSchema);

// ===== Signup =====
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, age, email, phone, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, age, email, phone, password: hashed });
    await newUser.save();

    res.json({ ok: true, message: "Signup successful!" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== Login =====
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid email or password" });

    res.json({
      ok: true,
      userId: user._id.toString(),
      user: { firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== Skills Schema =====
const skillSchema = new mongoose.Schema({
  userId: String,
  offer: String,
  want: String
});
const Skill = mongoose.model("Skill", skillSchema);

// ===== Add Skill =====
app.post("/skills", async (req, res) => {
  try {
    const { userId, offer, want } = req.body;
    if (!userId || !offer || !want) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newSkill = new Skill({ userId, offer, want });
    await newSkill.save();

    const match = await Skill.findOne({
      offer: want,
      want: offer,
      userId: { $ne: userId }
    });

    if (match) {
      res.json({ ok: true, message: "🎉 Match found!", match });
    } else {
      res.json({ ok: true, message: "✅ Skill added, waiting for a match" });
    }
  } catch (err) {
    console.error("Skill error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== Start Server =====
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
