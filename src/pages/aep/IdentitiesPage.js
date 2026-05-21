import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import AEPLayout from '../../components/aep/AEPLayout';
import { SettingsIcon, MoreIcon } from '../../components/aep/icons';

const identityTrend = [
  { date: 'Apr 26', count: 1480 },
  { date: 'May 03', count: 1495 },
  { date: 'May 10', count: 1500 },
  { date: 'May 17', count: 1505 },
];

const graphTrend = [
  { date: 'Apr 26', count: 740 },
  { date: 'May 03', count: 745 },
  { date: 'May 10', count: 748 },
  { date: 'May 17', count: 750 },
];

const identityByNamespace = [
  { name: 'crmid123', value: 680 },
  { name: 'loyaltyid', value: 670 },
  { name: 'ecid', value: 420 },
  { name: 'email', value: 380 },
  { name: 'phone', value: 290 },
  { name: 'userid', value: 250 },
  { name: 'crmid', value: 200 },
  { name: 'syid', value: 180 },
  { name: 'stackchatid', value: 120 },
  { name: 'email_lc_sha256', value: 90 },
];

const graphBySize = [
  { name: '2', value: 720 },
  { name: '3', value: 20 },
  { name: '4', value: 8 },
  { name: '5', value: 2 },
  { name: '6-10', value: 0 },
];

const graphsMultiIdentity = [
  { name: 'ecid', value: 520 },
  { name: 'crmid123', value: 480 },
  { name: 'loyaltyid', value: 420 },
  { name: 'email', value: 310 },
  { name: 'phone', value: 280 },
  { name: 'userid', value: 200 },
  { name: 'syid', value: 150 },
  { name: 'crmid', value: 120 },
  { name: 'stackchatid', value: 80 },
  { name: 'email_lc_sha256', value: 60 },
];

const TEAL = '#2d9d78';

const IdentitiesPage = () => (
  <AEPLayout>
    <div className="aep-page">
      <div className="aep-page-header-row">
        <h1 className="aep-page-title">Identities</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="aep-btn"><SettingsIcon /> Settings</button>
          <button type="button" className="aep-btn aep-btn-primary">+ Create identity namespace</button>
        </div>
      </div>

      <div className="aep-tabs">
        <button type="button" className="aep-tab active">Overview</button>
        <button type="button" className="aep-tab">Namespaces</button>
        <button type="button" className="aep-tab">Graph Viewer</button>
        <button type="button" className="aep-tab">Graph Simulation</button>
      </div>

      <p className="aep-info-text">Metrics are updated daily based on identity graph data.</p>

      <div className="aep-quick-stats" style={{ marginBottom: 20 }}>
        <div className="aep-quick-stat"><span className="aep-quick-stat-icon">🔑</span><div><div className="aep-quick-stat-value">1,505</div><div className="aep-quick-stat-label">Total identities</div></div></div>
        <div className="aep-quick-stat"><span className="aep-quick-stat-icon">🔗</span><div><div className="aep-quick-stat-value">750</div><div className="aep-quick-stat-label">Identity graphs</div></div></div>
        <div className="aep-quick-stat"><span className="aep-quick-stat-icon">📊</span><div><div className="aep-quick-stat-value">10</div><div className="aep-quick-stat-label">Namespaces</div></div></div>
        <div className="aep-quick-stat"><span className="aep-quick-stat-icon">✅</span><div><div className="aep-quick-stat-value">99.7%</div><div className="aep-quick-stat-label">Match rate</div></div></div>
      </div>

      <div className="aep-widget-grid">
        <div className="aep-widget">
          <div className="aep-widget-header">
            <span className="aep-card-title">Identity count trend</span>
            <MoreIcon />
          </div>
          <div className="aep-widget-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={identityTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 1600]} tick={{ fontSize: 11 }} label={{ value: 'Identities', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke={TEAL} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="aep-widget">
          <div className="aep-widget-header">
            <span className="aep-card-title">Graph count trend</span>
            <MoreIcon />
          </div>
          <div className="aep-widget-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 800]} tick={{ fontSize: 11 }} label={{ value: 'Graphs', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke={TEAL} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="aep-widget">
          <div className="aep-widget-header">
            <span className="aep-card-title">Identity count by namespace</span>
            <MoreIcon />
          </div>
          <div className="aep-widget-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={identityByNamespace} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 700]} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill={TEAL} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="aep-widget">
          <div className="aep-widget-header">
            <span className="aep-card-title">Graph count by graph size</span>
            <MoreIcon />
          </div>
          <div className="aep-widget-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphBySize} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={40} tick={{ fontSize: 10 }} label={{ value: 'Graph size', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
                <Tooltip />
                <Bar dataKey="value" fill={TEAL} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="aep-widget">
          <div className="aep-widget-header">
            <span className="aep-card-title">Graphs with multiple (2+) identities by namespace</span>
            <MoreIcon />
          </div>
          <div className="aep-widget-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphsMultiIdentity} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill={TEAL} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  </AEPLayout>
);

export default IdentitiesPage;
