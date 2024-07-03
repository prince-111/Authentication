// controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    
  } catch (error) {
    res.status(500).json({error:"Login Failed" ,error: error.message});
  }
}