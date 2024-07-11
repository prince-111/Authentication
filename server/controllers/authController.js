// controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const emailService = require("../emailService");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


//  Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken,
    });
    await user.save();
     
    //* Send verification email
    await emailService.sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      user,
    });
    
  } catch (error) {
    res
      .status(500)
      .json({ error: "Registration failed", error: error.message });
  }
};


// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid token or user not found" });
    }

    user.isVerifiedToken = true;
    user.verificationToken = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Email verification failed", details: error.message });
  }
};


// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      status: "success",
      message: "Login successful",
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

