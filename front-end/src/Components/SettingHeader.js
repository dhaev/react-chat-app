import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../Provider/GlobalStateProvider';
import { useSetting } from '../Provider/SettingProvider';

function SettingHeader() {  
    const { user } = useGlobalState();
    const { setSelectedSettings } = useSetting();
    const navigate = useNavigate();
  
    const handleCloseSetting = () => {
      navigate('/home');
      setSelectedSettings(null);
    }
    
    return (
      <div className="d-flex p-2 justify-content-between align-items-center profile">
        <img src={user.image} alt="" className="img-fluid avatar" />
        <h6> Settings </h6>
        <button className="btn" onMouseDown={handleCloseSetting}>
          <i className="fa fa-home"></i>
        </button>
      </div>
    );
}

export default SettingHeader;