// ChatWrapper.js
import React from 'react';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import InputMessageBox from './InputMessageBox';

function ChatWrapper() {
  return (
    <div className="col-9 d-flex flex-column vh-100 position-relative">
        <ChatHeader />
      <ChatBody />
      <InputMessageBox />
    </div>
  );
}

export default ChatWrapper;