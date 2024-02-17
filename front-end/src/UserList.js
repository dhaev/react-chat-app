import { putRequest } from './Axios.js';
import { useGlobalState } from './GlobalStateProvider';

export const ChatListItem = ({ contact, selectedChat, setSelectedChat, markAsRead }) => {
    const handleClick = () => {

      if (contact?.unreadCount) {
        markAsRead(contact);
      }
      setSelectedChat(contact);
 
    };
  
    return (
  <div
    key={contact._id}
    className={`p-2 justify-content-between align-items-center conversations mb-1 border-bottom list rounded conversations ${selectedChat?._id === contact._id ? "selected" : ""}`}
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
    const { setUserConversation,userConversation } = useGlobalState();
  
    const markAsRead = async (contact) => {
      try {
        const response = await putRequest('/home/updateReadMessages', { otherUserId: contact._id });
        if (response.status === 200) {
          const updatedUserConversation = new Map(userConversation);
          const targetValue = updatedUserConversation.get(contact._id);
          targetValue.unreadCount = 0;
          updatedUserConversation.set(contact._id, targetValue);
          setUserConversation(updatedUserConversation);
        }
      } catch (error) {
        console.error('Error updating read messages:', error);
      }
    };
  
    return markAsRead;
  };
  