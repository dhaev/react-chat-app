import { useState } from 'react';
import { putRequest } from './Axios.js';
import { useGlobalState } from './GlobalStateProvider';

export const ChatListItem = ({ contact, selectedChat, setSelectedChat, markAsRead, setChatHeader }) => {
    const handleClick = () => {
      setSelectedChat(contact._id);
      if (contact?.unreadCount) {
        markAsRead(contact);
      } else {
        setChatHeader(contact);
      }
    };
  
    return (
  <div
    key={contact._id}
    className={`p-2 justify-content-between align-items-center conversations mb-1 border-bottom list rounded conversations ${selectedChat === contact._id ? "selected" : ""}`}
    onMouseDown={handleClick}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between',alignItems: 'center', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={contact.image} alt="" className="avatar img-fluid mr-3 " />
        <span className="diplayName-middle">{contact.displayName}</span>
      </div>
      {contact.unreadCount > 0 && <small className='unread'> {contact.unreadCount}</small>}
    </div>
  </div>
  
    );
  };

  export function useMarkAsRead() {
    const { setChatHeader } = useGlobalState();
    const [error,setError]  = useState('');
  
    const markAsRead = async (contact) => {
      try {
        const response = await putRequest('/home/updateReadMessages', { otherUserId: contact._id });
        if (response.status === 200) {
          setChatHeader(contact);
        }
      } catch (error) {
        setError('Error updating read messages');
      }
    };
  
    return markAsRead;
  };
  