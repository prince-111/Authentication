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



module.exports = router;