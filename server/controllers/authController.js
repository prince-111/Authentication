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


exports.resetPassword = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { newPassword } = req.body;

    console.log("Authorization header:", authorization);

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
      return res.status(401).json({ message: "Invalid token" });
    }

    // First, try to find the user without the resetPasswordExpire condition
    let user = await User.findOne({ _id: decoded.userId });
    console.log("User found by ID:", user ? "Yes" : "No");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log("User resetPasswordExpire:", user.resetPasswordExpire);
    console.log("Current time:", new Date());

    // Now check if the reset password hasn't expired
    if (user.resetPasswordExpire && user.resetPasswordExpire <= Date.now()) {
      return res
        .status(400)
        .json({ message: "Password reset token has expired" });
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

// exports.resetPassword = async (req, res) => {
//   try {
//     const { authorization } = req.headers;
//     const { newPassword } = req.body;

//     console.log("Authorization header:", authorization);

//     if (!authorization) {
//       return res
//         .status(401)
//         .json({ message: "Authorization token is required" });
//     }

//     const token = authorization.split(" ")[1]; // Extract token from "Bearer <token>"

//     console.log("Received token:", token);

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (error) {
//       console.error("Token verification failed:", error.message);
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }

//     console.log("Decoded token:", decoded);

//     const user = await User.findById(decoded.userId);

//     console.log("User found:", user ? "Yes" : "No");

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     res.json({ message: "Password reset successful" });
//   } catch (error) {
//     console.error("Reset password error:", error);
//     res
//       .status(500)
//       .json({ message: "Reset password failed", error: error.message });
//   }
// };


// exports.resetPassword = async(req, res)=>{
//   try {
//     // const {token} = req.query; // it not working remove
//     const {authorization} = req.headers; // it working
//     const {newPassword} = req.body;


//     if(!authorization){
//       return res.status(401).json({message:"Authorization token is required"});
//     }

//     const token = authorization.split(" ")[1];

//     console.log("tokenTest", token);
//     console.log("newPassword", newPassword);

//     console.log("Query:", {
//       resetPasswordToken: token,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpire: { $gt: Date.now() }
//     });

//      console.log("User found:", user ? "Yes" : "No");
//      if (user) {
//        console.log("Token expiration:", user.resetPasswordExpire);
//        console.log("Current time:", new Date());
//      }

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired token" });
//     }
    

//     user.password = await bcrypt.hash(newPassword, 10);
//     user.resetPasswordToken = null;
//     user.resetPasswordExpire = null;
//     await user.save();
    
//     res.json({ message: "Password reset successful" , user});
//   } catch (error) {
//     res.status(500).json({ message: "Reset password failed", error: error.message });
//   }
// }


// Forgot Password
// Send a password reset link to a user's email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Create a JWT with the reset token
    const resetJWT = jwt.sign(
      { userId: user._id, resetToken },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Token expires in 15 minutes
    );

    // Save hashed version of reset token to user
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    console.log("User after saving reset token:", user);
    console.log("Generated JWT:", resetJWT);

    // Send email
    await emailService.sendPasswordResetEmail(user.email, resetJWT);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res
      .status(500)
      .json({ message: "Could not send reset email", error: error.message });
  }
};

