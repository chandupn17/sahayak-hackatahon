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
  ListItemIcon,
  Chip,
  Card,
  CardContent,
  IconButton,
  Divider,
  CircularProgress,
  Zoom,
} from '@mui/material';
import {
  Send as SendIcon,
  QuestionAnswer as QuestionIcon,
  Lightbulb as TipIcon,
  Computer as ComputerIcon,
  Smartphone as PhoneIcon,
  Videocam as VideoIcon,
  VolumeUp as SpeakIcon,
} from '@mui/icons-material';
import axios from 'axios';

const TechSupport = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [topics, setTopics] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const messagesEndRef = useRef(null);
  const synth = window.speechSynthesis;

  // Fetch available topics on component mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get('/api/tech-support/topics');
        setTopics(response.data);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      }
    };
    fetchTopics();
  }, []);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle topic selection
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    const welcomeMessage = {
      type: 'system',
      content: `Let's talk about ${topics[topic].title}. What would you like to know?`
    };
    setMessages([welcomeMessage]);
    setSuggestedQuestions([]);
  };

  // Handle message submission
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedTopic) return;

    const userMessage = {
      type: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/tech-support/chat', {
        message: inputMessage,
        topic: selectedTopic
      });

      const assistantMessage = {
        type: 'assistant',
        content: response.data.response
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSuggestedQuestions(response.data.suggestedQuestions);
    } catch (error) {
      console.error('Failed to get response:', error);
      const errorMessage = {
        type: 'error',
        content: 'Sorry, I couldn\'t process your question. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  // Handle suggested question click
  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
  };

  // Text-to-speech function
  const speakText = (text) => {
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower speech for better understanding
    synth.speak(utterance);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      {/* Topic Selection */}
      {!selectedTopic ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5" gutterBottom>
            What would you like to learn about?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Card
              onClick={() => handleTopicSelect('smartphone')}
              sx={{
                cursor: 'pointer',
                flex: 1,
                minWidth: 250,
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}
            >
              <CardContent>
                <PhoneIcon fontSize="large" color="primary" />
                <Typography variant="h6">Smartphone Basics</Typography>
                <Typography variant="body2" color="text.secondary">
                  Learn how to use your smartphone effectively
                </Typography>
              </CardContent>
            </Card>

            <Card
              onClick={() => handleTopicSelect('internet')}
              sx={{
                cursor: 'pointer',
                flex: 1,
                minWidth: 250,
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}
            >
              <CardContent>
                <ComputerIcon fontSize="large" color="primary" />
                <Typography variant="h6">Internet Basics</Typography>
                <Typography variant="body2" color="text.secondary">
                  Understand how to use the internet safely
                </Typography>
              </CardContent>
            </Card>

            <Card
              onClick={() => handleTopicSelect('videoCall')}
              sx={{
                cursor: 'pointer',
                flex: 1,
                minWidth: 250,
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}
            >
              <CardContent>
                <VideoIcon fontSize="large" color="primary" />
                <Typography variant="h6">Video Calling</Typography>
                <Typography variant="body2" color="text.secondary">
                  Learn how to make video calls to family
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      ) : (
        <>
          {/* Chat Interface */}
          <Paper 
            elevation={3}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'calc(100vh - 200px)',
              overflow: 'hidden'
            }}
          >
            {/* Messages Area */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <List>
                {messages.map((message, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                      gap: 1,
                      mb: 2
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                      {message.type === 'user' ? (
                        <Chip label="You" color="primary" />
                      ) : message.type === 'assistant' ? (
                        <Chip label="Helper" color="secondary" />
                      ) : (
                        <Chip label="System" />
                      )}
                    </ListItemIcon>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        bgcolor: message.type === 'user' ? 'primary.light' : 'background.paper'
                      }}
                    >
                      <ListItemText
                        primary={message.content}
                        sx={{ margin: 0 }}
                      />
                      {message.type === 'assistant' && (
                        <IconButton
                          size="small"
                          onClick={() => speakText(message.content)}
                          sx={{ mt: 1 }}
                        >
                          <SpeakIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Paper>
                  </ListItem>
                ))}
                <div ref={messagesEndRef} />
              </List>
            </Box>

            {/* Suggested Questions */}
            {suggestedQuestions.length > 0 && (
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>
                  You might want to ask:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {suggestedQuestions.map((question, index) => (
                    <Chip
                      key={index}
                      label={question}
                      onClick={() => handleSuggestedQuestion(question)}
                      icon={<QuestionIcon />}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Input Area */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your question here..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 28 } }}
                />
                <Zoom in={!isLoading}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    sx={{ borderRadius: 28, minWidth: 100 }}
                  >
                    {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                  </Button>
                </Zoom>
              </Box>
            </Box>
          </Paper>

          {/* Reset Topic Button */}
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedTopic(null);
              setMessages([]);
              setSuggestedQuestions([]);
            }}
            sx={{ alignSelf: 'flex-start' }}
          >
            Change Topic
          </Button>
        </>
      )}
    </Box>
  );
};

export default TechSupport;
