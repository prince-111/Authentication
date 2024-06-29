const Note = require("../models/Note");

// Create a notes
exports.createNote = async (req, res) => {
  try {
    const { heading, description } = req.body;

    const note = new Note({
      heading,
      description,
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    const totalRecords = await Note.countDocuments();
    const totalPages = Math.ceil(totalRecords / limit);

    const notes = await Note.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex);

    res.json({
      notes,
      totalRecords,
      totalPages,
      currentPage: page,
      recordsPerPage: limit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get a single note by ID
exports.getNotesById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
