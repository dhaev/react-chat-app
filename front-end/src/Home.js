import ProfileWrapper from './ProfileWrapper';
import ChatWrapper from './ChatWrapper';
import { useGlobalState } from './GlobalStateProvider';
import SocketListener from './SocketListener';
import DefaultDisplay from './DefaultDisplay';

function Home() {
  const { selectedChat} = useGlobalState();



  return (
    <div className="container-fluid row g-0 vh-100">
      <ProfileWrapper />
      {/* <DefaultDisplay/>  */}
      {!selectedChat ? <DefaultDisplay/> :<ChatWrapper />   }
      <SocketListener />
    </div>
  );
}

export default Home;
