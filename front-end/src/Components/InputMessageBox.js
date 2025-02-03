import React, { useRef } from 'react';
import { postRequest } from '../Utils/Axios.js';
import socket from '../Utils/Socket.js';
import { SEND_MESSAGE } from '../Utils/apiEndpoints';
import { useGlobalState } from '../Provider/GlobalStateProvider';

// This function component is used for the input message box in the chat
function InputMessageBox() {
  const { userConversation, selectedChat, user } = useGlobalState();
  const refMessageInput = useRef("");

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if(!refMessageInput.current.value || refMessageInput.current.value.trim() === "" || !selectedChat?._id || selectedChat?._id.trim() === "") return;
    try {
      const response = await postRequest(SEND_MESSAGE, {
        content: refMessageInput.current.value,
        receiverId: selectedChat?._id,
      });
      refMessageInput.current.value = ''
      // const { email, ...userDetails } = user;
      //   userConversation.has(selectedChat?._id) ? socket.emit('sendMessage',response.data.newMessage) : socket.emit('sendMessage',response.data.newMessage,userDetails, selectedChat)

      if(response.status === 200) {

        const { email, ...userDetails } = user;
        userConversation.has(selectedChat?._id) ? socket.emit('sendMessage',response.data.newMessage) : socket.emit('sendMessage',response.data.newMessage,userDetails, selectedChat)
      }
    } catch (error) {
      // handle error
    }
  };

  // The component returns an input group with a text input and a send button
  return (
    <div className="p-2 input-group">
      <input
        type="text"
        className="form-control"
        placeholder="..."
        ref={refMessageInput} 
      />
      <button className="btn btn-primary fa fa-send" onClick={handleSendMessage}></button>
    </div>
  );
}

export default InputMessageBox;
