const express = require('express');
const router = express.Router();
const Recommendation = require('../models/Recommendation.js');

// 1. ADD A RECOMMENDATION
router.post('/add', async (req, res) => {
    // Added 'genre' to the destructuring of req.body
    const { bookTitle, author, review, rating, username, genre } = req.body;
    try {
        const newRec = new Recommendation({
            bookTitle,
            author,
            review,
            rating,
            postedBy: username,
            genre: genre || "Other", // Saves the genre, defaults to "Other"
            likes: [] 
        });
        const savedRec = await newRec.save();
        res.status(201).json(savedRec);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 2. GET THE FULL FEED
router.get('/feed', async (req, res) => {
    try {
        const feed = await Recommendation.find().sort({ createdAt: -1 });
        res.json(feed);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. GET USER-SPECIFIC POSTS (For Profile)
router.get('/user/:username', async (req, res) => {
    try {
        const userRecs = await Recommendation.find({ postedBy: req.params.username }).sort({ createdAt: -1 });
        res.status(200).json(userRecs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. LIKE/UNLIKE TOGGLE ROUTE
router.post('/:id/like', async (req, res) => {
    try {
        const { userId } = req.body; 
        if (!userId) return res.status(400).json({ error: "User ID is missing" });

        const post = await Recommendation.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });
        
        if (!post.likes) post.likes = [];

        // TOGGLE LOGIC: 
        // If the user name is already there, remove it (Unlike)
        // If it isn't there, add it (Like)
        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter(name => name !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json(post);
    } catch (err) {
        console.error("LIKE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// 5. COMMENT ON A POST
router.post('/:id/comment', async (req, res) => {
    try {
        const rec = await Recommendation.findById(req.params.id);
        const newComment = { username: req.body.username, text: req.body.text };
        rec.comments.push(newComment);
        await rec.save();
        res.json(rec);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 6. DELETE A POST
router.post('/delete/:id', async (req, res) => {
    try {
        await Recommendation.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;