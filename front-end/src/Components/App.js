import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import axios from 'axios';

import { useGlobalState } from '../Provider/GlobalStateProvider';
import SettingsWrapper from './SettingsWrapper';
import { GET_PROFILE } from '../Utils/apiEndpoints';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import '../Utils/Custom.css';


function AuthWrapper({ children }) {
  const { user } = useGlobalState();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const { user, setUser } = useGlobalState();
  const [isLoading, setIsLoading] = useState(true);
  const hasCheckedAuth = useRef(false);

  const checkAuth = useCallback(async () => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn !== 'true') {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(GET_PROFILE, null);
      if (response.data.authenticated) {
        setUser(response.data.user);
        localStorage.setItem('loggedIn', true);
      } else {
        localStorage.setItem('loggedIn', false);
        setUser(null);
      }  
    } catch (error) {
      // handle error
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    if (!user && !hasCheckedAuth.current) {
      checkAuth();
      hasCheckedAuth.current = true;
    }
  }, [checkAuth, user]);

  if (isLoading) {
    return <div></div>; // Add loading state
  }

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
