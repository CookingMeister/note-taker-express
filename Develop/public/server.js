const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/notes.html');
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      
      const notes = JSON.parse(data);
      res.json(notes); 
    });
  });
  
  app.post('/api/notes', (req, res) => {
    const note = req.body;
    note.id = Date.now().toString();
  
    fs.readFile('./db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      
      const notes = JSON.parse(data);
      notes.push(note);
  
      fs.writeFile('./db.json', JSON.stringify(notes), 'utf8', (err) => {
        if (err) {
          console.error(err);
          return;
        }
        
        res.json(note);
      });
    });
  });

app.listen(PORT, () => {
  console.log('Server listening on port 3000');
});
