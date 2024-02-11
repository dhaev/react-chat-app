// filename: App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getRequest } from './Axios';
import { useGlobalState } from './GlobalStateProvider';

import './Custom.css';
import Register from './Register';
import Login from './Login';
import Home from './Home';



function App() {
  const { user, setUser } = useGlobalState();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("trying to login")
      try {
        const response = await getRequest('/home/getProfile', null);
        if (response.data.authenticated) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={!user ? <Register /> : <Home />} />
        <Route path="/login" element={!user ? <Login /> : <Home />} />
        <Route path="/home" element={user ? <Home /> : <Login />} />
        <Route path="/" element={user ? <Home /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
