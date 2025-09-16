
const path = require("path");

// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

// ====== Middleware ======
app.use(cors());
app.use(express.json());
// Serve all static frontend files from the repo root
app.use(express.static(__dirname));

// Serve the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// DEBUG: log each incoming request (method + path)
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// ====== DB Connection ======
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ====== User Schema ======
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  offer: String,
  want: String,
  phone: String,
  cell: String,
  whatsapp: String,
  facebook: String,
  zoom: String
});

const User = mongoose.model("User", userSchema);

// ====== Signup Route ======
app.post("/signup", async (req, res) => {
  try {
    // DEBUG — mask password in logs
    const safeBody = { ...req.body, password: req.body?.password ? "***" : undefined };
    console.log("📩 /signup body:", safeBody);

    const { name, email, password, offer, want, phone, cell, whatsapp, facebook, zoom } = req.body;

    if (!name || !email || !password) {
      console.log("⚠️ /signup missing fields:", { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ message: "⚠️ Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ /signup user exists:", email);
      return res.status(400).json({ message: "⚠️ User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, offer, want, phone, cell, whatsapp, facebook, zoom });
    await newUser.save();

    console.log("✅ /signup saved:", { _id: newUser._id, email: newUser.email });
    res.json({ message: "✅ Signup successful", user: newUser });
  } catch (err) {
    console.error("❌ /signup error:", err);
    res.status(500).json({ message: "❌ Server error during signup" });
  }
});

// ====== Login Route ======
app.post("/login", async (req, res) => {
  try {
    // DEBUG — mask password in logs
    console.log("📩 /login body:", { email: req.body?.email, password: req.body?.password ? "***" : undefined });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("⚠️ /login user not found:", email);
      return res.status(400).json({ message: "⚠️ User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("⚠️ /login invalid password for:", email);
      return res.status(400).json({ message: "⚠️ Invalid password" });
    }

    console.log("✅ /login success:", email);
    res.json({ message: "✅ Login successful", user });
  } catch (err) {
    console.error("❌ /login error:", err);
    res.status(500).json({ message: "❌ Server error during login" });
  }
});

// ====== Match Route ======
app.get("/matches/:userId", async (req, res) => {
  try {
    console.log("🔎 /matches requested for userId:", req.params.userId);

    const user = await User.findById(req.params.userId);
    if (!user) {
      console.log("⚠️ /matches user not found:", req.params.userId);
      return res.status(404).json({ message: "User not found" });
    }

    const matches = await User.find({
      offer: user.want,
      want: user.offer,
      _id: { $ne: user._id }
    });

    console.log("✅ /matches found:", matches.length);
    res.json({ matches });
  } catch (err) {
    console.error("❌ /matches error:", err);
    res.status(500).json({ message: "❌ Server error while finding matches" });
  }
});

// ====== Delete All Users (for testing only) ======
app.get("/deleteAll", async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: "🗑️ All users deleted successfully (via GET)" });
  } catch (err) {
    res.status(500).send("❌ Error deleting users");
  }
});

// ====== Start Server ======
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
