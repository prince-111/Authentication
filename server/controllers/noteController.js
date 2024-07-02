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
        totalRecords,
        totalPages,
        currentPage: page,
        recordsPerPage: limit,
        notes,
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


// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { heading, description } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id },
      { heading, description },
      { new: true, runValidators: true }
    );
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete a note
// exports.deleteNote = async (req, res) => {
//   try {
//     const note = await Note.findOneAndDelete({ _id: req.params.id });
//     if (!note) {
//       return res.status(404).json({ message: "Note not found" });
//     }
//     res.json({ message: "Note deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// Soft Delete a note
exports.softDeleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or already deleted" });
    }
    res.json({ message: "Note deleted successfully", note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hard delete a note
exports.hardDeleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully", note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Restore a soft-deleted note
exports.restoreNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, isDeleted: true },
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or already restored" });
    }
    res.json({ message: "note restored successfully", note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
