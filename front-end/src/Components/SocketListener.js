import { useEffect } from 'react';

import socket from '../Utils/Socket';
import { getRequest, putRequest } from '../Utils/Axios.js';
import { UPDATE_READ_MESSAGES, GET_CONVERSATION } from '../Utils/apiEndpoints';
import { useGlobalState } from '../Provider/GlobalStateProvider';

function SocketListener() {
  const { setChatMessage, selectedChat, userConversation, setUserConversation, user } = useGlobalState();

  useEffect(() => {
    function isMessageRelevant(chatId, userId, newMessage) {
      const isRelevant = (chatId === newMessage.sender && userId === newMessage.receiver) || (userId === newMessage.sender && chatId === newMessage.receiver);
      return isRelevant;
    }

    async function addNewMessage(newMessage) {
      try {
        (selectedChat?._id).unreadCount = 0;
        setChatMessage((prevMessages) => {
          return new Map([...prevMessages, [newMessage._id, newMessage]]);
        });
        putRequest(UPDATE_READ_MESSAGES, { otherUserId: selectedChat?._id });        
      } catch (error) {
        // handle error
      }
    }

    async function updateConversationFromSocket(newMessage, otherUser) {
      try {
        if (user._id === newMessage.receiver) {
          otherUser.unreadCount = 1;
        } else {
          otherUser.unreadCount = 0;
        }
        setUserConversation(prevData => new Map([...prevData, [otherUser._id, otherUser]]));
        return true;
      } catch (error) {
        return false;
      }
    }

    async function fetchUserFromDatabase(newMessage) {
      let otherUserId;
      try {
        if (user._id === newMessage.receiver) {
          otherUserId = newMessage.sender;
        } else {
          otherUserId = newMessage.receiver;
        }
        const response = await getRequest(GET_CONVERSATION, { otherUserId });
        const responseMap = new Map(response.data.user.map(i => [i._id, i]));
        setUserConversation(prevData => new Map([...prevData, ...responseMap]));
      } catch (error) {
        // handle error
      }
    }

    async function handleIrrelevantMessage(newMessage, otherUser) {
      const targetId = user._id === newMessage.receiver ? newMessage.sender : newMessage.receiver;
      const doesExist = userConversation.has(targetId);

      if (!doesExist) {
        !updateConversationFromSocket(newMessage, otherUser) && fetchUserFromDatabase(newMessage)
      } else if (doesExist) {
        if (user._id === newMessage.receiver) {
          setUserConversation(prev => {
            const targetValue = prev.get(targetId);
            if (targetValue) {
              const updatedTargetValue = { ...targetValue, unreadCount: targetValue.unreadCount + 1 };
              return new Map(prev).set(targetId, updatedTargetValue);
            }
            return prev;
          });
        }
      }
    }

    if (socket) {
      const messageListener = async (newMessage, otherUser) => {
        const isRelevant = isMessageRelevant(selectedChat?._id, user._id, newMessage)
        if (isRelevant) {
          await addNewMessage(newMessage);
        } 
        await handleIrrelevantMessage(newMessage, otherUser, isRelevant);
      };

      const deleteListener = async (messageId, otherUserId) => {
        if (selectedChat?._id === otherUserId) {
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
        socket.off('deleteMessage', deleteListener);
      };
    }
  }, [setChatMessage, selectedChat, userConversation, setUserConversation, user]);

  return null;
}

export default SocketListener;
