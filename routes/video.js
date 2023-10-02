const express = require('express');
const axios = require('axios')
const router = express.Router();

const youtube_apiKey = "Put your APIKEY";

router.get('/video/:title', async (req, res) => {
    const { title } = req.params;

    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${youtube_apiKey}&q=${title}&type=video&part=snippet&maxResults=1`);
        const video = response.data.items[0];

        res.render('video', { video });
    } catch (error) {
        console.error(error);
        res.status(404).render('error', { message: 'Video not found', error });
    }
});

  module.exports = router;