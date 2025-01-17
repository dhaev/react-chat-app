// Custom hook for user conversation
import { useGlobalState } from '../Provider/GlobalStateProvider.js';


export function useUpdateUserConversation() {
  const [setUserConversation] = useGlobalState();

  function updateUserConversation(id, updateFn) {
    setUserConversation(prev => {
      const targetValue = prev.get(id);
      if (targetValue) {
        const updatedTargetValue = updateFn(targetValue);
        return new Map(prev).set(id, updatedTargetValue);
      }
      return prev;
    });
  }
  
  return  updateUserConversation;
}