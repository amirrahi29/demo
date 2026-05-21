import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon, WorkflowIcon, LinkIcon,
  ChevronIcon, EditIcon,
  DatabaseIcon, MonitorIcon, IngestIcon,
} from './icons';

const ingestionNav = [
  { to: '/ingestion', label: 'Overview' },
  { to: '/sources', label: 'Sources' },
  { to: '/monitoring', label: 'Ingestion monitoring' },
  { to: '/destinations', label: 'Landing zones' },
];

const transformationNav = [
  { to: '/transformation', label: 'Overview' },
  { to: '/workflows', label: 'Pipelines' },
  { to: '/datasets', label: 'Datasets' },
  { to: '/queries', label: 'Transform queries' },
];

const standardizationNav = [
  { to: '/standardization', label: 'Overview' },
  { to: '/schemas', label: 'Schema registry' },
  { to: '/identities', label: 'Field mapping' },
  { to: '/datasets', label: 'Standardized data' },
];

const governanceNav = [
  { to: '/alerts', label: 'Pipeline alerts' },
  { to: '/sandboxes', label: 'Sandboxes' },
  { to: '/license', label: 'License usage' },
  { to: '/dashboards', label: 'Analytics' },
];

const NavItem = ({ to, children, onNavigate, end, className = '' }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onNavigate}
    className={({ isActive }) => `aep-sidebar-item${isActive ? ' active' : ''}${className ? ` ${className}` : ''}`}
  >
    {children}
  </NavLink>
);

const AEPSidebar = ({ isOpen = false, onNavigate }) => {
  const sidebarClass = `aep-sidebar gpu-smooth${isOpen ? ' is-open' : ''}`;
  const [openGroups, setOpenGroups] = useState({
    ingestion: true,
    transformation: true,
    standardization: true,
    governance: true,
  });

  const toggle = (key) => setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <aside className={sidebarClass}>
      <NavItem to="/" end onNavigate={onNavigate}><HomeIcon /> Home</NavItem>

      <div
        className={`aep-sidebar-group-title ${openGroups.ingestion ? 'open' : ''}`}
        onClick={() => toggle('ingestion')}
        role="button"
        tabIndex={0}
      >
        <IngestIcon /> Data Ingestion <ChevronIcon />
      </div>
      {openGroups.ingestion && (
        <div className="aep-sidebar-sub">
          {ingestionNav.map(({ to, label }) => (
            <NavItem key={to} to={to} onNavigate={onNavigate}>{label}</NavItem>
          ))}
        </div>
      )}

      <div
        className={`aep-sidebar-group-title ${openGroups.transformation ? 'open' : ''}`}
        onClick={() => toggle('transformation')}
        role="button"
        tabIndex={0}
      >
        <WorkflowIcon /> Data Transformation <ChevronIcon />
      </div>
      {openGroups.transformation && (
        <div className="aep-sidebar-sub">
          {transformationNav.map(({ to, label }) => (
            <NavItem key={to} to={to} onNavigate={onNavigate}>{label}</NavItem>
          ))}
        </div>
      )}

      <div
        className={`aep-sidebar-group-title ${openGroups.standardization ? 'open' : ''}`}
        onClick={() => toggle('standardization')}
        role="button"
        tabIndex={0}
      >
        <DatabaseIcon /> Data Standardization <ChevronIcon />
      </div>
      {openGroups.standardization && (
        <div className="aep-sidebar-sub">
          {standardizationNav.map(({ to, label }) => (
            <NavItem key={to} to={to} onNavigate={onNavigate}>{label}</NavItem>
          ))}
        </div>
      )}

      <div
        className={`aep-sidebar-group-title ${openGroups.governance ? 'open' : ''}`}
        onClick={() => toggle('governance')}
        role="button"
        tabIndex={0}
      >
        <MonitorIcon /> Governance <ChevronIcon />
      </div>
      {openGroups.governance && (
        <div className="aep-sidebar-sub">
          {governanceNav.map(({ to, label }) => (
            <NavItem key={to} to={to} onNavigate={onNavigate}>{label}</NavItem>
          ))}
        </div>
      )}

      <NavItem to="/tealium" onNavigate={onNavigate} className="aep-sidebar-platform-link">
        <LinkIcon /> Data Supply Chain Hub
      </NavItem>

      <div className="aep-sidebar-edit">
        <button type="button"><EditIcon /> Edit navigation</button>
      </div>
    </aside>
  );
};

export default AEPSidebar;
