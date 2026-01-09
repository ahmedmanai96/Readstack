const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json("User not found!");

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(401).json("Wrong credentials!");

        const token = jwt.sign({ id: user._id }, "YOUR_JWT_SECRET", { expiresIn: "3d" });
        const { password, ...info } = user._doc;
        res.status(200).json({ ...info, token });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;