import { putRequest } from '../Utils/Axios.js';
import { useGlobalState } from '../Provider/GlobalStateProvider.js';
import { UPDATE_READ_MESSAGES } from '../Utils/apiEndpoints';

export function useMarkAsRead() {
  const { setUserConversation } = useGlobalState();

  const markAsRead = async (contact) => {
    try {
      const response = await putRequest(UPDATE_READ_MESSAGES, { otherUserId: contact._id });
      if (response.status === 200) {
        setUserConversation(prev => {
          const targetValue = prev.get(contact._id);
          if (targetValue) {
            const updatedTargetValue = { ...targetValue, unreadCount: 0 };
            return new Map(prev).set(contact._id, updatedTargetValue);
          }

          return prev;
        });
      }
    } catch (error) {
      setUserConversation(prev => {
        return prev;
      });
    }
  };
  
    return markAsRead;
};
  