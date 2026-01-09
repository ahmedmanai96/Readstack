const express = require('express');
const router = express.Router();

// SEARCH BOOKS VIA GOOGLE BOOKS API
router.get('/search', async (req, res) => {
    const { q } = req.query; // This gets the "q" from /search?q=Harry+Potter
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}`);
        const data = await response.json();
        
        // Map the data so we only send the useful parts to your frontend
        const books = data.items.map(item => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            description: item.volumeInfo.description,
            thumbnail: item.volumeInfo.imageLinks?.thumbnail
        }));

        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch books from Google" });
    }
});

module.exports = router;