import React from 'react';
import { useGlobalState } from './GlobalStateProvider';
import { getRequest } from './Axios.js';

function UserProfile() {
  const { user, setUser } = useGlobalState();

  const handleLogout = async (e) =>  {
    e.stopPropagation();
    setUser(null);
    try{
      const response = await getRequest('/home/logout', null);
      if(response.status === 200){
        
        console.log("Logout successful");
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  } 

  return (
    <div className="d-flex p-2 justify-content-between align-items-center profile">
      <img src={user.image} alt="" className="img-fluid avatar" />
      <button className="btn" onMouseDown={handleLogout}>
        <i className="fa fa-sign-out"></i>
      </button>
    </div>
  );
}

export default UserProfile;
