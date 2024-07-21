const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");


// * Registration user
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth🪴]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Some server error
 */
router.post('/register', authController.register);

// * Login
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth🪴]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Some server error
 */
router.post('/login', authController.login);

// * Logout
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth🪴]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Logout failed
 */
router.post('/logout', auth, authController.logout);



//* Verify Email
/**
 * @swagger
 * /verify-email:
 *   get:
 *     summary: Verify a user's email
 *     tags: [Auth🪴]
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid token or user not found
 *       500:
 *         description: Email verification failed
 */
router.get('/verify-email', authController.verifyEmail);



// * Forget Password
/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Send a password reset link to a user's email
 *     tags: [Auth🪴]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/forgot-password', authController.forgotPassword);


//* Reset Password
/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth🪴]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid or expired token
 *       401:
 *         description: Authorization token is required or invalid
 *       500:
 *         description: Server error
 */

router.post('/reset-password', authController.resetPassword);


module.exports = router;