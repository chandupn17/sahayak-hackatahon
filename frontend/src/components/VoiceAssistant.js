import React, { useState, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  Paper, 
  Tooltip, 
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  VolumeUp as SpeakIcon,
  VolumeOff as MuteIcon,
  Help as HelpIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Medication as MedicineIcon,
  FitnessCenter as FitnessIcon,
  Event as EventIcon,
  Article as ArticleIcon,
  Phone as PhoneIcon,
  ArrowUpward as ScrollUpIcon,
  Mic as MicIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const VoiceAssistant = ({ activeTab, setActiveTab }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [voiceMenuOpen, setVoiceMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const [voiceRate, setVoiceRate] = useState(0.8);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  
  // Navigation options with icons
  const navOptions = [
    { name: 'Health Dashboard', tab: 0, icon: <DashboardIcon />, color: '#4caf50' },
    { name: 'Medications', tab: 1, icon: <MedicineIcon />, color: '#2196f3' },
    { name: 'Exercise Routines', tab: 2, icon: <FitnessIcon />, color: '#ff9800' },
    { name: 'Appointments', tab: 3, icon: <EventIcon />, color: '#9c27b0' },
    { name: 'Health Tips', tab: 4, icon: <ArticleIcon />, color: '#3f51b5' },
    { name: 'Emergency Contacts', tab: 5, icon: <PhoneIcon />, color: '#f44336' },
  ];
  
  // Check if browser supports speech synthesis
  const browserSupportsSpeech = 'speechSynthesis' in window;
  
  // Check if browser supports speech recognition
  const browserSupportsSpeechRecognition = 
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  // Function to provide visual and audio feedback
  const provideFeedback = (message) => {
    setFeedback(message);
    setShowFeedback(true);
    speak(message);
    
    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
  };
  
  // Function to show error messages
  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
  };

  // Navigate to a tab and provide feedback
  const navigateTo = (tab, name) => {
    setActiveTab(tab);
    provideFeedback(`Showing ${name}`);
    setVoiceMenuOpen(false);
  };
  
  // Toggle voice menu
  const toggleVoiceMenu = () => {
    setVoiceMenuOpen(!voiceMenuOpen);
  };

  // Text-to-speech function
  const speak = (text) => {
    if (browserSupportsSpeech) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use settings for voice
      utterance.rate = voiceRate;
      utterance.volume = voiceVolume;
      utterance.pitch = 1;
      
      // Use selected voice if available
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // If auto-read is enabled and we just finished reading a section,
        // automatically read the next section when navigating
        if (autoRead) {
          // This would be expanded in a real implementation
        }
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      showErrorMessage('Your browser does not support text-to-speech. Please try using Chrome or Edge.');
    }
  };
  
  // Start speech recognition
  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      showErrorMessage('Your browser does not support speech recognition.');
      return;
    }
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        setIsListening(true);
        provideFeedback('Listening...');
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        provideFeedback(`I heard: ${transcript}`);
        
        // Simple command processing
        if (transcript.includes('health dashboard') || transcript.includes('dashboard')) {
          navigateTo(0, 'Health Dashboard');
        } else if (transcript.includes('medication')) {
          navigateTo(1, 'Medications');
        } else if (transcript.includes('exercise')) {
          navigateTo(2, 'Exercise Routines');
        } else if (transcript.includes('appointment')) {
          navigateTo(3, 'Appointments');
        } else if (transcript.includes('tip') || transcript.includes('health tip')) {
          navigateTo(4, 'Health Tips');
        } else if (transcript.includes('emergency') || transcript.includes('contact')) {
          navigateTo(5, 'Emergency Contacts');
        } else if (transcript.includes('read') || transcript.includes('speak')) {
          readCurrentTab();
        } else if (transcript.includes('stop') || transcript.includes('quiet')) {
          stopSpeaking();
        } else if (transcript.includes('help')) {
          setHelpOpen(true);
        } else if (transcript.includes('scroll up') || transcript.includes('top')) {
          scrollToTop();
        } else {
          provideFeedback("I didn't understand. Please try again.");
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          provideFeedback('No speech detected. Please try again.');
        } else {
          showErrorMessage(`Speech recognition error: ${event.error}`);
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      showErrorMessage(`Error starting speech recognition: ${error.message}`);
      setIsListening(false);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (browserSupportsSpeech) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Read the content of the current tab
  const readCurrentTab = () => {
    let contentToRead = '';
    
    switch (activeTab) {
      case 0:
        contentToRead = 'Health Dashboard. Your current heart rate is 72 beats per minute. Blood pressure is 120 over 80. Oxygen level is 98 percent.';
        break;
      case 1:
        contentToRead = 'Medication Tracker. You have 4 medications scheduled for today. Lisinopril at 9 AM, Metformin at 9 AM and 7 PM, Simvastatin at 8 PM, and Vitamin D at 9 AM.';
        break;
      case 2:
        contentToRead = 'Exercise Routines. You have 6 recommended exercises including Chair Yoga, Gentle Stretching, and Balance Exercises.';
        break;
      case 3:
        contentToRead = 'Appointments. You have 2 upcoming appointments. Dr. Sharma on April 15th at 10:30 AM, and Dr. Patel on April 22nd at 2 PM.';
        break;
      case 4:
        contentToRead = 'Health Tips. Today\'s tip: Stay hydrated by drinking at least 8 glasses of water daily. This helps maintain energy levels and supports overall health.';
        break;
      case 5:
        contentToRead = 'Emergency Contacts. Your primary contact is Dr. Sharma. Other contacts include your son Rahul, daughter Priya, and neighbor Mrs. Gupta.';
        break;
      default:
        contentToRead = 'Welcome to the Wellness Mode. You can navigate to different sections using the voice assistant.';
    }
    
    speak(contentToRead);
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    provideFeedback('Scrolling to top of page');
  };

  // Load voices when component mounts
  useEffect(() => {
    if (browserSupportsSpeech) {
      // Load available voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        // Try to find a good default voice (female voice in English)
        const defaultVoice = voices.find(voice => 
          (voice.name.includes('female') || voice.name.includes('Female')) && 
          voice.lang.includes('en')
        ) || voices[0];
        
        if (defaultVoice) {
          setSelectedVoice(defaultVoice);
        }
      };
      
      // Chrome needs this to load voices
      loadVoices();
      
      // Firefox and some browsers need this event
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Clean up on unmount
    return () => {
      if (browserSupportsSpeech) {
        window.speechSynthesis.cancel();
      }
    };
  }, [browserSupportsSpeech]);
  
  // Auto-read when changing tabs if enabled
  useEffect(() => {
    if (autoRead && browserSupportsSpeech) {
      readCurrentTab();
    }
  }, [activeTab, autoRead]);

  return (
    <>
      {/* Voice Assistant Floating Button */}
      <Paper 
        elevation={3} 
        sx={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20, 
          borderRadius: 4,
          p: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          zIndex: 1000,
          bgcolor: isListening ? 'primary.light' : 'background.paper',
          transition: 'all 0.3s ease'
        }}
      >
        <Tooltip title={isListening ? "Listening..." : "Voice Commands"}>
          <IconButton 
            color="primary" 
            onClick={startListening}
            disabled={isListening}
            sx={{ 
              bgcolor: isListening ? 'primary.main' : 'primary.light',
              color: 'white',
              '&:hover': {
                bgcolor: isListening ? 'primary.main' : 'primary.dark',
              },
              position: 'relative'
            }}
          >
            <MicIcon />
            {isListening && (
              <CircularProgress 
                size={48} 
                sx={{ 
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  zIndex: 1,
                  color: 'white'
                }} 
              />
            )}
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Voice Navigation Menu">
          <IconButton 
            color="primary" 
            onClick={toggleVoiceMenu}
            sx={{ 
              bgcolor: 'primary.light',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.main',
              }
            }}
          >
            <SpeakIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title={isSpeaking ? "Stop speaking" : "Read current page"}>
          <IconButton 
            color={isSpeaking ? "secondary" : "primary"} 
            onClick={isSpeaking ? stopSpeaking : readCurrentTab}
          >
            {isSpeaking ? <MuteIcon /> : <SpeakIcon />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Voice Settings">
          <IconButton color="primary" onClick={() => setSettingsOpen(true)}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Help">
          <IconButton color="primary" onClick={() => setHelpOpen(true)}>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Paper>
      
      {/* Voice Navigation Menu */}
      <Dialog
        open={voiceMenuOpen}
        onClose={() => setVoiceMenuOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
          Voice Navigation
          <IconButton
            aria-label="close"
            onClick={() => setVoiceMenuOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph sx={{ textAlign: 'center', mb: 3 }}>
            Select where you would like to go:
          </Typography>
          
          <Grid container spacing={2}>
            {navOptions.map((option) => (
              <Grid item xs={12} sm={6} key={option.tab}>
                <Card 
                  sx={{ 
                    borderLeft: `4px solid ${option.color}`,
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardActionArea onClick={() => navigateTo(option.tab, option.name)}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: option.color }}>
                        {option.icon}
                      </Box>
                      <Typography variant="h6">
                        {option.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<SpeakIcon />}
              onClick={readCurrentTab}
              sx={{ mr: 2 }}
            >
              Read Current Page
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => setVoiceMenuOpen(false)}
            >
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Error Snackbar */}
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      
      {/* Feedback popup */}
      <Fade in={showFeedback}>
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'fixed', 
            bottom: 80, 
            right: 20, 
            borderRadius: 2,
            p: 2,
            zIndex: 1000,
            bgcolor: 'info.light',
            color: 'info.contrastText'
          }}
        >
          <Typography variant="body1">{feedback}</Typography>
        </Paper>
      </Fade>
      
      {/* Help dialog */}
      <Dialog 
        open={helpOpen} 
        onClose={() => setHelpOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Voice Assistant Help
          <IconButton
            aria-label="close"
            onClick={() => setHelpOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            The voice assistant helps you navigate and control the Wellness Mode:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Voice Commands" 
                secondary="Click the microphone button and speak commands like 'show medications' or 'read page'" 
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Voice Navigation" 
                secondary="Click the navigation button to open the menu of sections" 
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Text-to-Speech" 
                secondary="Click the speaker button to have the current page read aloud" 
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Voice Settings" 
                secondary="Click the settings button to adjust voice speed and volume" 
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
          </List>
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Available Voice Commands:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="'Show health dashboard'" secondary="Navigate to health dashboard" />
            </ListItem>
            <ListItem>
              <ListItemText primary="'Show medications'" secondary="Navigate to medications" />
            </ListItem>
            <ListItem>
              <ListItemText primary="'Show exercises'" secondary="Navigate to exercise routines" />
            </ListItem>
            <ListItem>
              <ListItemText primary="'Show appointments'" secondary="Navigate to appointments" />
            </ListItem>
            <ListItem>
              <ListItemText primary="'Show health tips'" secondary="Navigate to health tips" />
            </ListItem>
            <ListItem>
              <ListItemText primary="'Show emergency contacts'" secondary="Navigate to emergency contacts" />
            </ListItem>
            <ListItem>
              <ListItemText primary="'Read page'" secondary="Read current page content" />
            </ListItem>
            <ListItem>
              <ListItemText primary="'Stop'" secondary="Stop reading" />
            </ListItem>
          </List>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This assistant is designed to be simple and reliable, especially for senior citizens.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)} color="primary">
            Close
          </Button>
          <Button 
            onClick={() => {
              setHelpOpen(false);
              startListening();
            }} 
            color="primary" 
            variant="contained"
            startIcon={<MicIcon />}
          >
            Start Voice Commands
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Voice Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Voice Assistant Settings
          <IconButton
            aria-label="close"
            onClick={() => setSettingsOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>Voice Settings</Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography id="voice-speed-slider" gutterBottom>
              Voice Speed: {voiceRate === 0.5 ? 'Slow' : voiceRate === 1 ? 'Normal' : 'Very Slow'}
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography>Slower</Typography>
              </Grid>
              <Grid item xs>
                <input
                  type="range"
                  min={0.5}
                  max={1}
                  step={0.1}
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </Grid>
              <Grid item>
                <Typography>Faster</Typography>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography id="voice-volume-slider" gutterBottom>
              Voice Volume: {Math.round(voiceVolume * 100)}%
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography>Quieter</Typography>
              </Grid>
              <Grid item xs>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </Grid>
              <Grid item>
                <Typography>Louder</Typography>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoRead}
                  onChange={(e) => setAutoRead(e.target.checked)}
                  color="primary"
                />
              }
              label="Automatically read content when changing sections"
            />
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>Test Voice</Typography>
            <Button 
              variant="outlined" 
              color="primary"
              startIcon={<SpeakIcon />}
              onClick={() => speak("This is a test of the voice assistant. You can adjust the settings to make it easier to hear.")}
              sx={{ mr: 2 }}
            >
              Test Voice
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => setSettingsOpen(false)} 
            variant="contained" 
            color="primary"
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VoiceAssistant;
