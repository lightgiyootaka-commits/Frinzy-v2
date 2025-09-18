import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import DiscoverScreen from './features/discover/DiscoverScreen';
import ProfileScreen from './features/profile/ProfileScreen';
import ChatScreen from './features/chat/ChatScreen';
import EventsScreen from './features/events/EventsScreen';
import LoginScreen from './features/auth/LoginScreen';
import SignUpScreen from './features/auth/SignUpScreen';
import PersonalityQuizScreen from './features/profile/PersonalityQuizScreen';
import CreateProfileScreen from './features/profile/CreateProfileScreen';
import LikesScreen from './features/likes/LikesScreen';
import ChatLayout from './features/chat/ChatLayout';
import ChatPlaceholder from './features/chat/ChatPlaceholder';

// A wrapper component to handle protected routes
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
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
      <Route path="/signup" element={<SignUpScreen />} />
      <Route path="/create-profile" element={<CreateProfileScreen />} />
      <Route path="/quiz" element={<PersonalityQuizScreen />} />
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/discover" />} />
        <Route path="discover" element={<DiscoverScreen />} />
        <Route path="likes" element={<LikesScreen />} />
        <Route path="profile" element={<ProfileScreen />} />
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