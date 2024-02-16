import React, { useEffect } from 'react';
import { getRequest, deleteRequest } from './Axios.js';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { useGlobalState } from './GlobalStateProvider';
import socket from './Socket.js';

// The most general component that renders the chat body
function ChatBody() {
  const { user, chatHeader, chatMessage, setChatMessage } = useGlobalState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest('/home/getMessages', { userId: user._id, otherUserId: chatHeader?._id });
        if (response.status === 200) {
          const responseMap = new Map(response.data.messages.map(i => [i._id, i]));
          setChatMessage(new Map(responseMap));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [setChatMessage, chatHeader, user]);

  return (
    <div className="overflow-auto mt-auto">
      <div className="container fill-space chat-messages d-flex flex-column align-items-start justify-content-end">
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
  const { user, chatHeader } = useGlobalState();
  const item = [
    { text: "Delete", action: handleDeleteMessage },
  ];

  // The function that handles the deletion of a message
  async function handleDeleteMessage() {
    try {
      const response = await deleteRequest('/home/deleteMessageForOne', { userId: user._id, otherUserId: chatHeader?._id, messageId: id });
      if (response.status === 200) {
        socket.emit('deleteMessage',id, user._id, chatHeader?._id);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
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
      <Popover.Body>
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
        className={`d-flex flex-column  ${sender === user ? 'align-self-end message sent' : 'align-self-start message received'}`}
      >
        {content}
      </div>
    </OverlayTrigger>
  );
}

export default ChatBody;
