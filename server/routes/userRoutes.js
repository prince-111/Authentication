const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns a list of user
 *     tags: [Users 👦]
 *     responses:
 *       200:
 *         description: The list of user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

router.get("/", auth, userController.getUsers);

module.exports = router;
