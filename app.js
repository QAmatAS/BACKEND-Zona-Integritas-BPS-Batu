// app.js
const express = require('express');
const cors = require('cors'); // Import the cors package
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const sampleRoutes1 = require('./routes/Routes-Pillar1');
const sampleRoutes2 = require('./routes/Routes-Pillar2');
const sampleRoutes3 = require('./routes/Routes-Pillar3');
const sampleRoutes4 = require('./routes/Routes-Pillar4');
const sampleRoutes5 = require('./routes/Routes-Pillar5');
const Pillar = require('./routes/Routes-DaftarPillar');

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

app.use('/PillarSatu', sampleRoutes1);
app.use('/PillarDua', sampleRoutes2);
app.use('/PillarTiga', sampleRoutes3);
app.use('/PillarEmpat', sampleRoutes4);
app.use('/PillarLima', sampleRoutes5);
app.use('/DaftarPillar', Pillar);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});