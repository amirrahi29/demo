import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import AEPLayout from '../../components/aep/AEPLayout';
import PageTabs from '../../components/aep/PageTabs';
import ChartContainer from '../../components/aep/ChartContainer';
import { SettingsIcon, InfoIcon } from '../../components/aep/icons';
import { useResponsiveChart } from '../../DEF';
import {
  namespaceOverlapData, profileBrowseList, mergePolicies, COLORS,
  unionSchemaData, computedAttributes,
} from '../../data/platformData';
import DataTable from '../../components/aep/DataTable';
import KpiGrid from '../../components/aep/KpiGrid';
import StatusPill from '../../components/aep/StatusPill';
import {
  mergePolicyProfiles, profileTrendRanges,
  MERGE_POLICY_OPTIONS, PROFILE_TREND_OPTIONS,
} from '../../data/dropdownData';

const PROFILE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'browse', label: 'Browse' },
  { id: 'merge', label: 'Merge Policies' },
  { id: 'union', label: 'Union Schema' },
  { id: 'computed', label: 'Computed attributes' },
];

const audienceOverlapReport = [
  { audience: 'High Value Customers', overlap: '67%', shared: '8.3K' },
  { audience: 'Email Subscribers', overlap: '45%', shared: '20.3K' },
  { audience: 'Cart Abandoners', overlap: '52%', shared: '4.5K' },
  { audience: 'Product Viewers', overlap: '38%', shared: '8.8K' },
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
  const [activeTab, setActiveTab] = useState('overview');
  const [mergePolicy, setMergePolicy] = useState('default');
  const [trendRange, setTrendRange] = useState('12m');
  const [nsLeft, setNsLeft] = useState('ecid');
  const [nsRight, setNsRight] = useState('email');
  const [viewSql, setViewSql] = useState(false);
  const { tick, tickSmall, yAxisWidth, barSize, chartMargin, isMobile } = useResponsiveChart();

  const policyData = mergePolicyProfiles[mergePolicy];
  const trendConfig = profileTrendRanges[trendRange];
  const trendMax = Math.max(...trendConfig.data.map((d) => d.count), 100);

  const overlapCount = useMemo(() => {
    const map = namespaceOverlapData[nsLeft];
    if (map && map[nsRight] !== undefined) return map[nsRight];
    const reverse = namespaceOverlapData[nsRight];
    return reverse?.[nsLeft] ?? 67;
  }, [nsLeft, nsRight]);

  return (
    <AEPLayout>
      <div className="aep-page">
        <div className="aep-page-header-row stagger-1">
          <h1 className="aep-page-title">Profiles</h1>
        </div>
        <PageTabs
          tabs={PROFILE_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          rightContent={<button type="button" className="aep-btn"><SettingsIcon /> Settings</button>}
        />

        {activeTab === 'overview' && (
        <>
        <div className="aep-toolbar stagger-2">
          <div className="aep-toolbar-left">
            Profiles using merge policy
            <select
              className="aep-select"
              value={mergePolicy}
              onChange={(e) => setMergePolicy(e.target.value)}
              aria-label="Merge policy"
            >
              {MERGE_POLICY_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
            <span className="aep-toolbar-meta">Metrics based on export: {policyData.exportDate}</span>
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

        <div key={mergePolicy} className="aep-widget-grid aep-data-transition stagger-3">
          <div className="aep-widget" style={{ '--widget-index': 0 }}>
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
          <div className="aep-widget" style={{ '--widget-index': 1 }}>
            <div className="aep-widget-header">
              <span className="aep-card-title">Profile count with 1+ identity</span>
              <span className="aep-card-link">Captions</span>
            </div>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={policyData.profileCount1Plus} layout="vertical" margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 1000]} tick={{ fontSize: tickSmall }} />
                  <YAxis type="category" dataKey="name" width={yAxisWidth} tick={{ fontSize: tickSmall }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.teal} barSize={barSize} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="aep-widget" style={{ '--widget-index': 2 }}>
            <div className="aep-widget-header">
              <span className="aep-card-title">Profile count with 1 identity</span>
              <span className="aep-card-link">Captions</span>
            </div>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={policyData.profileCount1} layout="vertical" margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 350]} tick={{ fontSize: tickSmall }} />
                  <YAxis type="category" dataKey="name" width={yAxisWidth} tick={{ fontSize: tickSmall }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.teal} barSize={barSize} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div key={`${mergePolicy}-row2`} className="aep-widget-grid aep-data-transition stagger-4">
          <div className="aep-widget" style={{ '--widget-index': 0 }}>
            <div className="aep-widget-header">
              <span className="aep-card-title">Profile count trend</span>
              <span className="aep-card-link">Captions</span>
            </div>
            <div className="aep-widget-controls">
              <select
                className="aep-select"
                value={trendRange}
                onChange={(e) => setTrendRange(e.target.value)}
                aria-label="Trend time range"
              >
                {PROFILE_TREND_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
            <ChartContainer key={trendRange}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendConfig.data} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey={trendConfig.xKey} tick={{ fontSize: tick }} />
                  <YAxis domain={[0, Math.ceil(trendMax * 1.1)]} tick={{ fontSize: tick }} width={42} />
                  <Tooltip />
                  <Line type="stepAfter" dataKey="count" stroke={COLORS.blue} strokeWidth={2} dot={{ r: isMobile ? 3 : 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="aep-widget" style={{ '--widget-index': 1 }}>
            <div className="aep-widget-header">
              <span className="aep-card-title">Customer AI distribution of scores</span>
            </div>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={policyData.profileAiScores} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: tickSmall }} interval={0} angle={isMobile ? -20 : 0} textAnchor={isMobile ? 'end' : 'middle'} height={isMobile ? 48 : 30} />
                  <YAxis tick={{ fontSize: tickSmall }} width={42} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {policyData.profileAiScores.map((_, i) => <Cell key={i} fill={SCORE_COLORS[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="aep-widget" style={{ '--widget-index': 2 }}>
            <div className="aep-widget-header">
              <span className="aep-card-title">Audience overlap by merge policy</span>
            </div>
            <div className="aep-data-table aep-data-table-compact">
              {policyData.audienceOverlap.map((row) => (
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

        <div className="aep-widget-grid-2 stagger-5">
          <div className="aep-widget" style={{ '--widget-index': 0 }}>
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
          <div className="aep-widget" style={{ '--widget-index': 1 }}>
            <div className="aep-widget-header">
              <span className="aep-card-title">Customer AI scoring summary</span>
            </div>
            <div className="aep-mini-kpi-grid">
              {policyData.aiScoringSummary.map((item) => (
                <div key={item.label} className="aep-mini-kpi">
                  <div className="aep-mini-kpi-value">{item.value}</div>
                  <div className="aep-mini-kpi-label">{item.label}</div>
                  <div className={`aep-kpi-trend${Number(item.change) >= 0 ? ' up' : ' down'}`}>{item.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </>
        )}

        {activeTab === 'browse' && (
          <div className="aep-datalake-section aep-tab-content">
            <DataTable
              columns={[
                { key: 'id', label: 'Profile ID', cellClass: 'aep-recent-name' },
                { key: 'namespace', label: 'Namespace' },
                { key: 'identities', label: 'Identities' },
                { key: 'updated', label: 'Updated', cellClass: 'aep-recent-meta' },
              ]}
              rows={profileBrowseList}
              rowKey="id"
              emptyMessage="No profiles found"
            />
          </div>
        )}

        {activeTab === 'merge' && (
          <div className="aep-datalake-section aep-tab-content">
            <DataTable
              columns={[
                { key: 'name', label: 'Policy name', cellClass: 'aep-recent-name' },
                { key: 'priority', label: 'Priority' },
                { key: 'status', label: 'Status', render: (row) => <StatusPill status={row.status} /> },
                { key: 'profiles', label: 'Profiles', cellClass: 'aep-data-value' },
              ]}
              rows={mergePolicies}
              emptyMessage="No merge policies configured"
            />
          </div>
        )}

        {activeTab === 'union' && (
          <div className="aep-datalake-section aep-tab-content">
            <p className="aep-info-text">Union schema combines attributes from all profile-enabled schemas.</p>
            <KpiGrid variant="mini" items={unionSchemaData.kpis} className="aep-data-transition" />
            <div style={{ marginTop: 20 }}>
              <DataTable
                columns={[
                  { key: 'name', label: 'Field path', cellClass: 'aep-recent-name' },
                  { key: 'type', label: 'Type' },
                  { key: 'source', label: 'Source' },
                  { key: 'status', label: 'Status', render: (row) => <StatusPill status={row.status} /> },
                ]}
                rows={unionSchemaData.fields}
                emptyMessage="No union schema fields"
              />
            </div>
          </div>
        )}

        {activeTab === 'computed' && (
          <div className="aep-datalake-section aep-tab-content">
            <DataTable
              columns={[
                { key: 'name', label: 'Attribute', cellClass: 'aep-recent-name' },
                { key: 'type', label: 'Type' },
                { key: 'status', label: 'Status', render: (row) => <StatusPill status={row.status} /> },
                { key: 'profiles', label: 'Profiles', cellClass: 'aep-data-value' },
                { key: 'lastRun', label: 'Last run', cellClass: 'aep-recent-meta' },
              ]}
              rows={computedAttributes}
              rowClassName="aep-section-table-row aep-section-table-row-5"
              headerClassName="aep-section-table-header aep-section-table-row-5"
              emptyMessage="No computed attributes"
            />
          </div>
        )}
      </div>
    </AEPLayout>
  );
};

export default ProfilesPage;
