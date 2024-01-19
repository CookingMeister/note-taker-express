const express = require("express");
const {
  getIndex,
  getNotes,
  addNote,
  getApiNotes,
  deleteNote,
} = require("./routes/routes.js");

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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

module.exports = {
  getNotes,
  getIndex
};
