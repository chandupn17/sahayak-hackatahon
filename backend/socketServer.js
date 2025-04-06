const { Server } = require('socket.io');
const { Room, Message } = require('./routes/communityRoutes');

function initializeSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Store active users and their rooms
  const activeUsers = new Map();
  const activeRooms = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a room
    socket.on('join-room', async ({ roomId, userId, username }) => {
      socket.join(roomId);
      activeUsers.set(socket.id, { userId, username, roomId });
      
      // Notify room about new user
      socket.to(roomId).emit('user-joined', { userId, username });
      
      // Save system message about user joining
      try {
        const message = new Message({
          sender: 'system',
          content: `${username} joined the room`,
          room: roomId,
          messageType: 'system'
        });
        await message.save();
        io.to(roomId).emit('new-message', message);
      } catch (error) {
        console.error('Error saving join message:', error);
      }
    });

    // Handle chat messages
    socket.on('send-message', async ({ roomId, content, sender }) => {
      try {
        const message = new Message({
          sender,
          content,
          room: roomId
        });
        await message.save();
        io.to(roomId).emit('new-message', message);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    // Handle video/voice call signaling
    socket.on('call-user', ({ userToCall, signalData, from, name }) => {
      io.to(userToCall).emit('call-user', { signal: signalData, from, name });
    });

    socket.on('answer-call', (data) => {
      io.to(data.to).emit('call-accepted', data.signal);
    });

    // Handle user typing status
    socket.on('typing', ({ roomId, username }) => {
      socket.to(roomId).emit('user-typing', { username });
    });

    socket.on('stop-typing', ({ roomId }) => {
      socket.to(roomId).emit('user-stop-typing');
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      const user = activeUsers.get(socket.id);
      if (user) {
        const { roomId, username } = user;
        
        // Save system message about user leaving
        try {
          const message = new Message({
            sender: 'system',
            content: `${username} left the room`,
            room: roomId,
            messageType: 'system'
          });
          await message.save();
          io.to(roomId).emit('new-message', message);
        } catch (error) {
          console.error('Error saving leave message:', error);
        }

        socket.to(roomId).emit('user-left', { username });
        activeUsers.delete(socket.id);
      }
    });
  });

  return io;
}

module.exports = initializeSocketServer;
