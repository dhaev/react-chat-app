// filename: SocketListener.js
import React, { useEffect } from 'react';
import { useGlobalState } from './GlobalStateProvider';
import socket from './Socket';
import { getRequest, putRequest } from './Axios.js';


function SocketListener() {
  const { setChatMessage, chatHeader, userConversation, setUserConversation, user } = useGlobalState();

  useEffect(() => {
    function isMessageRelevant(chatId, userId, newMessage) {

      const isRelevant = (chatId === newMessage.sender && userId === newMessage.receiver) || (userId === newMessage.sender && chatId === newMessage.receiver);
      return isRelevant;
    }

    async function addNewMessage(newMessage) {

      try {
        const response = await putRequest('/home/updateReadMessages', { userId: user._id, otherUserId: chatHeader?._id });

      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setChatMessage((prevMessages) => {
        return new Map([...prevMessages, [newMessage._id, newMessage]]);
      });
    }

    async function handleIrrelevantMessage(newMessage) {
      const targetId = user._id === newMessage.receiver ? newMessage.sender : newMessage.receiver;
      userConversation.forEach(function (conversation) {
      });

      const doesExist = userConversation.has(targetId);

      if (!doesExist) {
        let receiver, sender;
        try {
          if (user._id === newMessage.receiver) {
            receiver = user._id;
            sender = newMessage.sender;
          } else {
            receiver = user._id;
            sender = newMessage.receiver;
          }
          const response = await getRequest('/home/getSpecificConversation', { userId: receiver, otherUserId: sender });
          const responseMap = new Map(response.data.user.map(i => [i._id, i]));
          setUserConversation(new Map([...userConversation, ...responseMap]));

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else if (doesExist) {
        const updatedUserConversation = new Map(userConversation);
        const targetValue = updatedUserConversation.get(targetId);
        targetValue.unreadCount += 1;
        updatedUserConversation.set(targetId, targetValue);
        setUserConversation(updatedUserConversation);
      }
    }

    if (socket) {
      const messageListener = async (newMessage) => {

        if (isMessageRelevant(chatHeader?._id, user._id, newMessage)) {
          addNewMessage(newMessage);
        } else {
          handleIrrelevantMessage(newMessage);
        }
      };

      const deleteListener = async (messageId, otherUserId) => {
        if (chatHeader?._id === otherUserId) {
          setChatMessage((prevData) => {
            const newData = new Map(prevData);
            newData.delete(messageId);
            return newData;
          });
        }
      };

      socket.on('receiveMessage', messageListener);
      socket.on('deleteMessage', deleteListener);

      // Clean up the listener when the component unmounts
      return () => {
        socket.off('receiveMessage', messageListener);
      };
    }
  },);




  return (
    <></>
  )
}

export default SocketListener