const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  participants: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  }
});

module.exports = mongoose.model('Room', roomSchema);
