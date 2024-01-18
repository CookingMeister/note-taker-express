const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readNotes, writeNotes } = require("../utils/read-write.js");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add note to db.json route
const addNote = async (req, res) => {
  try {
    const { title, text } = req.body;
    !title || !text
      ? res.status(400).send("Title and content are required.")
      : null;
    // Generate a unique ID for the new note
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };
    // Get existing notes, add the new one, rewrite to db.json
    const notes = await readNotes();
    notes.push(newNote);
    await writeNotes(notes);
    res.json(newNote);
  } catch (err) {
    // error handling
    console.error("Error adding note", err);
    res.status(500).send("Internal error adding note");
    throw err;
  }
};

// Read notes from db route
const getApiNotes = async (req, res) => {
  try {
    const notes = await readNotes();
    res.json(notes);
  } catch (err) {
    // error handling
    console.error("Error reading notes", err);
    res.status(500).send("Error reading notes");
    throw err;
  }
};

// Delete note from db route
const deleteNote = async (req, res) => {
  try {
    const id = req.params.id; // Grab id from params
    const notes = await readNotes();
    // Find note index to delete by matching id
    const noteIndex = notes.findIndex((note) => note.id === id);
    noteIndex !== -1
      ? (notes.splice(noteIndex, 1), // Remove note from array
        await writeNotes(notes), // Rewrite db.json with updated array
        console.log("Note deleted successfully"))
      : console.log("Note not found");
  } catch (err) {
    // error handling
    console.error(err);
    res.status(500).send("Error deleting note");
    throw err;
  }
  res.redirect("/api/notes");
};

module.exports = {
  addNote,
  getApiNotes,
  deleteNote
};