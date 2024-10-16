const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Tally } = require('../db/index');
// const authenticateJwt = require('../middleware/user');
const router = express.Router();

router.use(cors());

// Get all tallies of the authenticated user, sorted by date
router.get('/all', async (req, res) => {
    try {
        const tallies = await Tally.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(tallies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tallies', error });
    }
});

// Add a new tally entry for the authenticated user
router.post('/add', authenticateJwt, async (req, res) => {
    const { type, amount } = req.body;

    if (!type || !amount) {
        return res.status(400).json({ message: 'Type and amount are required' });
    }

    try {
        const newTally = new Tally({
            type,
            amount,
            user: req.userId,
        });

        const savedTally = await newTally.save();
        res.status(201).json(savedTally);
    } catch (error) {
        res.status(500).json({ message: 'Error adding tally', error });
    }
});

// Delete a specific tally by ID for the authenticated user
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const tally = await Tally.findOneAndDelete({ _id: id, user: req.userId });

        if (!tally) {
            return res.status(404).json({ message: 'Tally not found or not authorized' });
        }

        res.json({ message: 'Tally deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting tally', error });
    }
});

// Update a specific tally by ID for the authenticated user
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { type, amount } = req.body;

    if (!type || !amount) {
        return res.status(400).json({ message: 'Type and amount are required' });
    }

    try {
        const updatedTally = await Tally.findOneAndUpdate(
            { _id: id, user: req.userId },
            { type, amount },
            { new: true, runValidators: true }
        );

        if (!updatedTally) {
            return res.status(404).json({ message: 'Tally not found or not authorized' });
        }

        res.json(updatedTally);
    } catch (error) {
        res.status(500).json({ message: 'Error updating tally', error });
    }
});

module.exports = router;
