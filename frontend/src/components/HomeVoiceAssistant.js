import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
} from '@mui/icons-material';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const HomeVoiceAssistant = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const commands = [
    {
      command: ['go to *', 'open *', 'show *'],
      callback: (destination) => handleNavigation(destination),
    },
    {
      command: 'help',
      callback: () => speak('Here are some commands you can use: Go to community, Go to wellness, Go to emergency contacts, Go to religious companion'),
    },
  ];

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower speech rate for seniors
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleNavigation = (destination) => {
    const routes = {
      'community': '/community',
      'wellness': '/wellness',
      'emergency': '/emergency',
      'emergency contacts': '/emergency',
      'religious': '/religious',
      'religious companion': '/religious',
      'home': '/',
      'dashboard': '/',
      'tech support': '/tech-support',
      'help': '/help'
    };

    const normalizedDestination = destination.toLowerCase();
    const route = routes[normalizedDestination];

    if (route) {
      speak(`Going to ${destination}`);
      navigate(route);
    } else {
      speak("I'm sorry, I don't recognize that destination. Try saying 'help' for available commands.");
    }
  };

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      setMessage('Browser does not support speech recognition.');
      setShowMessage(true);
      return;
    }

    if (isListening) {
      SpeechRecognition.stopListening();
      speak('Voice assistant deactivated');
    } else {
      SpeechRecognition.startListening({ continuous: true });
      speak('Voice assistant activated. How can I help you?');
    }
    setIsListening(!isListening);
  };

  useEffect(() => {
    return () => {
      if (isListening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [isListening]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: isListening ? 'primary.light' : 'background.paper',
        }}
      >
        <Tooltip title={isListening ? 'Stop listening' : 'Start voice assistant'}>
          <IconButton
            color={isListening ? 'secondary' : 'primary'}
            onClick={toggleListening}
            size="large"
            sx={{
              animation: isListening ? 'pulse 1.5s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
          >
            {isListening ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
        </Tooltip>
        {isListening && (
          <Typography variant="body1" color="text.secondary">
            {transcript || 'Listening...'}
          </Typography>
        )}
      </Paper>

      <Snackbar
        open={showMessage}
        autoHideDuration={6000}
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowMessage(false)} severity="error">
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomeVoiceAssistant;
