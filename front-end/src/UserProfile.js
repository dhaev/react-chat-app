import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from './GlobalStateProvider';
import { getRequest } from './Axios.js';

function UserProfile() {
  const { user, setUser, setShowSettings } = useGlobalState();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error,setError]  = useState('');

  const handleLogout = async (e) =>  {
    e.stopPropagation();
    setLoggingOut(true);
  };

  useEffect(() => {
    if (loggingOut) {
      const logout = async () => {
        try {
          const response = await getRequest('/home/logout', null);
          if (response.status === 200) {
            localStorage.setItem('loggedIn', false);
            localStorage.removeItem('loggedIn');
            setUser(null)
            navigate('/login');
          }
        } catch (error) {
          setError('Error logging out');
        } finally {
          setLoggingOut(false);
        }
      };

      logout();
    }
  }, [loggingOut, navigate]);

  return (
    <div className="d-flex p-2 justify-content-between align-items-center profile">
      <img src={'http://192.168.2.19:5000/'+user.image} alt="" className="img-fluid avatar" />
      <div>
        <button className="btn" onMouseDown={handleLogout}>
        <i className="fa fa-sign-out"></i>
      </button>
      <button className="btn" onMouseDown={(e)=> {e.stopPropagation(); setShowSettings(true)}}>
      <i className="fa fa-solid fa-gear"></i>
      </button>
      </div>
    </div>
  );
}

export default UserProfile;
