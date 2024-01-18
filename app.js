const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { readNotes, writeNotes } = require("./utils/read-write.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Serve static notes.html and index.html files
const getNotes = (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
};

const getIndex = (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
};

// Add note to db route
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

app.get("/notes", getNotes); // GET notes
app.route("/api/notes")
     .get(getApiNotes) // GET API notes
     .post(addNote); // POST note
app.delete("/api/notes/:id", deleteNote); // DELETE note by id
app.get("/*", getIndex); // GET catch-all route at end to avoid conflicts

// Create server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT} `);
});
