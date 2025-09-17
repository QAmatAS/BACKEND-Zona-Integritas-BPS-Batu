const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

// Route to get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});

        console.log('All users in the collection:');
        res.status(200).json(users);
        console.log(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;