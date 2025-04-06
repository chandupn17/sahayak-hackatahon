import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Dashboard from './components/Dashboard';
import ReligiousMode from './components/modes/ReligiousMode';
import WellnessMode from './components/modes/WellnessMode';
import BookingMode from './components/modes/BookingMode';
import EmergencyContact from './components/EmergencyContact';
import Layout from './components/Layout';
import Wallet from './components/Wallet';
import Calendar from './components/Calendar';
import Community from './components/Community';
import HomeVoiceAssistant from './components/HomeVoiceAssistant';
import Pricing from './components/Pricing';

// Theme configuration
const theme = createTheme({
  typography: {
    fontSize: 16, // Larger base font size for better readability
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem' },
    h2: { fontSize: '2rem' },
    h3: { fontSize: '1.75rem' },
    button: { fontSize: '1.2rem' },
  },
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          borderRadius: '8px',
        },
      },
    },
  },
});

function App() {
  const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

  if (!clerkPubKey) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Error: Missing Clerk Publishable Key</h1>
        <p>Please set your REACT_APP_CLERK_PUBLISHABLE_KEY in the .env file</p>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route
              path="/sign-in/*"
              element={<SignIn routing="path" path="/sign-in" />}
            />
            <Route
              path="/sign-up/*"
              element={<SignUp routing="path" path="/sign-up" />}
            />
            <Route
              path="/*"
              element={
                <>
                  <SignedIn>
                    <Layout>
                      <HomeVoiceAssistant />
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/religious" element={<ReligiousMode />} />
                        <Route path="/wellness" element={<WellnessMode />} />
                        <Route path="/booking" element={<BookingMode />} />
                        <Route path="/emergency" element={<EmergencyContact />} />
                        <Route path="/wallet" element={<Wallet />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/pricing" element={<Pricing />} />
                      </Routes>
                    </Layout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
