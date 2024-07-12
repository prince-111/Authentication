const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

/**
 * @swagger
 *  /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users 👦]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 *       500:
 *         description: Internal server error
 */
router.get("/", auth, userController.getUsers);

module.exports = router;
