import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SearchIcon, BellIcon, MenuIcon, CloseIcon, ChevronIcon } from '../aep/icons';
import { tealiumNavGroups } from '../../data/tealiumData';
import '../../styles/animations.css';
import '../../styles/tealium.css';
import '../../styles/interactions.css';
import '../../styles/responsive.css';
import '../../styles/clean.css';
import '../../styles/enterprise-motion.css';

const TealiumLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({
    overview: true,
    ingestion: true,
    transformation: true,
    standardization: true,
  });

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const toggleGroup = (id) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
        <Link to="/tealium" className="tealium-topbar-brand">
          <span className="tealium-logo">C</span>
          <span className="tealium-brand-text">Codex Data Supply Chain</span>
        </Link>
        <div className="tealium-topbar-search">
          <SearchIcon />
          <input type="text" placeholder="Search pipelines, sources, schemas…" readOnly />
        </div>
        <div className="tealium-topbar-right">
          <button type="button" className="tealium-btn-save">Deploy pipeline</button>
          <button type="button" className="tealium-topbar-icon" aria-label="Notifications"><BellIcon /></button>
          <div className="tealium-avatar" aria-hidden>AN</div>
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
          {tealiumNavGroups.map((group) => (
            <div key={group.id} className="tealium-nav-section">
              <button
                type="button"
                className={`tealium-nav-group-toggle${openGroups[group.id] ? ' open' : ''}`}
                onClick={() => toggleGroup(group.id)}
                aria-expanded={openGroups[group.id]}
              >
                {group.label}
                <ChevronIcon />
              </button>
              {openGroups[group.id] && (
                <div className="tealium-nav-sub">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) => `tealium-nav-item${isActive ? ' active' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            to="/"
            className="tealium-nav-item tealium-platform-link"
            onClick={() => setSidebarOpen(false)}
          >
            ← Codex Copilot Platform
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
