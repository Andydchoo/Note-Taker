const express = require('express');
const path = require('path');
const fs = require('fs')
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// For Express version less than 4.16.0
// ------------------------------------
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    return fs.readFile("db/db.json", function(err, data) {
        if(err) {
           return console.log(err);
        }
   
        return res.json(JSON.parse(data));
     })
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    const note = { title, text, id: Date.now() };

    let rawdata = fs.readFileSync("db/db.json");
    let notesArray = JSON.parse(rawdata);
    notesArray.push(note);

    let data = JSON.stringify(notesArray);
    return fs.writeFileSync('db/db.json', data);
});

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;

    let rawdata = fs.readFileSync("db/db.json");
    let notesArray = JSON.parse(rawdata);
    
    notesArray = notesArray.filter(function(note) { return note.id != id });

    let data = JSON.stringify(notesArray);
    return fs.writeFileSync('db/db.json', data);
});

// app.listen(port, () => console.log('Example app is listening on port 3000.'));

app.listen(process.env.PORT || 3000);
 
