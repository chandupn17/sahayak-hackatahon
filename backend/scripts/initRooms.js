require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('../models/Room');

const defaultRooms = [
  {
    name: 'General Chat',
    description: 'A place to chat with everyone and make new friends',
    type: 'public'
  },
  {
    name: 'Health & Wellness',
    description: 'Discuss health tips, exercises, and wellness activities',
    type: 'public'
  },
  {
    name: 'Technology Help',
    description: 'Get help with smartphones, computers, and other devices',
    type: 'public'
  },
  {
    name: 'Family Corner',
    description: 'Connect with family members and share updates',
    type: 'public'
  }
];

async function initializeRooms() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing rooms
    await Room.deleteMany({});
    console.log('Cleared existing rooms');

    // Create new rooms
    const rooms = await Room.insertMany(defaultRooms);
    console.log('Created default rooms:', rooms);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error initializing rooms:', error);
    process.exit(1);
  }
}

initializeRooms();
