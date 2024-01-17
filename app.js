// const express = require("express");
// const fs = require("fs");
// const path = require("path");

// const app = express();
// const PORT = 3001;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

// // To serve notes.html
// app.get("/notes", (req, res) => {
//   res.sendFile(path.join(__dirname, "public/notes.html"));
// });

// // To serve index.html
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// // To return notes JSON data
// app.get('/api/notes', async (req, res) => {
//   try {
//     const data = await fs.promises.readFile('./db/db.json', {encoding: 'utf8'});
//     const notes = JSON.parse(data);
//     console.log(notes);
//     res.json(notes);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error reading notes');
//   }
// });

// // To add new note
//   app.post("/api/notes", async (req, res) => {
//   try {
//     const note = req.body;
//     note.id = Date.now().toString();

//     const data = await fs.promises.readFile('./db/db.json', {encoding: 'utf8'});
//     const notes = JSON.parse(data);
//     notes.push(note);

//     await fs.promises.writeFile('./db/db.json', JSON.stringify(notes), 'utf8');

//     res.json(note);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error adding note");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT} `);
// });

// Import libraries and define variables
const express = require("express");
const fsp = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const dbFile = "./db/db.json";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Read notes from db.json file
const readNotes = async () => {
  try {
    const data = await fsp.readFile(dbFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${dbFile}`, err);
    throw err;
  }
};

// Write notes to db.json file
const writeNotes = async (notes) => {
  try {
    await fsp.writeFile(dbFile, JSON.stringify(notes, null, 2));
  } catch (err) {
    console.error(`Error writing ${dbFile}`, err);
    throw err;
  }
};

// To return notes from db
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await readNotes();
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading notes");
  }
});

// To post a new note to db
app.post("/api/notes", async (req, res) => {
  try {
    const { title, text } = req.body;

    if (!title || !text) {
      return res.status(400).json({ error: "Title and content are required." });
    }

    // Generate a unique ID for the new note
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    // Get existing notes, add the new one, write to db.json
    const notes = await readNotes();
    notes.push(newNote);
    await writeNotes(notes);
    res.json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding note");
  }
});

// To serve notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// To serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT} `);
});
