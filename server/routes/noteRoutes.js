// server/routes/noteRoutes.js

const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const auth = require("../middleware/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - heading
 *         - description
 *       properties:
 *         heading:
 *           type: string
 *           description: The heading of the note
 *         description:
 *           type: string
 *           description: The description of the note
 */


/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Retrieve all notes
 *     tags: [Notes 📔]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of records per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           default: ''
 *         description: The search keyword to filter notes by heading or description
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRecords:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 recordsPerPage:
 *                   type: integer
 *                 notes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       heading:
 *                         type: string
 *                       description:
 *                         type: string
 *                       user:
 *                         type: string
 *                       isDeleted:
 *                         type: boolean
 *                       deletedAt:
 *                         type: string
 *                         format: date-time
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Error retrieving notes
 */

router.get("/", auth, noteController.getNotes);

/**
 * @swagger
 * /notes/createNote:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes 📔]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       201:
 *         description: The created note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 */
router.post("/createNote", auth, noteController.createNote);

/**
 * @swagger
 * /notes/trash:
 *   get:
 *     summary: Returns a list of soft-deleted notes
 *     tags: [Notes 📔]
 *     responses:
 *       200:
 *         description: The list of soft-deleted notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
router.get("/trash", auth, noteController.getDeletedNotes);

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get a note by id
 *     tags: [Notes 📔]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The note id
 *     responses:
 *       200:
 *         description: The note description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: The note was not found
 */
router.get("/:id", auth, noteController.getNotesById);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes 📔]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The note id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       200:
 *         description: The updated note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: The note was not found
 */
router.put("/:id", auth, noteController.updateNote);

/**
 * @swagger
 * /notes/soft/{id}:
 *   delete:
 *     summary: Soft delete a note
 *     tags: [Notes 📔]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The note id
 *     responses:
 *       200:
 *         description: The note was soft deleted
 *       404:
 *         description: The note was not found
 */
router.delete("/soft/:id", auth, noteController.softDeleteNote);

/**
 * @swagger
 * /notes/hard/{id}:
 *   delete:
 *     summary: Hard delete a note
 *     tags: [Notes 📔]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The note id
 *     responses:
 *       200:
 *         description: The note was permanently deleted
 *       404:
 *         description: The note was not found
 */
router.delete("/hard/:id", auth, noteController.hardDeleteNote);

/**
 * @swagger
 * /notes/restore/{id}:
 *   post:
 *     summary: Restore a soft-deleted note
 *     tags: [Notes 📔]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The note id
 *     responses:
 *       200:
 *         description: The note was restored
 *       404:
 *         description: The note was not found
 */
router.post("/restore/:id", auth, noteController.restoreNote);


/**
 * @swagger
 * /notes/getNotesByUser/{userId}:
 *   get:
 *     summary: Retrieve all notes for a given user ID
 *     tags: [Notes 📔]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Notes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 notes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       heading:
 *                         type: string
 *                       description:
 *                         type: string
 *                       user:
 *                         type: string
 *                       isDeleted:
 *                         type: boolean
 *                       deletedAt:
 *                         type: string
 *                         format: date-time
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No notes found for this user
 *       500:
 *         description: Error retrieving notes
 */
router.get("/getNotesByUser/:userId", auth, noteController.getNotesByUser);

module.exports = router;
