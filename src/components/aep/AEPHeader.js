import { Link } from 'react-router-dom';
import { SearchIcon, BellIcon, HelpIcon, GridIcon, MenuIcon, CloseIcon } from './icons';

const AEPHeader = ({ sidebarOpen, onMenuToggle }) => (
  <header className="aep-header">
    <button
      type="button"
      className="aep-menu-btn aep-header-icon"
      aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={sidebarOpen}
      onClick={onMenuToggle}
    >
      {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
    </button>
    <Link to="/" className="aep-header-brand">
      <span className="aep-adobe-logo">C</span>
      Codex Copilot
    </Link>
    <div className="aep-header-search">
      <SearchIcon />
      <input type="text" placeholder="Search Codex Copilot (Ctrl+/)" readOnly />
    </div>
    <div className="aep-header-right">
      <span className="aep-env-text">AEP Partner Shared Sandbox Cinco</span>
      <span className="aep-badge-dev">Dev</span>
      <select className="aep-sandbox-select" aria-label="Sandbox">
        <option>EXLservice Partner Sandbox (VA7)</option>
      </select>
      <button type="button" className="aep-header-icon" aria-label="Help"><HelpIcon /></button>
      <button type="button" className="aep-header-icon" aria-label="Notifications"><BellIcon /></button>
      <button type="button" className="aep-header-icon" aria-label="App switcher"><GridIcon /></button>
      <div className="aep-avatar">AN</div>
    </div>
  </header>
);

export default AEPHeader;
