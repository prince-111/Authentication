const Note = require("../models/Note");

exports.createNote = async (req, res) => {
  try {
    const { heading, description } = req.body;

    const note = new Note({
      heading,
      description,
      // user: req.user.id
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
