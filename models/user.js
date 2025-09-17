const mongoose = require('mongoose');

// Define the schema for the 'user' collection
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  noTelp: {
    type: String,
    required: true
  },
  jumlahPekerjaan: {
    type: Number,
    required: true
  }
} , { collection: 'user' });

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;