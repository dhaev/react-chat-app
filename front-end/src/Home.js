import ProfileWrapper from './ProfileWrapper';
import ChatWrapper from './ChatWrapper';
import { useGlobalState } from './GlobalStateProvider';
import SocketListener from './SocketListener';
import DefaultDisplay from './DefaultDisplay';
import SettingsWrapper from './SettingsWrapper';
function Home() {
  const { chatHeader,showSettings,} = useGlobalState();

  if(showSettings === false){

  return (
    <div className="container-fluid row g-0 vh-100">
      <ProfileWrapper />
      {/* <DefaultDisplay/>  */}
      {!chatHeader ? <DefaultDisplay/> :<ChatWrapper />   }
      <SocketListener />
    </div>
  );
  }else{
   return  <SettingsWrapper/>
  }
}

export default Home;
