import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import AEPLayout from '../../components/aep/AEPLayout';
import { SettingsIcon } from '../../components/aep/icons';
import {
  audienceKpis, audienceTrend, audienceByType, recentAudiences, COLORS,
} from '../../data/platformData';

const PIE_COLORS = [COLORS.blue, COLORS.teal, COLORS.purple, COLORS.orange];

const AudiencesPage = () => (
  <AEPLayout>
    <div className="aep-page">
      <div className="aep-page-header-row">
        <h1 className="aep-page-title">Audiences</h1>
        <button type="button" className="aep-btn aep-btn-primary">+ Create audience</button>
      </div>
      <div className="aep-tabs">
        <button type="button" className="aep-tab active">Overview</button>
        <button type="button" className="aep-tab">Browse</button>
        <button type="button" className="aep-tab">Feeds</button>
        <button type="button" className="aep-tab">Jobs</button>
        <div className="aep-tabs-right">
          <button type="button" className="aep-btn"><SettingsIcon /> Settings</button>
        </div>
      </div>

      <div className="aep-kpi-row" style={{ marginTop: 20 }}>
        {audienceKpis.map((kpi) => (
          <div key={kpi.label} className="aep-kpi-card">
            <div className="aep-kpi-top">
              <div className="aep-kpi-label">{kpi.label}</div>
              {kpi.trendUp !== null && (
                <span className={`aep-kpi-trend${kpi.trendUp ? ' up' : ' down'}`}>{kpi.trend}</span>
              )}
            </div>
            <div className="aep-kpi-value">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="aep-widget-grid" style={{ marginTop: 20 }}>
        <div className="aep-widget">
          <div className="aep-widget-header">
            <span className="aep-card-title">Audience growth trend</span>
          </div>
          <div className="aep-widget-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={audienceTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke={COLORS.blue} strokeWidth={2} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="aep-widget">
          <div className="aep-widget-header">
            <span className="aep-card-title">Audiences by type</span>
          </div>
          <div className="aep-widget-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={audienceByType} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={90} label={({ type, value }) => `${type}: ${value}`}>
                  {audienceByType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="aep-widget">
          <div className="aep-widget-header">
            <span className="aep-card-title">Audience size distribution</span>
          </div>
          <div className="aep-widget-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={audienceByType}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill={COLORS.teal} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="aep-recent-grid" style={{ marginTop: 20 }}>
        <div className="aep-recent-col" style={{ gridColumn: '1 / -1' }}>
          <div className="aep-recent-header">
            <h3>All audiences</h3>
            <span className="aep-card-link">View all</span>
          </div>
          <div className="aep-audience-table">
            <div className="aep-data-table-header aep-audience-table-header">
              <span>Name</span><span>Size</span><span>Last updated</span><span>Status</span>
            </div>
            {recentAudiences.map((item) => (
              <div key={item.name} className="aep-data-table-row aep-audience-table-row">
                <span className="aep-recent-name">🎯 {item.name}</span>
                <span className="aep-data-value">{item.size}</span>
                <span className="aep-recent-meta">{item.time}</span>
                <span className="aep-status-pill active">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AEPLayout>
);

export default AudiencesPage;
