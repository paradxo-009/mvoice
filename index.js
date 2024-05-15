const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

let allAudios = [];
let audioIndex = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function sendNextAudio(res) {
    const audioFile = allAudios[audioIndex];
    const audioPath = path.join('.', 'audios', audioFile);

    fs.readFile(audioPath, (err, data) => {
        if (err) {
            console.error('Error reading audio file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.contentType('audio/mpeg').send(data);
        audioIndex = (audioIndex + 1) % allAudios.length; 
    });
}
app.get('/', (req, res) => {
  res.send('meme voice');
});
app.get('/kshitiz', (req, res) => {
    if (allAudios.length === 0) {
        fs.readdir(path.join('.', 'audios'), (err, files) => {
            if (err) {
                console.error('Error reading audios folder:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            allAudios = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.ogg'));
            shuffleArray(allAudios); 
            sendNextAudio(res);
        });
    } else {
        sendNextAudio(res);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
