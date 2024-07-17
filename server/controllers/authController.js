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


//* logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" , res});
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
}


// Reset Password
exports.resetPassword = async (req, res) => {
  console.log("resetPassword working or not 1")
  try {
    console.log("resetPassword working or not 2")
    const { authorization } = req.headers;
    const { newPassword } = req.body;

    console.log("Authorization header:", authorization);
    console.log("tokenTest", newPassword)

    if (!authorization) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    const token = authorization.split(" ")[1];

    console.log("Extracted token:", token);

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
    } catch (error) {
      console.error("Token verification failed:", error.message);
      if (error instanceof jwt.TokenExpiredError) {
        return res
          .status(401)
          .json({
            message:
              "Password reset token has expired, please request a new one",
          });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    // Check if the token is a password reset token
    if (!decoded.resetToken) {
      return res
        .status(400)
        .json({
          message: "Invalid token type. Please use the password reset token",
        });
    }

    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: crypto
        .createHash("sha256")
        .update(decoded.resetToken)
        .digest("hex"),
      resetPasswordExpire: { $gt: Date.now() },
    });

    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res
      .status(500)
      .json({ message: "Reset password failed", error: error.message });
  }
};

