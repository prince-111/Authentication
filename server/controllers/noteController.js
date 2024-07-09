const Note = require("../models/Note");
const User = require("../models/User");

// Create a notes
exports.createNote = async (req, res) => {
  try {
    const { heading, description } = req.body;

    if (!req.user || !req.user.id1) {
      return res.status(400).json({ message: "User ID not found in request" });
    }

    const note = new Note({
      user:req.user.id1,
      heading,
      description
    });
    await note.save();
    res.status(201).json({ message: "Note created successfully", note });
  } catch (error) {
    res.status(400).json({ message: "Error creating note", error: error.message });
  }
};

// Get all notes
exports.getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;
    const searchQuery = req.query.search || '';

    // Create a search filter
    const searchFilter = {
      user: req.user.id,
      $or: [
        { heading: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    };

    const totalRecords = await Note.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalRecords / limit);

    const notes = await Note.find(searchFilter)
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
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id1 });

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
      { _id: req.params.id, user: req.user.id1 },
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
      { _id: req.params.id, user:req.user.id1, isDeleted: false },
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
    const note = await Note.findByIdAndDelete({_id: req.params.id, user:req.user.id1});

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
      { _id: req.params.id, user:req.user.id1, isDeleted: true },
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


exports.getDeletedNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    // Filter for soft-deleted notes
    const filter = { isDeleted: true };

    // Get total count of deleted notes
    const totalRecords = await Note.countDocuments({user:req.user.id1, isDeleted: true, filter});
    const totalPages = Math.ceil(totalRecords / limit);

    // Fetch deleted notes with pagination
    const deletedNotes = await Note.find({user:req.user.id, isDeleted: true, filter})
      .sort({ deletedAt: -1 }) // Sort by deletion date, most recent first
      .skip(skipIndex)
      .limit(limit);

    res.json({
        totalRecords,
        totalPages,
        currentPage: page,      
        recordsPerPage: limit,
        notes: deletedNotes,
    });
  } catch (error) {
    console.error("Error in getDeletedNotes:", error);
    res
      .status(500)
      .json({ message: "Error fetching deleted notes", error: error.message });
  }
};


exports.getNotesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ user: userId, isDeleted: false });

    if (!notes.length) {
      return res.status(404).json({ message: "No notes found for this user" });
    }

    res.status(200).json({ message: "Notes retrieved successfully", notes });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving notes", error: error.message });
  }
};