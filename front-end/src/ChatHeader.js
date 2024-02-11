import React from 'react';
import { deleteRequest } from './Axios.js';
import { useGlobalState } from './GlobalStateProvider';

function ChatHeader() {
  const { user, chatHeader, setChatHeader, setChatMessage } = useGlobalState();

  async function handleDeleteConversation(event) {
    event.preventDefault();
    try {
      const response = await deleteRequest('/home/deleteConversationForOne', { userId: user._id, otherUserId: chatHeader?._id });
      if(response.status === 200){
        setChatMessage(new Map());
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return (
    <div className="d-flex p-2 justify-content-between align-items-center profile">
      <div>
        <img src={chatHeader.image} alt="" className="img-fluid avatar" />
        <span className="">{chatHeader.displayName}</span>
      </div>
      <div>
        <button className="btn" onMouseDown={handleDeleteConversation}>
          <i className="fa fa-trash"></i>
        </button>
        <button className="btn" onMouseDown={(e) => {
          e.stopPropagation();
          setChatHeader(null);
        }}>
          <i className="fa fa-times"></i>
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
