import React, { createContext, useState, useContext } from 'react';

// Create a Context object
export const GlobalStateContext = createContext();

// Hook to use the global state
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

// Provider component
const GlobalStateProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chatMessage, setChatMessage] = useState(new Map());
  const [userConversation, setUserConversation] = useState(new Map());
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <GlobalStateContext.Provider value={{ user, setUser,
     chatMessage, setChatMessage, userConversation, setUserConversation,
     selectedChat, setSelectedChat,
      }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
