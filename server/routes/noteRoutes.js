// server/routes/noteRoutes.js

const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");

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
 *     summary: Returns a list of notes
 *     tags: [Notes 📔]
 *     responses:
 *       200:
 *         description: The list of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
router.get("/", noteController.getNotes);

/**
 * @swagger
 * /notes:
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
router.post("/createNote", noteController.createNote);

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
router.get("/trash", noteController.getDeletedNotes);

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
router.get("/:id", noteController.getNotesById);

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
router.put("/:id", noteController.updateNote);

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
router.delete("/soft/:id", noteController.softDeleteNote);

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
router.delete("/hard/:id", noteController.hardDeleteNote);

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
router.post("/restore/:id", noteController.restoreNote);

module.exports = router;