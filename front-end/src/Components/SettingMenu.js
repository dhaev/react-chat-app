import React from 'react';

import SettingHeader from './SettingHeader';
import SettingList from './SettingList';

function SettingMenu() {
  return (
    <div className="col-3 d-flex flex-column vh-100 border border-right">
      <SettingHeader />
      <SettingList/>
    </div>
  )
}

export default SettingMenu;
