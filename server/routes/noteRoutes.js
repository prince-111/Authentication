const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// create  a new note
router.post('/', noteController.createNote);

// get all notes
router.get('/', noteController.getNotes);

// get a single note by ID
router.get('/:id', noteController.getNotesById);

module.exports = router;