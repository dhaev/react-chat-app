import React, { useEffect, useRef } from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import socket from '../Utils/Socket.js';
import { getRequest, deleteRequest } from '../Utils/Axios.js';
import { GET_MESSAGES, DELETE_MESSAGE } from '../Utils/apiEndpoints';
import { useGlobalState } from '../Provider/GlobalStateProvider';

// The most general component that renders the chat body
function ChatBody() {
  const { user, selectedChat, chatMessage, setChatMessage } = useGlobalState();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest(GET_MESSAGES, { otherUserId: selectedChat?._id });
        if (response.status === 200) {
          const responseMap = new Map(response.data.messages?.map(i => [i._id, i]));
          setChatMessage(responseMap);
        }
      } catch (error) {
        // handle error
      }
    };

    fetchData();
  }, [setChatMessage, selectedChat, user]);

  useEffect(() => {
    const { scrollHeight } = chatContainerRef.current;
    chatContainerRef.current.scrollTop = scrollHeight;
  }, [chatMessage]);

  return (
    <div className="mt-auto message-list"  ref={chatContainerRef}>
      <div className="container message-list fill-space chat-messages d-flex flex-column align-items-start justify-content-end overflow-x-off" >
        {chatMessage ? (
          Array.from(chatMessage.values()).map((message) => (
            <Message key={message._id} id={message._id} content={message.content} sender={message.sender} />
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
    </div>
  );
}

function Message({ id, content, sender }) {
  const { user, selectedChat } = useGlobalState();
  const item = [
    { text: "Delete", action: handleDeleteMessage },
  ];

  // The function that handles the deletion of a message
  async function handleDeleteMessage() {
    try {
      const response = await deleteRequest(DELETE_MESSAGE, { otherUserId: selectedChat?._id, messageId: id });
      if (response.status === 200) {
        socket.emit('deleteMessage',id, user._id, selectedChat?._id);
      }
    } catch (error) {
      // handle error
    }
  };

  return (
    <CustomPopover id={id} content={content} item={item} actionTrigger="click" sender={sender} user={user._id} />
  );
}

// The more specific component that renders the popover with the delete option
function CustomPopover({ id, content, item, actionTrigger, sender, user }) {
  const popover = (
    <Popover id={`popover-${id}`}>
      <Popover.Body className='message-popover'>
        {item.map((i) => (
          <div key={i.text} onClick={i.action}>
            {i.text}
          </div>
        ))}
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger trigger={actionTrigger} placement="auto" overlay={popover} rootClose>
      <div id={id}
        className={`d-flex flex-column ${sender === user ? 'align-self-end message sent' : 'align-self-start message received'}`}
      >
        {content}
      </div>
    </OverlayTrigger>
  );
}

export default ChatBody;
