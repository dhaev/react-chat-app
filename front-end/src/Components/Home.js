import ProfileWrapper from './ProfileWrapper';
import ChatWrapper from './ChatWrapper';
import { useGlobalState } from '../Provider/GlobalStateProvider';
import SocketListener from './SocketListener';
import DefaultDisplay from '../Utils/DefaultDisplay';

function Home() {
  const { selectedChat} = useGlobalState();

  return (
    <div className="container-fluid row g-0 vh-100">
      <ProfileWrapper />
      {!selectedChat ? <DefaultDisplay/> :<ChatWrapper />   }
      <SocketListener />
    </div>
  );
}

export default Home;
