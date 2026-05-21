import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import AEPLayout from '../../components/aep/AEPLayout';
import { SettingsIcon, InfoIcon } from '../../components/aep/icons';
import {
  profileAiScores, audienceOverlap, audienceOverlapReport,
  aiScoringSummary, namespaceOverlapData, COLORS,
} from '../../data/platformData';

const profileCount1Plus = [
  { name: 'loyaltyid', value: 999 }, { name: 'crmid123', value: 850 }, { name: 'email', value: 720 },
  { name: 'phone', value: 650 }, { name: 'ecid', value: 580 }, { name: 'userid', value: 420 },
  { name: 'syid', value: 380 }, { name: 'crmid', value: 320 }, { name: 'loyaltyid123', value: 280 },
  { name: 'email_lc_sha256', value: 150 }, { name: 'stackchatid', value: 120 },
];

const profileCount1 = [
  { name: 'crmid123', value: 340 }, { name: 'loyaltyid', value: 310 }, { name: 'ecid', value: 280 },
  { name: 'syid', value: 220 }, { name: 'email', value: 180 }, { name: 'phone', value: 150 },
  { name: 'email_lc_sha256', value: 120 }, { name: 'userid', value: 100 }, { name: 'stackchatid', value: 80 },
  { name: 'crmid', value: 60 }, { name: 'loyaltyid123', value: 40 },
];

const profileTrend = [
  { month: 'Nov', count: 0 }, { month: 'Dec', count: 0 }, { month: 'Jan', count: 0 },
  { month: 'Feb', count: 0 }, { month: 'Mar', count: 1400 }, { month: 'Apr', count: 1450 },
];

const SCORE_COLORS = ['#e34850', '#e68619', '#f5c518', '#2d9d78', '#1473e6'];

const VennDiagram = ({ left, right, overlap }) => (
  <div className="aep-venn">
    <svg width="100%" height="200" viewBox="0 0 280 200" preserveAspectRatio="xMidYMid meet">
      <circle className="venn-circle" cx="105" cy="100" r="65" fill="rgba(45,157,120,0.35)" stroke="#2d9d78" strokeWidth="1.5" />
      <circle className="venn-circle" cx="175" cy="100" r="65" fill="rgba(20,115,230,0.25)" stroke="#1473e6" strokeWidth="1.5" />
      <text x="70" y="105" textAnchor="middle" fontSize="12" fill="#2c2c2c" fontWeight="600">{left}</text>
      <text x="210" y="105" textAnchor="middle" fontSize="12" fill="#2c2c2c" fontWeight="600">{right}</text>
      <text x="140" y="100" textAnchor="middle" fontSize="14" fill="#1473e6" fontWeight="700">{overlap}</text>
      <text x="140" y="118" textAnchor="middle" fontSize="10" fill="#6e6e6e">overlap</text>
    </svg>
  </div>
);

const ProfilesPage = () => {
  const [nsLeft, setNsLeft] = useState('ecid');
  const [nsRight, setNsRight] = useState('email');
  const [viewSql, setViewSql] = useState(false);

  const overlapCount = useMemo(() => {
    const map = namespaceOverlapData[nsLeft];
    if (map && map[nsRight] !== undefined) return map[nsRight];
    const reverse = namespaceOverlapData[nsRight];
    return reverse?.[nsLeft] ?? 67;
  }, [nsLeft, nsRight]);

  return (
    <AEPLayout>
      <div className="aep-page">
        <div className="aep-page-header-row">
          <h1 className="aep-page-title">Profiles</h1>
        </div>
        <div className="aep-tabs">
          <button type="button" className="aep-tab active">Overview</button>
          <button type="button" className="aep-tab">Browse</button>
          <button type="button" className="aep-tab">Merge Policies</button>
          <button type="button" className="aep-tab">Union Schema</button>
          <button type="button" className="aep-tab">Computed attributes</button>
          <div className="aep-tabs-right">
            <button type="button" className="aep-btn"><SettingsIcon /> Settings</button>
          </div>
        </div>
        <div className="aep-toolbar">
          <div className="aep-toolbar-left">
            Profiles using merge policy
            <select className="aep-select" defaultValue="default"><option>Default Timebased</option></select>
            <span className="aep-toolbar-meta">Metrics based on export: 04/19/2026, 5:30 AM</span>
          </div>
          <div className="aep-toolbar-right">
            <div className="aep-toggle">
              <div className={`aep-toggle-switch${viewSql ? ' on' : ''}`} onClick={() => setViewSql(!viewSql)} role="switch" aria-checked={viewSql} />
              View SQL
            </div>
            <button type="button" className="aep-btn">+ Add widget</button>
            <button type="button" className="aep-btn"><SettingsIcon /> Modify dashboard</button>
          </div>
        </div>

        <div className="aep-widget-grid">
          <div className="aep-widget">
            <div className="aep-widget-header">
              <span className="aep-card-title">Namespace overlap <InfoIcon /></span>
            </div>
            <div className="aep-widget-controls">
              <select className="aep-select" value={nsLeft} onChange={(e) => setNsLeft(e.target.value)}>
                {['crmid', 'crmid123', 'ecid', 'email', 'loyaltyid', 'phone'].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <select className="aep-select" value={nsRight} onChange={(e) => setNsRight(e.target.value)}>
                {['crmid', 'crmid123', 'ecid', 'email', 'loyaltyid', 'phone'].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <VennDiagram left={nsLeft} right={nsRight} overlap={overlapCount} />
          </div>
          <div className="aep-widget">
            <div className="aep-widget-header">
              <span className="aep-card-title">Profile count with 1+ identity</span>
              <span className="aep-card-link">Captions</span>
            </div>
            <div className="aep-widget-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profileCount1Plus} layout="vertical" margin={{ top: 5, right: 16, left: 4, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 1000]} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.teal} barSize={10} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="aep-widget">
            <div className="aep-widget-header">
              <span className="aep-card-title">Profile count with 1 identity</span>
              <span className="aep-card-link">Captions</span>
            </div>
            <div className="aep-widget-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profileCount1} layout="vertical" margin={{ top: 5, right: 16, left: 4, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 350]} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.teal} barSize={10} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="aep-widget-grid">
          <div className="aep-widget">
            <div className="aep-widget-header">
              <span className="aep-card-title">Profile count trend</span>
              <span className="aep-card-link">Captions</span>
            </div>
            <div className="aep-widget-controls">
              <select className="aep-select" defaultValue="12m"><option>Last 12 months</option></select>
            </div>
            <div className="aep-widget-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profileTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 1600]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="stepAfter" dataKey="count" stroke={COLORS.blue} strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="aep-widget">
            <div className="aep-widget-header">
              <span className="aep-card-title">Customer AI distribution of scores</span>
            </div>
            <div className="aep-widget-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profileAiScores}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {profileAiScores.map((_, i) => <Cell key={i} fill={SCORE_COLORS[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="aep-widget">
            <div className="aep-widget-header">
              <span className="aep-card-title">Audience overlap by merge policy</span>
            </div>
            <div className="aep-data-table aep-data-table-compact">
              {audienceOverlap.map((row) => (
                <div key={row.policy} className="aep-data-table-row">
                  <span>{row.policy}</span>
                  <span className="aep-data-bar-wrap">
                    <span className="aep-data-bar" style={{ width: row.overlap }} />
                    <span>{row.overlap}</span>
                  </span>
                  <span className="aep-data-value">{row.profiles}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="aep-widget-grid-2">
          <div className="aep-widget">
            <div className="aep-widget-header">
              <span className="aep-card-title">Audience overlap report</span>
              <span className="aep-card-link">View more</span>
            </div>
            <div className="aep-data-table">
              <div className="aep-data-table-header"><span>Audience</span><span>Overlap</span><span>Shared</span></div>
              {audienceOverlapReport.map((row) => (
                <div key={row.audience} className="aep-data-table-row">
                  <span>{row.audience}</span>
                  <span className="aep-status-pill active">{row.overlap}</span>
                  <span className="aep-data-value">{row.shared}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="aep-widget">
            <div className="aep-widget-header">
              <span className="aep-card-title">Customer AI scoring summary</span>
            </div>
            <div className="aep-mini-kpi-grid">
              {aiScoringSummary.map((item) => (
                <div key={item.label} className="aep-mini-kpi">
                  <div className="aep-mini-kpi-value">{item.value}</div>
                  <div className="aep-mini-kpi-label">{item.label}</div>
                  <div className={`aep-kpi-trend${Number(item.change) >= 0 ? ' up' : ' down'}`}>{item.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AEPLayout>
  );
};

export default ProfilesPage;
