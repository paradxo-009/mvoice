const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

let sentVideos = []; 
let allVideos = []; 


app.get('/kshitiz', (req, res) => {
   
    const videosFolderPath = path.join('.', 'videos');

   
    fs.readdir(videosFolderPath, (err, files) => {
        if (err) {
            console.error('Error reading videos folder:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        allVideos = files.filter(file => {
            return file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.avi') || file.endsWith('.mkv');
        });

      
        if (allVideos.length === 0) {
            return res.status(404).json({ error: 'No videos found' });
        }

      
        const unsentVideos = allVideos.filter(file => !sentVideos.includes(file));

    
        const randomVideoFile = unsentVideos[Math.floor(Math.random() * unsentVideos.length)];

     
        const randomVideoPath = path.join(videosFolderPath, randomVideoFile);

      
        fs.readFile(randomVideoPath, (err, data) => {
            if (err) {
                console.error('Error reading video file:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        
            sentVideos.push(randomVideoFile);

          
            if (sentVideos.length === allVideos.length) {
                sentVideos = [];
            }

         
            res.contentType('video/mp4').send(data);
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
