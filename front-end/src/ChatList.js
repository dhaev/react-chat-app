import React, { useState, useEffect, useMemo } from 'react';
import { getRequest} from './Axios.js';
import { useGlobalState } from './GlobalStateProvider';
import { useMarkAsRead,ChatListItem } from './UserList'




// Then, in your list rendering code:



const ChatList = () => {
  const { user, setChatHeader, userConversation, setUserConversation,selectedChat, setSelectedChat } = useGlobalState();

  const markAsRead = useMarkAsRead(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest('/home/getAllConversations', { userId: user._id });
        const responseMap = new Map(response.data.user.map(i => [i._id, i]));
        setUserConversation(new Map([...userConversation, ...responseMap]));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [user, setUserConversation]);


  const conversationArray = useMemo(() => Array.from(userConversation.values()), [userConversation]);

  return (
    <div className="container-fluid chats overflow-auto" id="chats">
      {conversationArray.map((contact) => (
  <ChatListItem
    key={contact._id}
    contact={contact}
    selectedChat={selectedChat}
    setSelectedChat={setSelectedChat}
    markAsRead={markAsRead}
    setChatHeader={setChatHeader}
  />
))}
    </div>
  );
};

export default ChatList;
