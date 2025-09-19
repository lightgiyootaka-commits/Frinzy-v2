import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import Layout from './components/Layout';
import DiscoverScreen from './features/discover/DiscoverScreen';
import ProfileScreen from './features/profile/ProfileScreen';
import ChatScreen from './features/chat/ChatScreen';
import EventsScreen from './features/events/EventsScreen';
import LoginScreen from './features/auth/LoginScreen';
import SignUpScreen from './features/auth/SignUpScreen';
import CreateProfileScreen from './features/profile/CreateProfileScreen';
import ThisOrThatScreen from './features/vibe/ThisOrThatScreen';
import VibeStickersScreen from './features/vibe/VibeStickersScreen';
import FunLineScreen from './features/vibe/FunLineScreen';
import LikesScreen from './features/likes/LikesScreen';
import ChatLayout from './features/chat/ChatLayout';
import ChatPlaceholder from './features/chat/ChatPlaceholder';
import OnboardingLayout from './components/onboarding/OnboardingLayout';
import PersonalityQuizScreen from './features/profile/PersonalityQuizScreen';

// A wrapper component to handle protected routes
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // You can replace this with a nice loading spinner component
    return <div>Loading...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { theme } = useTheme();

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route element={
        <OnboardingProvider>
          <OnboardingLayout />
        </OnboardingProvider>
      }>
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/create-profile" element={<CreateProfileScreen />} />
        <Route path="/vibe/this-or-that" element={<ThisOrThatScreen />} />
        <Route path="/vibe/stickers" element={<VibeStickersScreen />} />
        <Route path="/vibe/fun-line" element={<FunLineScreen />} />
      </Route>
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/discover" />} />
        <Route path="discover" element={<DiscoverScreen />} />
        <Route path="likes" element={<LikesScreen />} />
        <Route path="profile" element={<ProfileScreen />} />
        <Route path="personality-quiz" element={<PersonalityQuizScreen />} />
        <Route path="chat" element={<ChatLayout />}>
          <Route index element={<ChatPlaceholder />} />
          <Route path=":matchId" element={<ChatScreen />} />
        </Route>
        <Route path="events" element={<EventsScreen />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
