const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authController = require("../controllers/authController");


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

module.exports = router;