import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Send as SendIcon,
  Call as CallIcon,
  Videocam as VideoIcon,
  Group as GroupIcon,
  Chat as ChatIcon,
  Forum as ForumIcon,
  People as PeopleIcon,
  MicOff as MicOffIcon,
  VideocamOff as VideocamOffIcon,
} from '@mui/icons-material';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { useUser } from '@clerk/clerk-react';

const Community = () => {
  const { user } = useUser();
  const [showLanding, setShowLanding] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState('');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const socket = useRef(null);

  const [rooms] = useState([
    {
      _id: '7795324362',
      name: 'Dr. Sharma (Medical Support)',
      description: 'Connect with Dr. Sharma for medical advice and support',
      type: 'public',
      icon: <ForumIcon sx={{ fontSize: 40 }} />,
      phone: '7795324362'
    },
    {
      _id: '7338095088',
      name: 'Tech Support (Rahul)',
      description: 'Get help with your devices and technical issues',
      type: 'public',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      phone: '7338095088'
    },
    {
      _id: '7975074414',
      name: 'Emergency Support',
      description: '24/7 emergency assistance and quick response',
      type: 'public',
      icon: <ChatIcon sx={{ fontSize: 40 }} />,
      phone: '7975074414'
    }
  ]);

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(process.env.FRONTEND_URL , {
      transports: ['websocket'],
      upgrade: false
    });

    // Handle incoming messages
    socket.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedRoom) return;

    try {
      const newMessage = {
        type: 'user',
        content: messageInput,
        sender: user?.fullName || 'Anonymous',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');

      if (socket.current) {
        socket.current.emit('send-message', {
          roomId: selectedRoom,
          ...newMessage
        });
      }
    } catch (error) {
      setError('Failed to send message');
    }
  };

  const renderLandingPage = () => (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom sx={{ color: '#1976d2', mb: 4 }}>
        Welcome to Sahayak Community
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        {[
          {
            title: 'Chat Rooms',
            description: 'Join public chat rooms to connect with others',
            icon: <ChatIcon sx={{ fontSize: 60, color: '#1976d2' }} />,
            action: () => setShowLanding(false)
          },
          {
            title: 'Video Calls',
            description: 'Have face-to-face conversations with friends and family',
            icon: <VideoIcon sx={{ fontSize: 60, color: '#1976d2' }} />,
            action: () => setShowLanding(false)
          },
          {
            title: 'Support Groups',
            description: 'Join groups focused on specific topics and interests',
            icon: <GroupIcon sx={{ fontSize: 60, color: '#1976d2' }} />,
            action: () => setShowLanding(false)
          }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              onClick={item.action}
            >
              {item.icon}
              <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                {item.title}
              </Typography>
              <Typography color="text.secondary">
                {item.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Why Join Our Community?
        </Typography>
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Stay Connected</Typography>
            <Typography>Keep in touch with friends and family</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Get Support</Typography>
            <Typography>Find help and guidance when needed</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Share Experiences</Typography>
            <Typography>Connect with others who understand</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {showLanding ? (
        renderLandingPage()
      ) : (
        <Box sx={{ height: '100%', display: 'flex', p: 2 }}>
          {/* Rooms List */}
          <Paper sx={{ width: 300, mr: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">Chat Rooms</Typography>
            </Box>
            <List sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
              {rooms.map((room) => (
                <ListItem
                  key={room._id}
                  button
                  onClick={() => setSelectedRoom(room._id)}
                  selected={selectedRoom === room._id}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {room.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={room.name}
                    secondary={room.description}
                    primaryTypographyProps={{ fontSize: '1.1rem' }}
                    secondaryTypographyProps={{ fontSize: '0.9rem' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Chat Area */}
          <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {selectedRoom ? (
              <>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {rooms.find(r => r._id === selectedRoom)?.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<CallIcon />}
                      onClick={() => window.location.href = `tel:${rooms.find(r => r._id === selectedRoom)?.phone}`}
                      sx={{ mr: 1 }}
                    >
                      Call {rooms.find(r => r._id === selectedRoom)?.phone}
                    </Button>
                    <IconButton color="primary" onClick={() => setShowVideoCall(true)}>
                      <VideoIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {messages.map((message, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === user?.fullName ? 'flex-end' : 'flex-start',
                        mb: 1
                      }}
                    >
                      <Paper
                        sx={{
                          p: 1,
                          px: 2,
                          maxWidth: '70%',
                          bgcolor: message.sender === user?.fullName ? 'primary.main' : 'grey.100',
                          color: message.sender === user?.fullName ? 'white' : 'inherit'
                        }}
                      >
                        <Typography variant="body1">{message.content}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {message.sender}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Grid container spacing={1}>
                    <Grid item xs>
                      <TextField
                        fullWidth
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        InputProps={{ sx: { fontSize: '1.1rem' } }}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={sendMessage}
                        endIcon={<SendIcon />}
                        sx={{ height: '100%', px: 3 }}
                      >
                        Send
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Select a room to start chatting
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      )}

      {/* Video Call Dialog */}
      <Dialog
        open={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Video Call</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 300, bgcolor: 'grey.200' }}>
                <Typography>Your Video</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 300, bgcolor: 'grey.200' }}>
                <Typography>Peer Video</Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVideoCall(false)} color="error">
            End Call
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Community;
