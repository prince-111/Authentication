const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.post('/', noteController.createNote);

router.get('/', noteController.getNotes);

module.exports = router;