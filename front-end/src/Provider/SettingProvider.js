import React, { createContext, useContext,useState } from 'react';
import UpdateProfile from '../Components/UpdateProfile';
import UpdatePassword from '../Components/UpdatePassword';

// Create a Context object
export const SettingContext = createContext();

// Hook to use the global state
export const useSetting = () => {
  const context = useContext(SettingContext);
  if (context === undefined) {
    throw new Error('useSetting must be used within a SettingProvider');
  }
  return context;
};

// Provider component
const SettingProvider = ({ children }) => {
    const settingsList = [
        { _id: '1', displayName: 'Update Profile', description: 'Update your profile information', component: <UpdateProfile /> },
        { _id: '2', displayName: 'Update Password', description: 'Change your password', component: <UpdatePassword /> },
        // Add more components as needed
      ];

    const [selectedSettings, setSelectedSettings] = useState(null);
    
  return (
    <SettingContext.Provider value={{ settingsList,selectedSettings, setSelectedSettings}}>
      {children}
    </SettingContext.Provider>
  );
};

export default SettingProvider;
