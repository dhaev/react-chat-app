import { useGlobalState } from './GlobalStateProvider';
import { useSetting } from './SettingProvider';

function SettingHeader() {  
  const { user, setShowSettings,setSelectedSettings } = useGlobalState();

  
  const closeSetting = () => {
    setShowSettings(false);
    setSelectedSettings(null);
  }
  
  return (
    <div className="d-flex p-2 justify-content-between align-items-center profile">
      <img src={'http://192.168.2.19:5000/'+user.image} alt="" className="img-fluid avatar" />
      <h6> Settings </h6>
      <button className="btn" onMouseDown={closeSetting}>
        <i className="fa fa-home"></i>
      </button>
    </div>
  );
}

function SettingList() {
  const { selectedSettings, setSelectedSettings } = useGlobalState();
  const { settingsList} = useSetting();

  return (
    <div >
      <div className="container-fluid settings mt-2" id="setting-list">
        {settingsList.map((component) => (
          <div
            key={component._id}
            className={`p-2 justify-content-between align-items-center conversations mb-1 border-bottom list rounded conversations p-3 ${ selectedSettings === component._id ? "selected" : ""}`}

            onMouseDown={() => setSelectedSettings(component._id)}
          >
            <span className="">{component.displayName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingMenu() {
  return (
    <div className="col-3 d-flex flex-column vh-100 border border-right ">
      <SettingHeader />
      <SettingList/>
    </div>
  )
}

export default SettingMenu;