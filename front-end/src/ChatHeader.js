import React, { useState } from 'react';
import { deleteRequest } from './Axios.js';
import { useGlobalState } from './GlobalStateProvider';

// API endpoint
const DELETE_CONVERSATION = '/home/deleteConversationForOne';

function ChatHeader() {
  const { user, chatHeader, setChatHeader, setChatMessage } = useGlobalState();
  const [error, setError] = useState(null);

  async function handleDeleteConversation(event) {
    event.preventDefault();
    try {
      const response = await deleteRequest(DELETE_CONVERSATION, { otherUserId: chatHeader?._id });
      if(response.status === 200){
        setChatMessage(new Map());
      }
    } catch (error) {
      setError('Error deleting conversation:', error);
      setError(error);
    }
  };

  async function handleCloseChat(event) {
    event.preventDefault();
    event.stopPropagation();
    setChatHeader(null);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="d-flex p-2 justify-content-between align-items-center profile">
      <div>
        <img src={chatHeader.image} alt="User avatar" className="img-fluid avatar mr-3" />
        <span className='diplayName-middle'>{chatHeader.displayName}</span>
      </div>
      <div>
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
