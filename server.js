// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== DB Connection =====
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ===== Schema =====
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

// ===== Signup Route =====
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, offer, want, phone, cell, whatsapp, facebook, zoom } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "⚠️ Missing required fields (name, email, password)" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "⚠️ User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name, email, password: hashedPassword,
      offer, want, phone, cell, whatsapp, facebook, zoom
    });

    await newUser.save();
    res.json({ message: "✅ Signup successful", user: { id: newUser._id, email: newUser.email } });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "❌ Server error during signup" });
  }
});

// ===== Login Route =====
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "⚠️ User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "⚠️ Invalid password" });
    }

    res.json({
      message: "✅ Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        offer: user.offer,
        want: user.want,
        phone: user.phone,
        cell: user.cell,
        whatsapp: user.whatsapp,
        facebook: user.facebook,
        zoom: user.zoom
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "❌ Server error during login" });
  }
});

// ===== Debug Route (list users) =====
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "❌ Error fetching users" });
  }
});

// ===== TEMP: Delete All Users (GET for browser) =====
app.get("/deleteAll", async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: "🗑 All users deleted successfully (via GET)" });
  } catch (err) {
    res.status(500).json({ message: "❌ Error deleting users" });
  }
});

// ===== Start Server =====
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
