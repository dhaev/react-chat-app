// filename: App.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useGlobalState } from './GlobalStateProvider';
import SettingsWrapper from './SettingsWrapper'

import './Custom.css';
import Register from './Register';
import Login from './Login';
import Home from './Home';

// Wrapper to check if user is authenticated
function AuthWrapper({ children }) {
  const { user } = useGlobalState();
  // If user is authenticated, render children, else navigate to login
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const { user, setUser } = useGlobalState();
  const [isLoading, setIsLoading] = useState(true);
  const hasCheckedAuth = useRef(false); // Add this line

  // Function to check if user is authenticated
  const checkAuth = useCallback(async () => {
    console.log("trying to login")
    const loggedIn = localStorage.getItem('loggedIn');
    console.log("loggedIn :"+ loggedIn)

    // If user is not logged in, stop loading and return
    if (loggedIn !== 'true') {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get('/home/getProfile', null);
      // If user is authenticated, set user and loggedIn status
      if (response.data.authenticated) {
        setUser(response.data.user);
        localStorage.setItem('loggedIn', true);
      } else {
        // If user is not authenticated, remove user and loggedIn status
        localStorage.setItem('loggedIn', false);
        setUser(null);
      }  
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  // Check if user is authenticated on component mount
  useEffect(() => {
    if (!user && !hasCheckedAuth.current) { // Update this line
      checkAuth();
      hasCheckedAuth.current = true; // Add this line
    }
  }, [checkAuth, user]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return <div></div>;
  }

  // Render routes after checking authentication
  return (
    <Router>
      <Routes>
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" replace />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" replace />} />
        <Route path="/home" element={<AuthWrapper><Home /></AuthWrapper>} />
        <Route path="/" element={<AuthWrapper><Home /></AuthWrapper>} />
        <Route path="/settings" element={<AuthWrapper><SettingsWrapper /></AuthWrapper>} />
      </Routes>
    </Router>
  );
}

export default App;