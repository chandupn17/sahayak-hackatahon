import React, { useState, useEffect } from 'react';
import SiriLikeAssistant from '../SiriLikeAssistant';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Switch,
  FormControlLabel,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  LinearProgress,
  Avatar,
  Badge,
  Alert,
  Snackbar,
  Tooltip,
  CardMedia,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Favorite as HeartIcon,
  DirectionsRun as ExerciseIcon,
  LocalHospital as MedicineIcon,
  Notifications as NotificationIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Alarm as AlarmIcon,
  FitnessCenter as FitnessIcon,
  Restaurant as NutritionIcon,
  Opacity as WaterIcon,
  Spa as MeditationIcon,
  MonitorWeight as WeightIcon,
  Thermostat as TemperatureIcon,
  Phone as PhoneIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  Article as ArticleIcon,
  Lightbulb as TipIcon,
  Videocam as VideoIcon,
  InsertChart as ChartIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Visibility as ViewIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const WellnessMode = () => {
  // Tab management
  const [activeTab, setActiveTab] = useState(0);
  
  // Health metrics data
  const [healthData, setHealthData] = useState({
    heartRate: '72',
    bloodPressure: '120/80',
    oxygenLevel: '98',
    temperature: '98.6',
    weight: '68',
    sleep: '7.5',
    steps: '3,240',
    waterIntake: '5',
    glucose: '95',
  });
  
  // Health metrics history for charts
  const [healthHistory, setHealthHistory] = useState({
    heartRate: [
      { date: '04/01', value: 70 },
      { date: '04/02', value: 72 },
      { date: '04/03', value: 71 },
      { date: '04/04', value: 73 },
      { date: '04/05', value: 72 },
      { date: '04/06', value: 70 },
      { date: '04/07', value: 72 },
    ],
    bloodPressure: [
      { date: '04/01', systolic: 118, diastolic: 78 },
      { date: '04/02', systolic: 120, diastolic: 80 },
      { date: '04/03', systolic: 122, diastolic: 82 },
      { date: '04/04', systolic: 119, diastolic: 79 },
      { date: '04/05', systolic: 120, diastolic: 80 },
      { date: '04/06', systolic: 121, diastolic: 81 },
      { date: '04/07', systolic: 120, diastolic: 80 },
    ],
    weight: [
      { date: '04/01', value: 68.2 },
      { date: '04/02', value: 68.0 },
      { date: '04/03', value: 67.8 },
      { date: '04/04', value: 67.9 },
      { date: '04/05', value: 68.0 },
      { date: '04/06', value: 68.1 },
      { date: '04/07', value: 68.0 },
    ],
  });
  
  // Medication management
  const [medications, setMedications] = useState([
    { id: 1, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', time: '9:00 AM', taken: false, description: 'For blood pressure' },
    { id: 2, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', time: '9:00 AM, 7:00 PM', taken: false, description: 'For diabetes' },
    { id: 3, name: 'Simvastatin', dosage: '20mg', frequency: 'Once daily', time: '8:00 PM', taken: false, description: 'For cholesterol' },
    { id: 4, name: 'Vitamin D', dosage: '1000 IU', frequency: 'Once daily', time: '9:00 AM', taken: false, description: 'Supplement' },
  ]);
  
  // Appointments management
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: 'Dr. Sharma', specialty: 'Cardiologist', date: '2025-04-15', time: '10:30 AM', location: 'City Hospital', notes: 'Annual heart checkup' },
    { id: 2, doctor: 'Dr. Patel', specialty: 'Ophthalmologist', date: '2025-04-22', time: '2:00 PM', location: 'Vision Care Center', notes: 'Eye pressure test' },
  ]);
  
  // Exercise routines
  const [exercises, setExercises] = useState([
    { id: 1, name: 'Chair Yoga', duration: '15 min', difficulty: 'Easy', videoId: 'KEhNMcX_dQo', description: 'Gentle stretching exercises you can do while seated', completed: false, scheduledFor: 'Morning' },
    { id: 2, name: 'Balance Training', duration: '10 min', difficulty: 'Moderate', videoId: 'z-tUHuNPd1s', description: 'Exercises to improve stability and prevent falls', completed: false, scheduledFor: 'Afternoon' },
    { id: 3, name: 'Hand Strengthening', duration: '5 min', difficulty: 'Easy', videoId: 'tMA5nhl0QZw', description: 'Simple exercises to maintain hand strength and dexterity', completed: false, scheduledFor: 'Evening' },
  ]);
  
  // Health tips and articles
  const [healthTips, setHealthTips] = useState([
    { id: 1, title: 'Staying Hydrated', content: 'Drink at least 8 glasses of water daily, more in hot weather. Set reminders throughout the day.', category: 'Nutrition', saved: false },
    { id: 2, title: 'Managing Medication', content: 'Use pill organizers and set alarms to remember your medication schedule.', category: 'Medication', saved: true },
    { id: 3, title: 'Better Sleep', content: 'Maintain a regular sleep schedule. Avoid caffeine and electronics before bedtime.', category: 'Sleep', saved: false },
    { id: 4, title: 'Fall Prevention', content: 'Remove tripping hazards at home. Use night lights and install grab bars in bathrooms.', category: 'Safety', saved: false },
  ]);
  
  // Emergency contacts
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'Rahul (Son)', phone: '+91 98765 43210', relationship: 'Son', priority: 1 },
    { id: 2, name: 'Dr. Sharma', phone: '+91 87654 32109', relationship: 'Cardiologist', priority: 2 },
    { id: 3, name: 'Neighbor - Mrs. Gupta', phone: '+91 76543 21098', relationship: 'Neighbor', priority: 3 },
  ]);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [dialogData, setDialogData] = useState({});
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Selected item for viewing details
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Daily activities
  const activities = [
    {
      title: 'Morning Yoga',
      time: '7:00 AM',
      description: 'Gentle stretching and breathing exercises',
      icon: <ExerciseIcon />,
    },
    {
      title: 'Medicine Reminder',
      time: '9:00 AM',
      description: 'Blood pressure medication',
      icon: <MedicineIcon />,
    },
    {
      title: 'Evening Walk',
      time: '5:00 PM',
      description: '20 minutes of light walking',
      icon: <ExerciseIcon />,
    },
  ];

  // Event handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleMedicationToggle = (id) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    ));
    setSnackbar({ 
      open: true, 
      message: 'Medication status updated', 
      severity: 'success' 
    });
  };
  
  const handleExerciseComplete = (id) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    ));
    setSnackbar({ 
      open: true, 
      message: 'Exercise status updated', 
      severity: 'success' 
    });
  };
  
  const handleSaveTip = (id) => {
    setHealthTips(healthTips.map(tip => 
      tip.id === id ? { ...tip, saved: !tip.saved } : tip
    ));
  };
  
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  const handleOpenDialog = (type, data = {}) => {
    setDialogType(type);
    setDialogData(data);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogData({});
  };
  
  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
        Wellness Mode
      </Typography>
      
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          mb: 4,
          '& .MuiTab-root': { fontSize: '1.1rem', py: 2 }
        }}
      >
        <Tab icon={<HeartIcon />} label="Health Dashboard" iconPosition="start" />
        <Tab icon={<MedicineIcon />} label="Medications" iconPosition="start" />
        <Tab icon={<ExerciseIcon />} label="Exercise" iconPosition="start" />
        <Tab icon={<CalendarIcon />} label="Appointments" iconPosition="start" />
        <Tab icon={<TipIcon />} label="Health Tips" iconPosition="start" />
        <Tab icon={<PhoneIcon />} label="Emergency Contacts" iconPosition="start" />
      </Tabs>

      {/* Health Dashboard Tab */}
      {activeTab === 0 && (
        <Grid container spacing={4}>
        {/* Health Metrics */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="medium">
                Health Metrics
              </Typography>
              <Chip 
                label="Last updated: Today, 8:30 AM" 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ bgcolor: '#f8f0f0', mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                        <HeartIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Heart Rate
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {healthData.heartRate} BPM
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card sx={{ bgcolor: '#f0f0f8', mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <MedicineIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Blood Pressure
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {healthData.bloodPressure} mmHg
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card sx={{ bgcolor: '#f0f8f0' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                        <ExerciseIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Oxygen Level
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {healthData.oxygenLevel}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card sx={{ bgcolor: '#f8f8f0' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                        <TemperatureIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Temperature
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {healthData.temperature}°F
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }}
              startIcon={<ChartIcon />}
            >
              View Detailed Health Reports
            </Button>
          </Paper>
        </Grid>

        {/* Health Trends & Activities */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="medium">
                Heart Rate Trend
              </Typography>
              <Button size="small" startIcon={<ViewIcon />}>
                View All
              </Button>
            </Box>
            
            <Box sx={{ height: 200, mb: 4 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthHistory.heartRate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="value" stroke="#e53935" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom fontWeight="medium" sx={{ mt: 3 }}>
              Today's Activities
            </Typography>
            
            <List>
              {activities.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    sx={{ 
                      bgcolor: 'background.paper', 
                      borderRadius: 2, 
                      mb: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: index === 0 ? 'info.light' : index === 1 ? 'warning.light' : 'success.light' }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {activity.title}
                        </Typography>
                      } 
                      secondary={
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <TimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem', color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {activity.description}
                          </Typography>
                        </>
                      } 
                    />
                    <Chip 
                      label="Upcoming" 
                      size="small" 
                      color={index === 0 ? 'info' : index === 1 ? 'warning' : 'success'} 
                      variant="outlined" 
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Quick Actions
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  startIcon={<HeartIcon />}
                  sx={{ py: 2, height: '100%' }}
                  onClick={() => handleTabChange(null, 0)}
                >
                  Health Metrics
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth 
                  startIcon={<MedicineIcon />}
                  sx={{ py: 2, height: '100%' }}
                  onClick={() => handleTabChange(null, 1)}
                >
                  Medications
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="contained" 
                  color="success" 
                  fullWidth 
                  startIcon={<ExerciseIcon />}
                  sx={{ py: 2, height: '100%' }}
                  onClick={() => handleTabChange(null, 2)}
                >
                  Exercise
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="contained" 
                  color="error" 
                  fullWidth 
                  startIcon={<PhoneIcon />}
                  sx={{ py: 2, height: '100%' }}
                  onClick={() => handleTabChange(null, 5)}
                >
                  Emergency
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      )}
      
      {/* Medications Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="medium">
                  Medication Tracker
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('medication')}
                >
                  Add Medication
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {medications.map((med) => (
                  <Grid item xs={12} sm={6} md={4} key={med.id}>
                    <Card 
                      sx={{ 
                        borderLeft: '4px solid', 
                        borderColor: med.taken ? 'success.main' : 'warning.main',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {med.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Dosage:</strong> {med.dosage}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Time:</strong> {med.time}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Instructions:</strong> {med.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={med.taken} 
                              onChange={() => handleMedicationToggle(med.id)} 
                              color="success" 
                            />
                          }
                          label={med.taken ? "Taken" : "Mark as taken"}
                        />
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Exercise Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="medium">
                  Exercise Routines
                </Typography>
                <Box>
                  <Chip 
                    icon={<FitnessIcon />} 
                    label="Senior-friendly exercises" 
                    color="primary" 
                    variant="outlined" 
                    sx={{ mr: 1 }}
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('exercise')}
                  >
                    Add Exercise
                  </Button>
                </Box>
              </Box>
              
              {selectedItem && selectedItem.videoId ? (
                <Box sx={{ mb: 4 }}>
                  <Button 
                    startIcon={<BackIcon />} 
                    onClick={() => setSelectedItem(null)}
                    sx={{ mb: 2 }}
                  >
                    Back to Exercises
                  </Button>
                  
                  <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${selectedItem.videoId}`}
                        title={selectedItem.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0 }}
                      />
                    </Box>
                    
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h5" gutterBottom fontWeight="medium">
                        {selectedItem.name}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip icon={<TimeIcon />} label={`Duration: ${selectedItem.duration}`} size="small" />
                        <Chip 
                          icon={<FitnessIcon />} 
                          label={`Difficulty: ${selectedItem.difficulty}`} 
                          size="small" 
                          color={selectedItem.difficulty === 'Easy' ? 'success' : selectedItem.difficulty === 'Moderate' ? 'warning' : 'error'}
                        />
                      </Box>
                      <Typography variant="body1">
                        {selectedItem.description}
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="success" 
                        startIcon={selectedItem.completed ? <CheckIcon /> : <PlayIcon />}
                        sx={{ mt: 3 }}
                        onClick={() => handleExerciseComplete(selectedItem.id)}
                      >
                        {selectedItem.completed ? 'Completed' : 'Mark as Completed'}
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {exercises.map((exercise) => (
                    <Grid item xs={12} sm={6} md={4} key={exercise.id}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 4
                          },
                          bgcolor: exercise.completed ? 'success.50' : 'background.paper',
                          border: exercise.completed ? '1px solid' : 'none',
                          borderColor: 'success.light'
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={`https://img.youtube.com/vi/${exercise.videoId}/mqdefault.jpg`}
                          alt={exercise.name}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {exercise.name}
                            {exercise.completed && (
                              <CheckIcon color="success" fontSize="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Duration:</strong> {exercise.duration}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Difficulty:</strong> {exercise.difficulty}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {exercise.description}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            startIcon={<VideoIcon />}
                            onClick={() => handleSelectItem(exercise)}
                          >
                            Watch Video
                          </Button>
                          <Box sx={{ flexGrow: 1 }} />
                          <IconButton 
                            size="small" 
                            color={exercise.completed ? "success" : "default"}
                            onClick={() => handleExerciseComplete(exercise.id)}
                          >
                            <CheckIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Emergency Contacts Tab */}
      {activeTab === 5 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="medium" color="error.main">
                  Emergency Contacts
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('contact')}
                >
                  Add Contact
                </Button>
              </Box>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1">
                  In case of emergency, tap on the call button next to any contact to quickly reach them.
                </Typography>
              </Alert>
              
              <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                {emergencyContacts.map((contact, index) => (
                  <React.Fragment key={contact.id}>
                    <ListItem 
                      sx={{ 
                        py: 2,
                        px: 3,
                        bgcolor: index === 0 ? 'error.50' : 'background.paper'
                      }}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: index === 0 ? 'error.main' : 'primary.main' }}>
                          {contact.name.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: index === 0 ? 'bold' : 'medium' }}>
                            {contact.name}
                            {index === 0 && (
                              <Chip size="small" label="Primary" color="error" sx={{ ml: 1, height: 20 }} />
                            )}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>
                              {contact.phone}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {contact.relationship}
                            </Typography>
                          </>
                        }
                      />
                      <Button
                        variant="contained"
                        color={index === 0 ? "error" : "primary"}
                        startIcon={<PhoneIcon />}
                        sx={{ 
                          borderRadius: 8,
                          px: 3,
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 'bold'
                        }}
                      >
                        Call
                      </Button>
                    </ListItem>
                    {index < emergencyContacts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button 
                  variant="contained" 
                  color="error" 
                  size="large"
                  startIcon={<PhoneIcon />}
                  sx={{ 
                    px: 4, 
                    py: 1.5, 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold',
                    borderRadius: 8
                  }}
                >
                  Call Emergency Services (112)
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {/* Dialog for adding/editing items */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {dialogType === 'medication' && 'Add Medication'}
          {dialogType === 'exercise' && 'Add Exercise'}
          {dialogType === 'contact' && 'Add Emergency Contact'}
        </DialogTitle>
        <DialogContent>
          {/* Dialog content would go here based on dialogType */}
          <Typography variant="body1" sx={{ mt: 2, mb: 2, color: 'text.secondary' }}>
            This dialog would contain a form for adding or editing {dialogType === 'medication' ? 'medications' : dialogType === 'exercise' ? 'exercises' : 'emergency contacts'}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCloseDialog}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Siri-like AI Voice Assistant powered by Gemini */}
      <SiriLikeAssistant 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
    </Container>
  );
};

export default WellnessMode;
