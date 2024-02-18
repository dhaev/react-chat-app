import React, { useState, useEffect,useCallback  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from './GlobalStateProvider';
import { getRequest } from './Axios.js';

function UserProfile() {
  const { user, setUser } = useGlobalState();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    try {
      // navigate('/login', { replace: true });
      const response = await getRequest('/home/logout', null);
      if (response.status === 200) {
        console.log(response);
        localStorage.removeItem('loggedIn');
        setUser(null);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } 
  }, []);

  useEffect(() => {
    if (loggingOut) {
      logout();      
    }
  }, [loggingOut,logout]);

  return (
    <div className="d-flex p-2 justify-content-between align-items-center profile" style={{ overflowY: 'hidden', overflowX: 'hidden' }}>
      <img src={`http://192.168.2.19:5000/${user.image}`} alt="" className="img-fluid avatar" />
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
