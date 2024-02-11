import React, { useState, useEffect, useMemo } from 'react';
import { getRequest, putRequest } from './Axios.js';
import { useGlobalState } from './GlobalStateProvider';

const ChatList = () => {
  const { user, setChatHeader, userConversation, setUserConversation } = useGlobalState();
  const [selectedChat, setSelectedChat] = useState(null);

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

  async function markAsRead(contact) {
    try {
      const response = await putRequest('/home/updateReadMessages', { userId: user._id, otherUserId: contact._id });
      if (response.status === 200) {
        setChatHeader(contact);
      }
    } catch (error) {
      console.error('Error updating read messages:', error);
    }
  };

  const conversationArray = useMemo(() => Array.from(userConversation.values()), [userConversation]);

  return (
    <div className="container-fluid chats" id="chats">
      {conversationArray.map((contact) => (
        <div key={contact._id}
          className={
            selectedChat === contact._id
              ? "p-2 justify-content-between align-items-center conversations bg-primary"
              : "p-2 justify-content-between align-items-center conversations"
          }
          onClick={() => {  
            setSelectedChat(contact._id); 
            if (contact.unreadCount) {
              markAsRead(contact);
            } else {
              setChatHeader(contact);
            }
          }} 
        >
          <img src={contact.image} alt="" className="avatar img-fluid" />
          <span className="">{contact.displayName}</span>
          {contact.unreadCount > 0 && <small className='bg-danger'> {contact.unreadCount}</small>}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
