const express = require("express");
const path = require("path");
const { addNote, getApiNotes, deleteNote } = require("./routes/routes.js");

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

// ROUTES
app.get("/notes", getNotes); // GET notes
app
  .route("/api/notes")
  .get(getApiNotes) // GET API notes
  .post(addNote); // POST note
app.delete("/api/notes/:id", deleteNote); // DELETE note by id
app.get("/*", getIndex); // GET catch-all route at end to avoid conflicts

// Create server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT} `);
});