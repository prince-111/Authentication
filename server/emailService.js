const nodemailer = require('nodemailer');

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: process.env.SERVICES,
  auth: {
   user: process.env.USER_EMAIL,
   pass: process.env.APP_PASS
  }
});

const Application_URL = process.env.BASE_URL
exports.sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${Application_URL}/verify/${verificationToken}`;
  console.log("testing", URL)

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <h1>Email Verification</h1>
      <p>Thank you for registering. Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};



