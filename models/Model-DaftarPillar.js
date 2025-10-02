const mongoose = require('mongoose');

// Define the schema for the 'user' collection
const DaftarPillarSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  namaPillar: {
    type: String,
    required: true
  },
  linkFolder: {
    type: String,
    required: true
  }
} , { collection: 'DaftarPillar' });

// Create and export the User model
const Pillar = mongoose.model('DaftarPillar', DaftarPillarSchema);

module.exports = Pillar;