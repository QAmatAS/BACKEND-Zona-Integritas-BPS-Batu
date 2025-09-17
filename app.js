// app.js
const express = require('express');
const cors = require('cors'); // Import the cors package
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const sampleRoutes = require('./routes/Routes-SampleBPS');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/BPS', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// use the routes
app.use('/users', userRoutes);
app.use('/SOP', sampleRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});