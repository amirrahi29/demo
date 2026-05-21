import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchIcon, BellIcon, MenuIcon, CloseIcon } from '../../components/aep/icons';
import '../../styles/animations.css';
import '../../styles/tealium.css';
import '../../styles/responsive.css';

const TealiumLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className="tealium-app">
      <header className="tealium-topbar">
        <button
          type="button"
          className="tealium-menu-btn tealium-topbar-icon"
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        <div className="tealium-topbar-brand">
          <span className="tealium-logo">C</span>
          Codex Copilot Data Hub
        </div>
        <div className="tealium-topbar-search">
          <SearchIcon />
          <input type="text" placeholder="Search..." readOnly />
        </div>
        <div className="tealium-topbar-right">
          <button type="button" className="tealium-btn-save">Save / Publish</button>
          <span className="tealium-topbar-icon"><BellIcon /></span>
          <span className="tealium-topbar-icon">👤</span>
        </div>
      </header>

      {sidebarOpen && (
        <button
          type="button"
          className="tealium-sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="tealium-shell">
        <aside className={`tealium-sidebar gpu-smooth${sidebarOpen ? ' is-open' : ''}`}>
          <div className="tealium-nav-item">iQ Tag Management</div>
          <div className="tealium-nav-group">Data Supply Chain</div>
          <div className="tealium-nav-sub">
            <Link to="/tealium" className="tealium-nav-item active" onClick={() => setSidebarOpen(false)}>Overview</Link>
            <div className="tealium-nav-item">Usage Reports</div>
            <div className="tealium-nav-item">Sources</div>
            <div className="tealium-nav-item">EventStream</div>
            <div className="tealium-nav-item">AudienceStream</div>
            <div className="tealium-nav-item">DataAccess</div>
            <div className="tealium-nav-item">Trace</div>
          </div>
          <div className="tealium-nav-item">Server-Side Experiments</div>
          <div className="tealium-nav-item">Server-Side Tools</div>
          <div className="tealium-nav-item">Server-Side Versions</div>
          <div className="tealium-nav-item">Help &amp; Support</div>
          <Link
            to="/"
            className="tealium-nav-item tealium-platform-link"
            onClick={() => setSidebarOpen(false)}
          >
            Codex Copilot
          </Link>
        </aside>
        <main className="tealium-main">
          <div key={location.pathname} className="page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TealiumLayout;
