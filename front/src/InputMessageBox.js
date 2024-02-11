import React, { useState } from 'react';
import { postRequest } from './Axios.js';
import { useGlobalState } from './GlobalStateProvider';
import socket from './Socket.js';

// This function component is used for the input message box in the chat
function InputMessageBox() {

  // Destructuring the needed values from the global state
  const { user, chatHeader} = useGlobalState();

  // Local state for the message input
  const [message, setMessage] = useState("");

  // Function to handle sending of the message
  const sendMessage = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      // Making a POST request to send the message
      const response = await postRequest('/home/sendMessage', {
        content: message,
        senderId: user._id,
        receiverId: chatHeader?._id,
      });
      if(response.status === 200) {
        socket.emit('sendMessage',response.data.newMessage);
      }
    } catch (error) {
      // Error handling can be improved here
    }
  };

  // The component returns an input group with a text input and a send button
  return (
    <div className="p-2 input-group">
      <input
        type="text"
        className="form-control"
        placeholder="..."
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button className="btn btn-primary fa fa-send" onClick={sendMessage}></button>
    </div>
  );
}

export default InputMessageBox;
