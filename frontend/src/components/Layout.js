import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Paper,
  Badge
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Home as HomeIcon,
  Church as ReligiousIcon,
  LocalHospital as WellnessIcon,
  Flight as BookingIcon,
  Phone as EmergencyIcon,
  Logout as LogoutIcon,
  AccountBalance as WalletIcon,
  CalendarMonth as CalendarIcon,
  Forum as CommunityIcon,
  AttachMoney as PricingIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Religious Companion', icon: <ReligiousIcon />, path: '/religious' },
    { text: 'Wellness', icon: <WellnessIcon />, path: '/wellness' },
    { text: 'Booking & Orders', icon: <BookingIcon />, path: '/booking' },
    { text: 'My Wallet', icon: <WalletIcon />, path: '/wallet' },
    { text: 'Activity Planner', icon: <CalendarIcon />, path: '/calendar' },
    { text: 'Emergency', icon: <EmergencyIcon />, path: '/emergency' },
    { text: 'Community', icon: <CommunityIcon />, path: '/community' },
    { text: 'Pricing Plans', icon: <PricingIcon />, path: '/pricing' },
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/sign-in');
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="static" 
        elevation={4}
        sx={{ 
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ 
              mr: 2,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              p: 1.2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 'bold',
                letterSpacing: 1,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              Sahayak
            </Typography>
            {!isMobile && (
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  ml: 1, 
                  opacity: 0.9,
                  fontStyle: 'italic'
                }}
              >
                Your AI Companion
              </Typography>
            )}
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Button 
            color="inherit" 
            onClick={handleSignOut}
            variant="outlined"
            startIcon={<LogoutIcon />}
            sx={{ 
              borderColor: 'rgba(255,255,255,0.5)', 
              px: 2,
              py: 1,
              borderRadius: 2,
              fontSize: '1rem',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
                borderColor: 'white'
              }
            }}
          >
            {isMobile ? '' : 'Logout'}
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
            borderRadius: '0 16px 16px 0',
            boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box
          sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          role="presentation"
        >
          <Paper
            elevation={0}
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              borderRadius: 0,
              color: 'white',
              mb: 1
            }}
          >
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                mb: 2,
                bgcolor: 'white',
                color: 'primary.main',
                fontSize: '2rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            >
              {user?.firstName?.charAt(0) || 'S'}
            </Avatar>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
              Sahayak
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Hello, {user?.firstName || 'User'}
            </Typography>
          </Paper>
          
          <Divider sx={{ mx: 2 }} />
          
          <List sx={{ flexGrow: 1, px: 1 }}>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => handleNavigation(item.path)}
                sx={{ 
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': {
                    bgcolor: 'primary.light',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main'
                    },
                    '& .MuiListItemText-primary': {
                      color: 'primary.main',
                      fontWeight: 'bold'
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'primary.main',
                  minWidth: 45
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '1.1rem',
                    fontWeight: item.text === 'Emergency' ? 'bold' : 'medium'
                  }}
                />
                {item.text === 'Emergency' && (
                  <Badge color="error" variant="dot" sx={{ ml: 1 }} />
                )}
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ mx: 2 }} />
          
          <List sx={{ px: 1, pb: 2 }}>
            <ListItem 
              button 
              onClick={handleSignOut} 
              sx={{ 
                py: 1.5,
                px: 2,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'error.light',
                  '& .MuiListItemIcon-root': {
                    color: 'error.main'
                  },
                  '& .MuiListItemText-primary': {
                    color: 'error.main',
                    fontWeight: 'bold'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ color: 'error.main', minWidth: 45 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{ 
                  fontSize: '1.1rem' 
                }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Container component="main" sx={{ flexGrow: 1, py: 2 }}>
        {children}
      </Container>

      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          bgcolor: '#f5f5f5', 
          textAlign: 'center',
          borderTop: '1px solid #e0e0e0',
          mt: 2
        }}
      >
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}
        >
          © {new Date().getFullYear()} Sahayak - AI Companion for Senior Citizens
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
