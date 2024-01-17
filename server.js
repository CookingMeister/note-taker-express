const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db/db.json');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// To serve notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// To serve other static assets
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/notes', async (req, res) => {
  try {
    const data = await fs.readFile(db, 'utf8');
    const notes = JSON.parse(data);
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error reading notes'); 
  }
});

  
  app.post('/api/notes', (req, res) => {
    const note = req.body;
    note.id = Date.now().toString();
  
    fs.readFile(db, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      
      const notes = JSON.parse(data);
      notes.push(note);
  
      fs.writeFile(db, JSON.stringify(notes), 'utf8', (err) => {
        if (err) {
          console.error(err);
          return;
        }
        
        res.json(note);
      });
    });
  });

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT} `);
});
