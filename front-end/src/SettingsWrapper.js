import SettingMenu from './SettingMenu';
import SettingContent from './SettingContent';
import SettingProvider from './SettingProvider';

function SettingsWrapper() {



  return (
    <div className="container-fluid row g-0 vh-100">
      <SettingProvider>
          <SettingMenu/>
          <SettingContent/>
      </SettingProvider>
    </div>
  )
}

export default SettingsWrapper