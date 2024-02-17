// filename: App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getRequest } from './Axios';
import { useGlobalState } from './GlobalStateProvider';
import SettingsWrapper from './SettingsWrapper'

import './Custom.css';
import Register from './Register';
import Login from './Login';
import Home from './Home';


function AuthWrapper({ children }) {
  const { user} = useGlobalState();
  return user ? children : <Navigate to="/login" replace />;
}


function App() {
  const { user, setUser } = useGlobalState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      console.log("trying to login")
      const loggedIn = localStorage.getItem('loggedIn');
      console.log("loggedIn :"+ loggedIn)

      if (loggedIn !== 'true') {
        setIsLoading(false);
        return;
      }
      try {
        const response = await getRequest('/home/getProfile', null);
        if (response.data.authenticated) {
          setUser(response.data.user);
          localStorage.setItem('loggedIn', true);
          
        } else {
          localStorage.setItem('loggedIn', false);
          setUser(null);
        }  
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUser]);

  if (isLoading) {
    return <div></div>;
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
