const nodemailer = require("nodemailer");

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: process.env.SERVICES,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.APP_PASS,
  },
});

const Application_URL = process.env.BASE_URL;

exports.sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${Application_URL}/verify/${verificationToken}`;
  console.log("testing", Application_URL);

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h1>Email Verification</h1>
      <p>Thank you for registering. Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

// New function for sending password reset email
exports.sendPasswordResetEmail = async (email, resetToken) => {
  const resetLink = `${Application_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Password Reset Request",
    html: `
      <h1>Password Reset Request</h1>
      <p>You have requested to reset your password. Please click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
