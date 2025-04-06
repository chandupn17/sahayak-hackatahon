import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Avatar,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  LocalHospital as WellnessIcon,
  Flight as BookingIcon,
  Church as ReligiousIcon,
  Phone as EmergencyIcon,
  AccountBalance as WalletIcon,
  CalendarMonth as CalendarIcon,
  Forum as CommunityIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';

const modeCards = [
  {
    title: 'Community Hub',
    description: 'Connect with others, join chat rooms, and make video calls',
    icon: <CommunityIcon sx={{ fontSize: 40, color: 'white' }} />,
    path: '/community',
    color: '#9c27b0',
    gradient: 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
    features: [
      { icon: <ChatIcon sx={{ color: 'white' }} />, text: 'Chat Rooms' },
      { icon: <PeopleIcon sx={{ color: 'white' }} />, text: 'Video Calls' },
      { icon: <CommunityIcon sx={{ color: 'white' }} />, text: 'Support Groups' },
    ],
    isNew: true,
  },
  {
    title: 'Religious Companion',
    description: 'Engage in spiritual discussions and learn about religious practices',
    icon: <ReligiousIcon sx={{ fontSize: 40 }} />,
    path: '/religious',
    color: '#4caf50',
    gradient: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
  },
  {
    title: 'Wellness Mode',
    description: 'Track your health, medications, and get exercise guidance',
    icon: <WellnessIcon sx={{ fontSize: 60 }} />,
    path: '/wellness',
    color: '#2196f3',
    gradient: 'linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)',
  },
  {
    title: 'Booking & Orders',
    description: 'Easy travel booking and one-click ordering',
    icon: <BookingIcon sx={{ fontSize: 60 }} />,
    path: '/booking',
    color: '#ff9800',
    gradient: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
  },
  {
    title: 'My Wallet',
    description: 'Manage your funds and make secure payments',
    icon: <WalletIcon sx={{ fontSize: 60 }} />,
    path: '/wallet',
    color: '#9c27b0',
    gradient: 'linear-gradient(45deg, #9c27b0 30%, #ce93d8 90%)',
  },
  {
    title: 'Activity Planner',
    description: 'Plan your daily activities and set reminders',
    icon: <CalendarIcon sx={{ fontSize: 60 }} />,
    path: '/calendar',
    color: '#f44336',
    gradient: 'linear-gradient(45deg, #f44336 30%, #ef9a9a 90%)',
  },
];

const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = React.useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const upcomingActivities = [
    { id: 1, title: 'Doctor Appointment', time: '10:00 AM', type: 'medical' },
    { id: 2, title: 'Take Medication', time: '12:30 PM', type: 'medication' },
    { id: 3, title: 'Evening Walk', time: '5:00 PM', type: 'exercise' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'medical':
        return <WellnessIcon color="error" />;
      case 'medication':
        return <WellnessIcon color="warning" />;
      case 'exercise':
        return <WellnessIcon color="info" />;
      default:
        return <WellnessIcon color="primary" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome back, {user?.firstName || 'User'}!
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          How can we assist you today?
        </Typography>
      </Paper>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
              Services & Features
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {modeCards.map((mode) => (
              <Grid item xs={12} sm={6} md={4} key={mode.title}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: mode.gradient,
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    transform: hoveredCard === mode.title ? 'scale(1.05)' : 'scale(1)',
                    position: 'relative',
                    overflow: 'visible',
                    '&::before': mode.isNew ? {
                      content: '"New!"',
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      backgroundColor: '#ff4081',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      zIndex: 1,
                    } : {},
                  }}
                  onClick={() => navigate(mode.path)}
                  onMouseEnter={() => setHoveredCard(mode.title)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Box sx={{ p: 3, background: mode.gradient, color: 'white', textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        margin: '0 auto',
                      }}
                    >
                      {mode.icon}
                    </Avatar>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                      {mode.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: mode.features ? 2 : 0, color: 'rgba(255, 255, 255, 0.9)' }}>
                      {mode.description}
                    </Typography>
                    {mode.features && hoveredCard === mode.title && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, transition: 'opacity 0.3s', opacity: hoveredCard === mode.title ? 1 : 0 }}>
                        {mode.features.map((feature, index) => (
                          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                            {feature.icon}
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                              {feature.text}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#1976d2' }}>
                    Today's Activities
                  </Typography>
                  <Chip 
                    label={`${upcomingActivities.length} Activities`}
                    size="small"
                    sx={{ 
                      bgcolor: '#1976d2',
                      color: 'white',
                      '& .MuiChip-label': { fontWeight: 'medium' }
                    }}
                  />
                </Box>
                <List sx={{ py: 0 }}>
                  {upcomingActivities.length > 0 ? (
                    upcomingActivities.map((activity) => (
                      <ListItem
                        key={activity.id}
                        sx={{
                          px: 0,
                          py: 1,
                          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                          '&:last-child': { borderBottom: 'none' }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {getActivityIcon(activity.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.title}
                          secondary={activity.time}
                          primaryTypographyProps={{
                            variant: 'subtitle2',
                            sx: { fontWeight: 'medium', color: 'text.primary' }
                          }}
                          secondaryTypographyProps={{
                            variant: 'caption',
                            sx: { color: '#1976d2' }
                          }}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="No activities scheduled for today"
                        sx={{ textAlign: 'center', color: 'text.secondary' }}
                      />
                    </ListItem>
                  )}
                </List>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/calendar')}
                >
                  View Calendar
                </Button>
              </Paper>
            </Grid>
            <Grid item>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #f44336 30%, #ef9a9a 90%)',
                  color: 'white'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mr: 2 }}>
                    <EmergencyIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    Emergency Help
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                    color: 'white',
                    borderRadius: 2,
                  }}
                  onClick={() => navigate('/emergency')}
                >
                  Call Emergency Contact
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
