import React, { useEffect, useMemo, useCallback } from 'react';
import { getRequest} from './Axios.js';
import { useGlobalState } from './GlobalStateProvider';
import { useMarkAsRead,ChatListItem } from './UserList'




// Then, in your list rendering code:



const ChatList = () => {
  const {userConversation, setUserConversation,selectedChat, setSelectedChat } = useGlobalState();

  const markAsRead = useMarkAsRead();
  const fetchData = useCallback(async () => {
    try {
      const response = await getRequest('/home/getAllConversations', null);
      const responseMap = new Map(response.data.user.map(i => [i._id, i]));
      setUserConversation(prevConversation => {return new Map([...prevConversation , ...responseMap])});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },[]);

  useEffect(() => {  
    fetchData();
  }, [fetchData]);


  const conversationArray = useMemo(() => Array.from(userConversation.values()), [userConversation]);

  return (
    <div className="container-fluid  chat-list chats" style={{ overflowY: 'auto', overflowX: 'hidden' }}  id="chats">
      {conversationArray.map((contact) => (
  <ChatListItem
    key={contact._id}
    contact={contact}
    selectedChat={selectedChat}
    setSelectedChat={setSelectedChat}
    markAsRead={markAsRead}
  />
))}
    </div>
  );
};

export default ChatList;
