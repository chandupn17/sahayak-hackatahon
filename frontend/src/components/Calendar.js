import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Event as EventIcon,
  MedicalServices as MedicalIcon,
  Restaurant as MealIcon,
  DirectionsWalk as ExerciseIcon,
  Medication as MedicationIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Today as TodayIcon,
} from '@mui/icons-material';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('appointment');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [events, setEvents] = useState([
    {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      title: 'Doctor Appointment',
      type: 'medical',
      time: '10:00',
      description: 'Regular checkup with Dr. Smith'
    },
    {
      id: 2,
      date: new Date().toISOString().split('T')[0],
      title: 'Morning Walk',
      type: 'exercise',
      time: '07:00',
      description: '30 minutes walk in the park'
    },
    {
      id: 3,
      date: new Date().toISOString().split('T')[0],
      title: 'Take Medication',
      type: 'medication',
      time: '09:00',
      description: 'Blood pressure medicine'
    }
  ]);

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Navigate to previous month
  const handlePrevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    const newDate = new Date(currentDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  // Open event dialog
  const handleOpenEventDialog = () => {
    setOpenEventDialog(true);
  };

  // Close event dialog
  const handleCloseEventDialog = () => {
    setOpenEventDialog(false);
    setEventTitle('');
    setEventType('appointment');
    setEventTime('');
    setEventDescription('');
  };

  // Add new event
  const handleAddEvent = () => {
    if (!eventTitle || !eventTime) return;

    const newEvent = {
      id: Date.now(),
      date: selectedDate.toISOString().split('T')[0],
      title: eventTitle,
      type: eventType,
      time: eventTime,
      description: eventDescription
    };

    setEvents(prevEvents => [...prevEvents, newEvent]);
    handleCloseEventDialog();
  };

  // Delete event
  const handleDeleteEvent = (id) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
  };

  // Get events for selected date
  const getEventsForSelectedDate = () => {
    return events.filter(event => event.date === selectedDate.toISOString().split('T')[0])
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  // Get event count for a specific date
  const getEventCountForDate = (date) => {
    const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), date).toISOString().split('T')[0];
    return events.filter(event => event.date === dateString).length;
  };

  // Render calendar grid
  const renderCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<Box key={`empty-${i}`} sx={{ p: 2 }}></Box>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const eventCount = getEventCountForDate(day);
      
      days.push(
        <Box 
          key={day} 
          onClick={() => handleDateSelect(day)}
          sx={{
            p: 2.5, // Increased padding for better touchability
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: 2, // Increased border radius
            position: 'relative',
            backgroundColor: isSelected ? 'primary.main' : isToday ? 'primary.50' : 'white',
            color: isSelected ? 'white' : 'inherit',
            border: '1px solid', // Always show border for better visibility
            borderColor: isSelected ? 'primary.dark' : isToday ? 'primary.main' : 'divider',
            boxShadow: isSelected || isToday ? 2 : 0, // Add shadow to selected or today
            m: 0.5, // Add margin between days
            minHeight: '70px', // Ensure consistent height
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
              transform: 'scale(1.05)', // Slight zoom effect on hover
              boxShadow: 3
            }
          }}
        >
          <Typography 
            variant="h6" // Larger font size for better readability
            fontWeight={isToday || isSelected ? 'bold' : 'medium'}
            color={isSelected ? 'white' : isToday ? 'primary.dark' : 'text.primary'}
          >
            {day}
          </Typography>
          {eventCount > 0 && (
            <Chip 
              label={eventCount} 
              color="primary" 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: 5, 
                right: 5, 
                height: 24, // Larger chip
                minWidth: 24, 
                fontWeight: 'bold',
                fontSize: '0.85rem', // Larger font
                boxShadow: 1 // Add shadow for better visibility
              }} 
            />
          )}
        </Box>
      );
    }
    
    return days;
  };

  // Get icon for event type
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'medical':
        return <MedicalIcon />;
      case 'meal':
        return <MealIcon />;
      case 'exercise':
        return <ExerciseIcon />;
      case 'medication':
        return <MedicationIcon />;
      default:
        return <EventIcon />;
    }
  };

  // Get color for event type
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'medical':
        return 'error';
      case 'meal':
        return 'success';
      case 'exercise':
        return 'info';
      case 'medication':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        align="center" 
        sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          mb: 4 
        }}
      >
        Activity Planner
      </Typography>

      <Grid container spacing={4}>
        {/* Calendar Section */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              bgcolor: '#fafafa' // Light background for better contrast
            }}
          >
            {/* Calendar Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
              <IconButton 
                onClick={handlePrevMonth} 
                color="primary"
                sx={{ 
                  bgcolor: 'primary.light', 
                  p: 1.5, // Larger clickable area
                  '&:hover': { bgcolor: 'primary.main', color: 'white' }
                }}
              >
                <ChevronLeftIcon fontSize="large" />
              </IconButton>
              <Typography 
                variant="h5" 
                fontWeight="bold"
                sx={{ 
                  px: 3, 
                  py: 1, 
                  borderRadius: 2,
                  bgcolor: 'primary.light',
                  color: 'primary.dark'
                }}
              >
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Typography>
              <IconButton 
                onClick={handleNextMonth} 
                color="primary"
                sx={{ 
                  bgcolor: 'primary.light', 
                  p: 1.5, // Larger clickable area
                  '&:hover': { bgcolor: 'primary.main', color: 'white' }
                }}
              >
                <ChevronRightIcon fontSize="large" />
              </IconButton>
            </Box>

            {/* Calendar Days Header */}
            <Grid container columns={7} sx={{ mb: 2 }}>
              {dayNames.map(day => (
                <Grid item xs={1} key={day}>
                  <Typography 
                    variant="subtitle1" 
                    align="center" 
                    fontWeight="bold"
                    sx={{ 
                      fontSize: '1.2rem',
                      color: 'primary.dark',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'primary.50'
                    }}
                  >
                    {day}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            {/* Calendar Grid */}
            <Grid container columns={7}>
              {renderCalendarGrid()}
            </Grid>
          </Paper>
        </Grid>

        {/* Selected Day Events */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TodayIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenEventDialog}
              >
                Add
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Events List */}
            <List>
              {getEventsForSelectedDate().length > 0 ? (
                getEventsForSelectedDate().map(event => (
                  <ListItem
                    key={event.id}
                    sx={{
                      mb: 1,
                      backgroundColor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getEventTypeColor(event.type)}.main` }}>
                        {getEventTypeIcon(event.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {event.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {event.time}
                          </Typography>
                          {event.description && (
                            <Typography variant="body2" color="text.secondary" display="block">
                              {event.description}
                            </Typography>
                          )}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No activities planned for this day
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleOpenEventDialog}
                    sx={{ mt: 2 }}
                  >
                    Add Activity
                  </Button>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Event Dialog */}
      <Dialog 
        open={openEventDialog} 
        onClose={handleCloseEventDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'primary.main' }}>
          Add New Activity
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Activity Title"
              fullWidth
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                sx: { fontSize: '1.1rem', p: 0.5 } // Larger text input
              }}
              InputLabelProps={{
                sx: { fontSize: '1.1rem' } // Larger label
              }}
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel sx={{ fontSize: '1.1rem' }}>Activity Type</InputLabel>
              <Select
                value={eventType}
                label="Activity Type"
                onChange={(e) => setEventType(e.target.value)}
                sx={{ fontSize: '1.1rem' }} // Larger text
              >
                <MenuItem value="appointment" sx={{ fontSize: '1.1rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Appointment
                  </Box>
                </MenuItem>
                <MenuItem value="medical" sx={{ fontSize: '1.1rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MedicalIcon sx={{ mr: 1, color: 'error.main' }} />
                    Medical
                  </Box>
                </MenuItem>
                <MenuItem value="medication" sx={{ fontSize: '1.1rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MedicationIcon sx={{ mr: 1, color: 'warning.main' }} />
                    Medication
                  </Box>
                </MenuItem>
                <MenuItem value="exercise" sx={{ fontSize: '1.1rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ExerciseIcon sx={{ mr: 1, color: 'success.main' }} />
                    Exercise
                  </Box>
                </MenuItem>
                <MenuItem value="meal" sx={{ fontSize: '1.1rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MealIcon sx={{ mr: 1, color: 'info.main' }} />
                    Meal
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Time"
              type="time"
              fullWidth
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              InputLabelProps={{ 
                shrink: true,
                sx: { fontSize: '1.1rem' } // Larger label
              }}
              InputProps={{
                sx: { fontSize: '1.1rem', p: 0.5 } // Larger text input
              }}
              sx={{ mb: 3 }}
            />
            <TextField
              label="Description (Optional)"
              fullWidth
              multiline
              rows={3}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              InputProps={{
                sx: { fontSize: '1.1rem' } // Larger text input
              }}
              InputLabelProps={{
                sx: { fontSize: '1.1rem' } // Larger label
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseEventDialog}
            sx={{ 
              fontSize: '1rem',
              px: 3,
              py: 1
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddEvent}
            variant="contained"
            color="primary"
            disabled={!eventTitle || !eventTime}
            sx={{ 
              fontSize: '1rem',
              px: 3,
              py: 1,
              borderRadius: 2
            }}
          >
            Add Activity
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Calendar;
