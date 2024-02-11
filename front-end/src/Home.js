import ProfileWrapper from './ProfileWrapper';
import ChatWrapper from './ChatWrapper';
import { useGlobalState } from './GlobalStateProvider';
import SocketListener from './SocketListener';

function Home() {
  const { chatHeader } = useGlobalState();

  return (
    <div className="container-fluid row g-0 vh-100">
      <ProfileWrapper />
      {chatHeader && <ChatWrapper />}
      <SocketListener />
    </div>
  );
}

export default Home;
