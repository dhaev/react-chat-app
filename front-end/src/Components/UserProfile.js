// React related imports
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { getRequest } from '../Utils/Axios.js';
import { LOGOUT_USER } from '../Utils/apiEndpoints';
import { useGlobalState } from '../Provider/GlobalStateProvider';

function UserProfile() {
  const { user, setUser } = useGlobalState();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    try {
      const response = await getRequest(LOGOUT_USER, null);
      if (response.status === 200) {
        localStorage.removeItem('loggedIn');
        setUser(null);
      }
    } catch (error) {
      // handle error
    } 
  }, [setUser]);

  useEffect(() => {
    if (loggingOut) {
      logout();      
    }
  }, [loggingOut, logout]);

  return (
    <div className="d-flex p-2 justify-content-between align-items-center profile">
      <img src={user.image} alt="" className="img-fluid avatar" />
      <div className='d-flex justify-content-center align-items-center'>
        <button className="btn" onMouseDown={(e) => { e.stopPropagation(); setLoggingOut(true); }}>
          <i className="fa fa-sign-out"></i>
        </button>
        <button className="btn" onMouseDown={(e) => { e.stopPropagation(); navigate('/settings'); }}>
          <i className="fa fa-solid fa-gear"></i>
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
