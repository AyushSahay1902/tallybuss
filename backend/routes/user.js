const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { authenticateJwt, SECRET } = require('../middleware/user');
const { User } = require('../db/index');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Enable CORS
router.use(cors());

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(403).json({ message: "User already exists!" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User created successfully!', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

// Signin Route
router.post('/signin', authenticateJwt, async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(403).json({ message: 'Invalid username or password' });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Error signing in', error: err.message });
    }
});

module.exports = router;