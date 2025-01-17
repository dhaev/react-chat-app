import React from 'react';
import { useSetting } from '../Provider/SettingProvider';

function SettingContentHeader({components}) {  
  const {  selectedSettings, setSelectedSettings } = useSetting();
  
  const handleCloseSettingContent = (event) => {
    event.preventDefault();
    setSelectedSettings(null);
  };
  
  return (
    <div className="d-flex p-2 justify-content-between align-items-center profile">
      <h6> {components.find(component => component._id === selectedSettings)?.displayName}</h6>
      <button type="button" className="btn" onMouseDown={handleCloseSettingContent} aria-label="Close page">
        <i className="fa fa-times"></i>
      </button>
    </div>
  );
}

function SettingContent() {
  const { settingsList, selectedSettings } = useSetting();

  return (
    <div className="col-9 d-flex flex-column justify-content-centeralign-items-center  vh-100 position-relative">
      {selectedSettings && <SettingContentHeader components={settingsList}/>}
      {settingsList.find(component => component._id === selectedSettings)?.component}
    </div>
  );
}

export default SettingContent;
