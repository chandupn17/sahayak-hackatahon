import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  Fab,
  Zoom,
  Slide,
  Fade,
  Chip
} from '@mui/material';
import {
  Mic as MicIcon,
  MicNone as MicIdleIcon,
  VolumeUp as SpeakIcon,
  Settings as SettingsIcon,
  Translate as TranslateIcon,
  Help as HelpIcon,
  Close as CloseIcon,
  Language as LanguageIcon,
  Home as HomeIcon,
  Medication as MedicineIcon,
  FitnessCenter as FitnessIcon,
  Event as EventIcon,
  Article as ArticleIcon,
  Phone as PhoneIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import axios from 'axios';

// Ripple animation component for Siri-like effect
const SiriRipple = ({ active }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: active ? 'ripple 1.5s infinite ease-in-out' : 'none',
        '@keyframes ripple': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: 1,
            boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.7)'
          },
          '70%': {
            transform: 'scale(1.2)',
            opacity: 0.7,
            boxShadow: '0 0 0 10px rgba(25, 118, 210, 0.3)'
          },
          '100%': {
            transform: 'scale(0.8)',
            opacity: 1,
            boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)'
          }
        }
      }}
    />
  );
};

const SiriLikeAssistant = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  
  // State for voice assistant
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showActivationHint, setShowActivationHint] = useState(false);
  
  // State for assistant settings
  const [alwaysListening, setAlwaysListening] = useState(false);
  const [wakeWord, setWakeWord] = useState('sahayak');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [assistantActive, setAssistantActive] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // State for language selection
  const [languages, setLanguages] = useState([
    { code: 'en', name: 'English', voice: 'en-IN' },
    { code: 'hi', name: 'Hindi', voice: 'hi-IN' },
    { code: 'ta', name: 'Tamil', voice: 'ta-IN' },
    { code: 'te', name: 'Telugu', voice: 'te-IN' },
    { code: 'bn', name: 'Bengali', voice: 'bn-IN' }
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState({ code: 'en', name: 'English', voice: 'en-IN' });
  
  // Speech recognition and synthesis
  const recognitionRef = useRef(null);
  const continuousRecognitionRef = useRef(null);
  const synth = window.speechSynthesis;
  
  // Context for Gemini API
  const contextRef = useRef({
    activeTab,
    userPreferences: {
      language: 'English',
      wakeWord: 'sahayak',
      alwaysListening: false
    },
    appState: {
      currentRoute: window.location.pathname
    }
  });
  
  // Navigation options
  const navigationOptions = [
    { name: 'Home', route: '/', icon: <HomeIcon />, command: 'go home' },
    { name: 'Health Dashboard', tab: 0, icon: <DashboardIcon />, command: 'health dashboard' },
    { name: 'Medications', tab: 1, icon: <MedicineIcon />, command: 'medications' },
    { name: 'Exercise Routines', tab: 2, icon: <FitnessIcon />, command: 'exercise' },
    { name: 'Appointments', tab: 3, icon: <EventIcon />, command: 'appointments' },
    { name: 'Health Tips', tab: 4, icon: <ArticleIcon />, command: 'health tips' },
    { name: 'Emergency Contacts', tab: 5, icon: <PhoneIcon />, command: 'emergency contacts' }
  ];
  
  // Update context when activeTab changes
  useEffect(() => {
    contextRef.current = {
      ...contextRef.current,
      activeTab,
      appState: {
        ...contextRef.current.appState,
        currentRoute: window.location.pathname
      }
    };
  }, [activeTab]);
  
  // Initialize wake word detection if always listening is enabled
  useEffect(() => {
    if (alwaysListening) {
      startContinuousListening();
      
      // Show hint about activation
      setShowActivationHint(true);
      setTimeout(() => {
        setShowActivationHint(false);
      }, 5000);
    } else {
      stopContinuousListening();
    }
    
    // Update context
    contextRef.current.userPreferences.alwaysListening = alwaysListening;
    contextRef.current.userPreferences.wakeWord = wakeWord;
    
    return () => {
      stopContinuousListening();
    };
  }, [alwaysListening, wakeWord]);
  
  // Start continuous listening for wake word
  const startContinuousListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser');
      setShowError(true);
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    continuousRecognitionRef.current = new SpeechRecognition();
    
    continuousRecognitionRef.current.lang = selectedLanguage.voice;
    continuousRecognitionRef.current.continuous = true;
    continuousRecognitionRef.current.interimResults = true;
    
    continuousRecognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript.toLowerCase())
        .join(' ');
      
      // Check for wake word
      if (transcript.includes(wakeWord.toLowerCase())) {
        // Stop continuous listening and start active listening
        stopContinuousListening();
        activateAssistant();
      }
    };
    
    continuousRecognitionRef.current.onerror = (event) => {
      console.error('Continuous speech recognition error:', event.error);
      // Restart if it fails
      if (alwaysListening) {
        stopContinuousListening();
        setTimeout(startContinuousListening, 1000);
      }
    };
    
    continuousRecognitionRef.current.onend = () => {
      // Restart if it ends unexpectedly
      if (alwaysListening) {
        stopContinuousListening();
        setTimeout(startContinuousListening, 1000);
      }
    };
    
    continuousRecognitionRef.current.start();
  };
  
  // Stop continuous listening
  const stopContinuousListening = () => {
    if (continuousRecognitionRef.current) {
      try {
        continuousRecognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping continuous recognition:', e);
      }
    }
  };
  
  // Activate the assistant (Siri-like activation)
  const activateAssistant = () => {
    setAssistantActive(true);
    
    // Play activation sound
    const audio = new Audio('/activation.mp3');
    audio.play().catch(e => console.error('Error playing activation sound:', e));
    
    // Show visual feedback
    provideFeedback('How can I help you?');
    
    // Start listening for command
    setTimeout(() => {
      startListening();
    }, 500);
    
    // Auto-deactivate after 30 seconds if no interaction
    setTimeout(() => {
      if (assistantActive && !isListening && !isSpeaking && !isProcessing) {
        setAssistantActive(false);
      }
    }, 30000);
  };
  
  // Provide visual and audio feedback
  const provideFeedback = (message) => {
    setFeedbackMessage(message);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
    }, 5000);
    
    // Speak the feedback if not already speaking
    if (!isSpeaking) {
      speakResponse(message);
    }
  };
  
  // Start speech recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser');
      setShowError(true);
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.lang = selectedLanguage.voice;
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };
    
    recognitionRef.current.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      setTranscript(currentTranscript);
      
      // If this is a final result, process it
      if (event.results[0].isFinal) {
        processCommand(currentTranscript);
      }
    };
    
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error !== 'no-speech') {
        setError(`Speech recognition error: ${event.error}`);
        setShowError(true);
      }
      
      // If always listening is enabled, restart continuous listening
      if (alwaysListening) {
        setTimeout(startContinuousListening, 1000);
      }
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
      
      // If always listening is enabled, restart continuous listening
      if (alwaysListening) {
        setTimeout(startContinuousListening, 1000);
      }
    };
    
    recognitionRef.current.start();
  };
  
  // Stop speech recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
    setIsListening(false);
    
    // If always listening is enabled, restart continuous listening
    if (alwaysListening) {
      setTimeout(startContinuousListening, 1000);
    }
  };
  
  // Process command with navigation and Gemini API
  const processCommand = async (command) => {
    if (!command) return;
    
    setIsProcessing(true);
    const lowerCommand = command.toLowerCase();
    
    // Check for navigation commands first
    const navigationCommand = checkForNavigationCommand(lowerCommand);
    if (navigationCommand) {
      handleNavigation(navigationCommand);
      setIsProcessing(false);
      return;
    }
    
    // Check for system commands
    if (lowerCommand.includes('stop listening') || lowerCommand.includes('turn off')) {
      setAlwaysListening(false);
      provideFeedback('Always listening mode turned off');
      setIsProcessing(false);
      return;
    }
    
    if (lowerCommand.includes('start listening') || lowerCommand.includes('always listen')) {
      setAlwaysListening(true);
      provideFeedback('Always listening mode turned on');
      setIsProcessing(false);
      return;
    }
    
    // If no direct navigation or system command, use Gemini API
    try {
      // In a real implementation, this would call the backend API
      // For now, we'll simulate a response
      setTimeout(() => {
        const simulatedResponses = {
          'what time is it': `The current time is ${new Date().toLocaleTimeString()}`,
          'how are you': "I'm doing well, thank you for asking! How can I assist you today?",
          'tell me about my health': "Your heart rate has been normal today, averaging 72 BPM. Your blood pressure reading from this morning was 120/80, which is excellent.",
          'what medications': "You have 3 medications scheduled for today: Lisinopril at 9 AM, Metformin at 9 AM and 7 PM, and Vitamin D at 9 AM.",
          'default': "I'm sorry, I didn't understand that command. Can you please try again?"
        };
        
        let responseText = simulatedResponses.default;
        
        // Check for partial matches
        Object.keys(simulatedResponses).forEach(key => {
          if (key !== 'default' && lowerCommand.includes(key)) {
            responseText = simulatedResponses[key];
          }
        });
        
        setResponse(responseText);
        provideFeedback(responseText);
        setIsProcessing(false);
      }, 1500);
    } catch (err) {
      console.error('Error processing command:', err);
      setError('Failed to process your request');
      setShowError(true);
      setIsProcessing(false);
    }
  };
  
  // Check if command contains navigation instructions
  const checkForNavigationCommand = (command) => {
    // Check for direct navigation commands
    for (const option of navigationOptions) {
      if (command.includes(option.command)) {
        return option;
      }
    }
    
    // Check for general navigation phrases
    if (command.includes('go to') || command.includes('navigate to') || command.includes('open')) {
      for (const option of navigationOptions) {
        if (command.includes(option.name.toLowerCase())) {
          return option;
        }
      }
    }
    
    return null;
  };
  
  // Handle navigation based on command
  const handleNavigation = (navigationOption) => {
    if (navigationOption.route) {
      // Navigate to a different route
      navigate(navigationOption.route);
      provideFeedback(`Navigating to ${navigationOption.name}`);
    } else if (navigationOption.tab !== undefined) {
      // Switch tabs within the current page
      setActiveTab(navigationOption.tab);
      provideFeedback(`Showing ${navigationOption.name}`);
    }
  };
  
  // Speak response using speech synthesis
  const speakResponse = (text) => {
    if (!synth) {
      setError('Text-to-speech not supported in this browser');
      setShowError(true);
      return;
    }
    
    // Cancel any ongoing speech
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage.voice;
    utterance.rate = 0.9; // Slightly slower for seniors
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synth.speak(utterance);
  };
  
  // Stop speaking
  const stopSpeaking = () => {
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };
  
  // Change language
  const handleLanguageChange = (event) => {
    const langCode = event.target.value;
    const selected = languages.find(lang => lang.code === langCode);
    
    if (selected) {
      setSelectedLanguage(selected);
      contextRef.current.userPreferences.language = selected.name;
      
      // Stop and restart continuous listening with new language
      if (alwaysListening) {
        stopContinuousListening();
        setTimeout(startContinuousListening, 500);
      }
    }
  };
  
  return (
    <>
      {/* Main Siri-like Assistant Button */}
      <Zoom in={true}>
        <Fab
          color={assistantActive ? "secondary" : "primary"}
          aria-label="voice assistant"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 60,
            height: 60,
            boxShadow: 3,
            zIndex: 1000,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }}
          onClick={() => {
            if (assistantActive) {
              setAssistantActive(false);
              stopListening();
              stopSpeaking();
            } else {
              activateAssistant();
            }
          }}
        >
          {isListening ? (
            <MicIcon fontSize="large" />
          ) : (
            <MicIdleIcon fontSize="large" />
          )}
          <SiriRipple active={isListening || isProcessing} />
        </Fab>
      </Zoom>
      
      {/* Settings Button */}
      <Zoom in={true}>
        <Fab
          size="small"
          color="primary"
          aria-label="settings"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 90,
            boxShadow: 2,
            zIndex: 1000
          }}
          onClick={() => setSettingsOpen(true)}
        >
          <SettingsIcon />
        </Fab>
      </Zoom>
      
      {/* Help Button */}
      <Zoom in={true}>
        <Fab
          size="small"
          color="primary"
          aria-label="help"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 150,
            boxShadow: 2,
            zIndex: 1000
          }}
          onClick={() => setHelpOpen(true)}
        >
          <HelpIcon />
        </Fab>
      </Zoom>
      
      {/* Language Indicator */}
      <Zoom in={true}>
        <Fab
          size="small"
          color="primary"
          aria-label="language"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 210,
            boxShadow: 2,
            zIndex: 1000
          }}
          onClick={() => setSettingsOpen(true)}
        >
          <LanguageIcon />
        </Fab>
      </Zoom>
      
      {/* Activation Hint */}
      <Snackbar
        open={showActivationHint}
        autoHideDuration={5000}
        onClose={() => setShowActivationHint(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          Say "{wakeWord}" to activate the voice assistant
        </Alert>
      </Snackbar>
      
      {/* Feedback Message */}
      <Slide direction="up" in={showFeedback}>
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 20,
            borderRadius: 2,
            p: 2,
            maxWidth: 300,
            zIndex: 1000,
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="body1">{feedbackMessage}</Typography>
          {isListening && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {transcript || "Listening..."}
            </Typography>
          )}
          {isProcessing && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Processing...
              </Typography>
            </Box>
          )}
        </Paper>
      </Slide>
      
      {/* Settings Dialog */}
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
          <Typography variant="h6" gutterBottom>Voice Assistant Mode</Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={alwaysListening}
                onChange={(e) => setAlwaysListening(e.target.checked)}
                color="primary"
              />
            }
            label="Always listening mode (like Siri)"
            sx={{ mb: 2, display: 'block' }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            When enabled, the assistant will listen for the wake word "{wakeWord}" to activate.
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>Language Settings</Typography>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              id="language-select"
              value={selectedLanguage.code}
              label="Language"
              onChange={handleLanguageChange}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            startIcon={<SpeakIcon />}
            onClick={() => {
              const testPhrases = {
                en: "Hello, I am your voice assistant. How can I help you today?",
                hi: "नमस्ते, मैं आपका वॉयस असिस्टेंट हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
                ta: "வணக்கம், நான் உங்கள் குரல் உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
                te: "హలో, నేను మీ వాయిస్ అసిస్టెంట్. నేను ఈరోజు మీకు ఎలా సహాయం చేయగలను?",
                bn: "হ্যালো, আমি আপনার ভয়েস অ্যাসিস্ট্যান্ট। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?"
              };
              
              const phrase = testPhrases[selectedLanguage.code] || testPhrases.en;
              speakResponse(phrase);
            }}
            sx={{ mb: 2 }}
          >
            Test Voice
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setSettingsOpen(false)}
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Help Dialog */}
      <Dialog
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Siri-Like Voice Assistant Help
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
          <Typography variant="h6" gutterBottom>
            How to Use the Voice Assistant
          </Typography>
          
          <Typography paragraph>
            This voice assistant works like Siri, allowing you to navigate and control the app with just your voice.
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Activation
            </Typography>
            
            <Typography paragraph>
              {alwaysListening ? (
                <>Just say <strong>"{wakeWord}"</strong> to activate the assistant, or tap the microphone button.</>
              ) : (
                <>Tap the microphone button to activate the assistant.</>
              )}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Navigation Commands
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {navigationOptions.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: 'primary.main' }}>
                    {option.icon}
                  </Box>
                  <Typography>
                    <strong>"Go to {option.name}"</strong> or <strong>"{option.command}"</strong>
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Other Useful Commands
            </Typography>
            
            <Typography paragraph>
              <strong>"What time is it?"</strong> - Check the current time<br />
              <strong>"Tell me about my health"</strong> - Get a summary of your health metrics<br />
              <strong>"What medications do I need to take?"</strong> - Check your medication schedule<br />
              <strong>"Start listening"</strong> - Turn on always listening mode<br />
              <strong>"Stop listening"</strong> - Turn off always listening mode
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Supported Languages
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {languages.map((lang) => (
              <Chip
                key={lang.code}
                icon={<TranslateIcon />}
                label={lang.name}
                variant={lang.code === selectedLanguage.code ? "filled" : "outlined"}
                color="primary"
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<MicIcon />}
            onClick={() => {
              setHelpOpen(false);
              setTimeout(() => activateAssistant(), 500);
            }}
          >
            Activate Assistant
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SiriLikeAssistant;
