
import React, { useState } from 'react';
import { deleteRequest } from '../Utils/Axios';
import { DELETE_CONVERSATION } from '../Utils/apiEndpoints';
import { useGlobalState } from '../Provider/GlobalStateProvider';

function ChatHeader() {
  const { selectedChat, setSelectedChat, setChatMessage } = useGlobalState();
  const [error, setError] = useState(null);

  async function handleDeleteConversation(event) {
    event.preventDefault();
    try {
      const response = await deleteRequest(DELETE_CONVERSATION, { otherUserId: selectedChat?._id });
      if(response.status === 200){
        setChatMessage(new Map());
      }
    } catch (error) {
      setError("Failed to delete");
    }
  };

  async function handleCloseChat(event) {
    event.preventDefault();
    setSelectedChat(null);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="d-flex p-2 justify-content-between align-items-center profile">
      <div className="d-flex  align-items-center" >
        <img src={selectedChat.image} alt="User avatar" className="img-fluid avatar mr-3"  />
        <h6 className='diplayName-middle'>{selectedChat.displayName}</h6>
      </div>
      <div className='d-flex justify-content-center align-items-center'>
        <button type="button" className="btn" onMouseDown={handleDeleteConversation} aria-label="Delete conversation for user only">
          <i className="fa fa-trash"></i>
        </button>
        <button type="button" className="btn" onMouseDown={handleCloseChat} aria-label="Close chat">
          <i className="fa fa-times"></i>
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
