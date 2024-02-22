export const ChatListItem = ({ contact, selectedChat, setSelectedChat, markAsRead }) => {
  const handleSelectChat = () => {
    if (contact?.unreadCount && contact?.unreadCount > 0) {
      markAsRead(contact);
    }
    setSelectedChat(contact);
  };

  return (
    <div
      key={contact._id}
      className={`p-2 justify-content-between align-items-center conversations mb-1 border-bottom list rounded conversations ${selectedChat?._id === contact._id ? "selected" : ""}`}
      onMouseDown={handleSelectChat}
    >
      <div className="d-flexjustify-content-between align-items-center w-100">
        <div className="d-flex align-items-center ">
          <img src={contact.image} alt="" className="avatar img-fluid mr-3 " />
          <span className="diplayName-middle">{contact.displayName}</span>
        </div>
        {contact.unreadCount > 0 && <small className='unread'> {contact.unreadCount}</small>}
      </div>
    </div>
  );
}
