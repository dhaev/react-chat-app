import React, { useEffect } from 'react';
import { getRequest } from '../Utils/Axios.js';
import { useMarkAsRead} from '../Hook/useMarkAsRead';
import { useGlobalState } from '../Provider/GlobalStateProvider';
import { GET_CONVERSATIONS  } from '../Utils/apiEndpoints';
import { ChatListItem } from './UserList.js';

const ChatList = () => {
  const { userConversation, setUserConversation, selectedChat, setSelectedChat } = useGlobalState();
  const markAsRead = useMarkAsRead();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest(GET_CONVERSATIONS, null);
        const responseMap = new Map(response.data?.user.map(i => [i._id, i]));
        setUserConversation(new Map(responseMap));
      } catch (error) {
        // handle error
      }
    };

    fetchData();
  }, [setUserConversation]);

  return (
    <div className="container-fluid chat-list chats "  id="chats">
      {[...userConversation.entries()].map(([key, contact]) => (
        <ChatListItem
          key={key}
          contact={contact}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          markAsRead={markAsRead}
        />
      ))}
    </div>
  );
};

export default React.memo(ChatList);
