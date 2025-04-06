import React, { useState, useEffect, useRef } from 'react';
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
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  Mic as MicIcon,
  Stop as StopIcon,
  VolumeUp as SpeakIcon,
  Settings as SettingsIcon,
  Translate as TranslateIcon,
  Help as HelpIcon,
  Close as CloseIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import axios from 'axios';

const GeminiVoiceAssistant = ({ activeTab, setActiveTab }) => {
  // State for voice assistant
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  
  // State for language selection
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState({ code: 'en', name: 'English', voice: 'en-IN' });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  
  // Speech recognition and synthesis
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;
  
  // Context for Gemini API
  const contextRef = useRef({
    activeTab,
    userPreferences: {
      language: 'English',
      voiceSpeed: 0.9
    }
  });
  
  // Fetch supported languages on component mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('/api/ai-assistant/languages');
        setLanguages(response.data);
      } catch (err) {
        console.error('Error fetching languages:', err);
        setError('Failed to load supported languages');
        setShowError(true);
      }
    };
    
    fetchLanguages();
    
    // Clean up on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synth) {
        synth.cancel();
      }
    };
  }, []);
  
  // Update context when activeTab changes
  useEffect(() => {
    contextRef.current = {
      ...contextRef.current,
      activeTab
    };
  }, [activeTab]);
  
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
    recognitionRef.current.interimResults = false;
    
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };
    
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      processQuery(transcript);
    };
    
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setError(`Speech recognition error: ${event.error}`);
      setShowError(true);
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current.start();
  };
  
  // Stop speech recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };
  
  // Process query with Gemini API
  const processQuery = async (query) => {
    setLoading(true);
    
    try {
      const response = await axios.post('/api/ai-assistant/query', {
        query,
        languageCode: selectedLanguage.code,
        context: JSON.stringify(contextRef.current)
      });
      
      setResponse(response.data.response);
      speakResponse(response.data.response);
    } catch (err) {
      console.error('Error processing query:', err);
      setError('Failed to process your request');
      setShowError(true);
    } finally {
      setLoading(false);
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
      contextRef.current = {
        ...contextRef.current,
        userPreferences: {
          ...contextRef.current.userPreferences,
          language: selected.name
        }
      };
    }
  };
  
  // Example commands based on the current tab
  const getExampleCommands = () => {
    const commonCommands = [
      { command: `Tell me about my health in ${selectedLanguage.name}`, description: 'Get health information' },
      { command: 'What medications do I need to take today?', description: 'Check medications' },
      { command: 'Schedule a doctor appointment', description: 'Manage appointments' }
    ];
    
    switch (activeTab) {
      case 0: // Health Dashboard
        return [
          ...commonCommands,
          { command: 'What is my heart rate?', description: 'Check vital signs' },
          { command: 'How is my blood pressure today?', description: 'Check blood pressure' }
        ];
      case 1: // Medications
        return [
          ...commonCommands,
          { command: 'When should I take my blood pressure medicine?', description: 'Medication timing' },
          { command: 'Have I taken all my medications today?', description: 'Medication status' }
        ];
      case 2: // Exercise
        return [
          ...commonCommands,
          { command: 'Suggest some easy exercises for me', description: 'Exercise recommendations' },
          { command: 'How many steps did I walk today?', description: 'Activity tracking' }
        ];
      default:
        return commonCommands;
    }
  };
  
  return (
    <>
      {/* Main Voice Assistant UI */}
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          borderRadius: 4,
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          zIndex: 1000,
          bgcolor: isListening ? 'primary.light' : 'background.paper',
          transition: 'all 0.3s ease',
          boxShadow: 3
        }}
      >
        <Tooltip title={isListening ? "Stop listening" : "Start voice assistant"}>
          <IconButton
            color={isListening ? "secondary" : "primary"}
            onClick={isListening ? stopListening : startListening}
            sx={{
              bgcolor: isListening ? 'error.main' : 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: isListening ? 'error.dark' : 'primary.dark',
              },
              position: 'relative',
              width: 48,
              height: 48
            }}
          >
            {isListening ? <StopIcon /> : <MicIcon />}
            {isListening && (
              <CircularProgress
                size={56}
                sx={{
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  zIndex: -1,
                  color: 'error.light'
                }}
              />
            )}
          </IconButton>
        </Tooltip>
        
        <Tooltip title={isSpeaking ? "Stop speaking" : "Speak last response"}>
          <IconButton
            color={isSpeaking ? "secondary" : "primary"}
            onClick={isSpeaking ? stopSpeaking : () => response && speakResponse(response)}
            disabled={!response && !isSpeaking}
            sx={{
              bgcolor: isSpeaking ? 'secondary.main' : 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: isSpeaking ? 'secondary.dark' : 'primary.dark',
              },
              '&.Mui-disabled': {
                bgcolor: 'grey.400',
                color: 'grey.100'
              }
            }}
          >
            <SpeakIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Language Settings">
          <IconButton
            color="primary"
            onClick={() => setSettingsOpen(true)}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            <LanguageIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Help">
          <IconButton
            color="primary"
            onClick={() => setHelpOpen(true)}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            <HelpIcon />
          </IconButton>
        </Tooltip>
        
        {/* Language indicator */}
        <Chip 
          icon={<TranslateIcon />} 
          label={selectedLanguage.name} 
          color="primary" 
          variant="outlined"
          sx={{ 
            bgcolor: 'white',
            border: '1px solid',
            borderColor: 'primary.main'
          }}
        />
      </Paper>
      
      {/* Language Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Language Settings
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
          <Box sx={{ mb: 3, mt: 1 }}>
            <FormControl fullWidth>
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
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Test Voice in {selectedLanguage.name}
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<SpeakIcon />}
            onClick={() => {
              const testPhrases = {
                en: "Hello, I am your voice assistant. How can I help you today?",
                hi: "नमस्ते, मैं आपका वॉयस असिस्टेंट हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
                bn: "হ্যালো, আমি আপনার ভয়েস অ্যাসিস্ট্যান্ট। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
                te: "హలో, నేను మీ వాయిస్ అసిస్టెంట్. నేను ఈరోజు మీకు ఎలా సహాయం చేయగలను?",
                ta: "வணக்கம், நான் உங்கள் குரல் உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
                mr: "नमस्कार, मी तुमचा व्हॉइस असिस्टंट आहे. आज मी तुम्हाला कशी मदत करू शकतो?",
                gu: "હેલો, હું તમારો વૉઇસ આસિસ્ટન્ટ છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?",
                kn: "ಹಲೋ, ನಾನು ನಿಮ್ಮ ಧ್ವನಿ ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
                ml: "ഹലോ, ഞാൻ നിങ്ങളുടെ വോയ്സ് അസിസ്റ്റന്റ് ആണ്. ഇന്ന് എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാൻ കഴിയും?",
                pa: "ਹੈਲੋ, ਮੈਂ ਤੁਹਾਡਾ ਵੌਇਸ ਅਸਿਸਟੈਂਟ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
                or: "ନମସ୍କାର, ମୁଁ ଆପଣଙ୍କର ଭଏସ୍ ଆସିଷ୍ଟାଣ୍ଟ। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
                as: "হেল', মই আপোনাৰ ভইচ এচিষ্টেণ্ট। আজি মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?"
              };
              
              const phrase = testPhrases[selectedLanguage.code] || testPhrases.en;
              speakResponse(phrase);
            }}
          >
            Test Voice
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
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
          Multilingual Voice Assistant Help
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
            This voice assistant supports multiple Indian languages and uses the Gemini AI to provide intelligent responses.
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Voice Commands
            </Typography>
            
            <List>
              {getExampleCommands().map((cmd, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <MicIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={cmd.command}
                    secondary={cmd.description}
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
              ))}
            </List>
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
          
          <Typography variant="body2" color="text.secondary">
            You can change the language in the settings. The voice assistant will understand and respond in your selected language.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<MicIcon />}
            onClick={() => {
              setHelpOpen(false);
              setTimeout(() => startListening(), 500);
            }}
          >
            Start Voice Assistant
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

export default GeminiVoiceAssistant;
