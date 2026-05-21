import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon, WorkflowIcon, DashboardIcon, BookIcon, LinkIcon,
  UserIcon, TargetIcon, FingerprintIcon, ChevronIcon, EditIcon,
  DatabaseIcon, MonitorIcon, SchemaIcon,
} from './icons';

const customerNav = [
  { to: '/profiles', label: 'Profiles', icon: UserIcon },
  { to: '/audiences', label: 'Audiences', icon: TargetIcon },
  { to: '/identities', label: 'Identities', icon: FingerprintIcon },
];

const monitoringNav = [
  { group: 'Data Lifecycle', icon: DatabaseIcon },
  { group: 'Data Science', icon: SchemaIcon },
  { group: 'Services', icon: LinkIcon },
  {
    group: 'Data Management',
    icon: DatabaseIcon,
    open: true,
    items: [
      { to: '/schemas', label: 'Schemas' },
      { to: '/places', label: 'Places' },
      { to: '/datasets', label: 'Datasets' },
      { to: '/queries', label: 'Queries' },
      { to: '/monitoring', label: 'Monitoring' },
    ],
  },
  {
    group: 'Decision Management',
    icon: TargetIcon,
    open: true,
    items: [
      { to: '/offers', label: 'Offers' },
      { to: '/components', label: 'Components' },
    ],
  },
  {
    group: 'Administration',
    icon: MonitorIcon,
    open: true,
    items: [
      { to: '/alerts', label: 'Alerts' },
      { to: '/sandboxes', label: 'Sandboxes' },
      { to: '/license', label: 'License Usage' },
      { to: '/encryption', label: 'Encryption' },
    ],
  },
];

const AEPSidebar = ({ variant = 'default', isOpen = false, onNavigate }) => {
  const sidebarClass = `aep-sidebar gpu-smooth${isOpen ? ' is-open' : ''}`;
  const [openGroups, setOpenGroups] = useState({
    playbooks: true,
    connections: true,
    customer: true,
    accounts: false,
    dataManagement: true,
    decisionManagement: true,
    administration: true,
  });

  const toggle = (key) => setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  if (variant === 'monitoring') {
    return (
      <aside className={sidebarClass}>
        {monitoringNav.map((section) => (
          section.items ? (
            <div key={section.group}>
              <div
                className={`aep-sidebar-group-title ${openGroups[section.group.replace(/\s/g, '').toLowerCase()] !== false ? 'open' : ''}`}
                onClick={() => toggle(section.group.replace(/\s/g, '').toLowerCase())}
                role="button"
                tabIndex={0}
              >
                <section.icon /> {section.group}
                <ChevronIcon />
              </div>
              {(openGroups[section.group.replace(/\s/g, '').toLowerCase()] !== false) && (
                <div className="aep-sidebar-sub">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onNavigate}
                      className={({ isActive }) => `aep-sidebar-item${isActive ? ' active' : ''}`}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div key={section.group} className="aep-sidebar-item">
              <section.icon /> {section.group}
            </div>
          )
        ))}
        <div className="aep-sidebar-edit">
          <button type="button"><EditIcon /> Edit</button>
        </div>
      </aside>
    );
  }

  return (
    <aside className={sidebarClass}>
      <NavLink to="/" end onClick={onNavigate} className={({ isActive }) => `aep-sidebar-item${isActive ? ' active' : ''}`}>
        <HomeIcon /> Home
      </NavLink>
      <div className="aep-sidebar-item"><WorkflowIcon /> Workflows</div>
      <div className="aep-sidebar-item"><DashboardIcon /> Dashboards</div>

      <div
        className={`aep-sidebar-group-title ${openGroups.playbooks ? 'open' : ''}`}
        onClick={() => toggle('playbooks')}
        role="button"
        tabIndex={0}
      >
        <BookIcon /> Use Case Playbooks <ChevronIcon />
      </div>
      {openGroups.playbooks && (
        <div className="aep-sidebar-sub">
          <div className="aep-sidebar-item">Playbooks</div>
        </div>
      )}

      <div
        className={`aep-sidebar-group-title ${openGroups.connections ? 'open' : ''}`}
        onClick={() => toggle('connections')}
        role="button"
        tabIndex={0}
      >
        <LinkIcon /> Connections <ChevronIcon />
      </div>
      {openGroups.connections && (
        <div className="aep-sidebar-sub">
          <div className="aep-sidebar-item">Sources</div>
          <div className="aep-sidebar-item">Destinations</div>
        </div>
      )}

      <div
        className={`aep-sidebar-group-title ${openGroups.customer ? 'open' : ''}`}
        onClick={() => toggle('customer')}
        role="button"
        tabIndex={0}
      >
        <UserIcon /> Customer <ChevronIcon />
      </div>
      {openGroups.customer && (
        <div className="aep-sidebar-sub">
          {customerNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) => `aep-sidebar-item${isActive ? ' active' : ''}`}
            >
              <Icon /> {label}
            </NavLink>
          ))}
        </div>
      )}

      <div
        className={`aep-sidebar-group-title ${openGroups.accounts ? 'open' : ''}`}
        onClick={() => toggle('accounts')}
        role="button"
        tabIndex={0}
      >
        <UserIcon /> Accounts <ChevronIcon />
      </div>
      {openGroups.accounts && (
        <div className="aep-sidebar-sub">
          <div className="aep-sidebar-item">Profiles</div>
          <div className="aep-sidebar-item">Audiences</div>
        </div>
      )}

      <div className="aep-sidebar-item"><TargetIcon /> Prospects</div>

      <NavLink to="/tealium" onClick={onNavigate} className="aep-sidebar-item aep-sidebar-platform-link">
        <LinkIcon /> Codex Data Hub
      </NavLink>

      <div className="aep-sidebar-edit">
        <button type="button"><EditIcon /> Edit</button>
      </div>
    </aside>
  );
};

export default AEPSidebar;
