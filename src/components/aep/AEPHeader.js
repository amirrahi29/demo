import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, BellIcon, HelpIcon, GridIcon, MenuIcon, CloseIcon } from './icons';
import { sandboxes } from '../../data/dropdownData';

const AEPHeader = ({ sidebarOpen, onMenuToggle }) => {
  const [sandbox, setSandbox] = useState('va7');
  const active = sandboxes.find((s) => s.id === sandbox) || sandboxes[0];

  return (
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
        <input type="text" placeholder="Search pipelines, sources, schemas (Ctrl+/)" readOnly />
      </div>
      <div className="aep-header-right">
        <span className="aep-env-text">{active.env}</span>
        <span className={`aep-badge-dev${active.badge === 'Prod' ? ' aep-badge-prod' : active.badge === 'Stage' ? ' aep-badge-stage' : ''}`}>
          {active.badge}
        </span>
        <select
          className="aep-sandbox-select"
          aria-label="Sandbox"
          value={sandbox}
          onChange={(e) => setSandbox(e.target.value)}
        >
          {sandboxes.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <button type="button" className="aep-header-icon" aria-label="Help"><HelpIcon /></button>
        <button type="button" className="aep-header-icon" aria-label="Notifications"><BellIcon /></button>
        <button type="button" className="aep-header-icon" aria-label="App switcher"><GridIcon /></button>
        <div className="aep-avatar">AN</div>
      </div>
    </header>
  );
};

export default AEPHeader;
