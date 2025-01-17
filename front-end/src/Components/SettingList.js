import { useSetting } from '../Provider/SettingProvider';

function SettingList() {
    const { settingsList, selectedSettings, setSelectedSettings } = useSetting();
  
    return (
      <div>
        <div className="container-fluid settings mt-2" id="setting-list">
          {settingsList.map((component) => (
            <div
              key={component._id}
              className={`justify-content-between align-items-center conversations mb-1 border-bottom list rounded conversations p-3 ${ selectedSettings === component._id ? "selected" : ""}`}
              onMouseDown={() => setSelectedSettings(component._id)}
            >
              <span className="">{component.displayName}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

export default SettingList;