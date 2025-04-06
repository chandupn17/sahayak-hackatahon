const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  room: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  messageType: { type: String, enum: ['text', 'image', 'system'], default: 'text' }
});

const Message = mongoose.model('Message', messageSchema);

// Room Schema
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  participants: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  type: { type: String, enum: ['public', 'private'], default: 'public' }
});

const Room = mongoose.model('Room', roomSchema);

// Get all rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({ type: 'public' });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Create a new room
router.post('/rooms', async (req, res) => {
  try {
    const { name, description, type = 'public' } = req.body;
    const room = new Room({ name, description, type });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Get room messages
router.get('/rooms/:roomId/messages', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Join a room
router.post('/rooms/:roomId/join', async (req, res) => {
  try {
    const { userId } = req.body;
    await Room.findByIdAndUpdate(
      req.params.roomId,
      { $addToSet: { participants: userId } }
    );
    res.json({ message: 'Joined room successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join room' });
  }
});

module.exports = { router, Room, Message };
