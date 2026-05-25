import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import AEPLayout from '../../components/aep/AEPLayout';
import PageTabs from '../../components/aep/PageTabs';
import ChartContainer from '../../components/aep/ChartContainer';
import AnalyticsWidget from '../../components/aep/AnalyticsWidget';
import { SettingsIcon, MoreIcon } from '../../components/aep/icons';
import useResponsiveChart from '../../hooks/useResponsiveChart';
import { identityNamespaces, COLORS, identityGraphSamples, identityGraphTrend } from '../../data/platformData';
import DataTable from '../../components/aep/DataTable';
import KpiGrid from '../../components/aep/KpiGrid';
import StatusPill from '../../components/aep/StatusPill';
import {
  identityNamespacesList, getSimulationResult,
} from '../../data/dropdownData';

const IDENTITY_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'namespaces', label: 'Namespaces' },
  { id: 'graph', label: 'Graph Viewer' },
  { id: 'simulation', label: 'Graph Simulation' },
];

const identityTrend = [
  { date: 'Apr 26', count: 1480 }, { date: 'May 03', count: 1495 },
  { date: 'May 10', count: 1500 }, { date: 'May 17', count: 1505 },
];

const graphTrend = [
  { date: 'Apr 26', count: 740 }, { date: 'May 03', count: 745 },
  { date: 'May 10', count: 748 }, { date: 'May 17', count: 750 },
];

const identityByNamespace = [
  { name: 'crmid123', value: 680 }, { name: 'loyaltyid', value: 670 }, { name: 'ecid', value: 420 },
  { name: 'email', value: 380 }, { name: 'phone', value: 290 }, { name: 'userid', value: 250 },
];

const graphBySize = [
  { name: '2', value: 720 }, { name: '3', value: 20 }, { name: '4', value: 8 }, { name: '5', value: 2 },
];

const graphsMultiIdentity = [
  { name: 'ecid', value: 520 }, { name: 'crmid123', value: 480 }, { name: 'loyaltyid', value: 420 },
  { name: 'email', value: 310 }, { name: 'phone', value: 280 },
];

const IdentitiesPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [simNsA, setSimNsA] = useState('ecid');
  const [simNsB, setSimNsB] = useState('email');
  const { tick, tickSmall, yAxisWidth, barSize, chartMargin } = useResponsiveChart();

  const simulation = getSimulationResult(simNsA, simNsB);

  return (
    <AEPLayout>
      <div className="aep-page">
        <div className="aep-page-header-row stagger-1">
          <h1 className="aep-page-title">Field mapping</h1>
          <p className="aep-page-subtitle">Map source fields to canonical schema namespaces for data standardization.</p>
          <button type="button" className="aep-btn aep-btn-primary">+ Create identity namespace</button>
        </div>

        <PageTabs
          tabs={IDENTITY_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          rightContent={<button type="button" className="aep-btn"><SettingsIcon /> Settings</button>}
        />

        {activeTab === 'overview' && (
          <>
            <p className="aep-info-text stagger-2">Metrics are updated daily based on identity graph data.</p>
            <div className="aep-quick-stats stagger-2" style={{ marginBottom: 20 }}>
              <div className="aep-quick-stat" style={{ '--stat-index': 0 }}><span className="aep-quick-stat-icon">🔑</span><div><div className="aep-quick-stat-value">1,505</div><div className="aep-quick-stat-label">Total identities</div></div></div>
              <div className="aep-quick-stat" style={{ '--stat-index': 1 }}><span className="aep-quick-stat-icon">🔗</span><div><div className="aep-quick-stat-value">750</div><div className="aep-quick-stat-label">Identity graphs</div></div></div>
              <div className="aep-quick-stat" style={{ '--stat-index': 2 }}><span className="aep-quick-stat-icon">📊</span><div><div className="aep-quick-stat-value">10</div><div className="aep-quick-stat-label">Namespaces</div></div></div>
              <div className="aep-quick-stat" style={{ '--stat-index': 3 }}><span className="aep-quick-stat-icon">✅</span><div><div className="aep-quick-stat-value">99.7%</div><div className="aep-quick-stat-label">Match rate</div></div></div>
            </div>
            <div className="aep-widget-grid stagger-3">
              <div className="aep-widget" style={{ '--widget-index': 0 }}>
                <div className="aep-widget-header"><span className="aep-card-title">Identity count trend</span><MoreIcon /></div>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={identityTrend} margin={chartMargin}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" tick={{ fontSize: tick }} /><YAxis domain={[0, 1600]} tick={{ fontSize: tick }} width={40} /><Tooltip /><Line type="monotone" dataKey="count" stroke={COLORS.teal} strokeWidth={2} dot={false} /></LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="aep-widget" style={{ '--widget-index': 1 }}>
                <div className="aep-widget-header"><span className="aep-card-title">Graph count trend</span><MoreIcon /></div>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={graphTrend} margin={chartMargin}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" tick={{ fontSize: tick }} /><YAxis domain={[0, 800]} tick={{ fontSize: tick }} width={40} /><Tooltip /><Line type="monotone" dataKey="count" stroke={COLORS.teal} strokeWidth={2} dot={false} /></LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="aep-widget" style={{ '--widget-index': 2 }}>
                <div className="aep-widget-header"><span className="aep-card-title">Identity count by namespace</span><MoreIcon /></div>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={identityByNamespace} layout="vertical" margin={chartMargin}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" domain={[0, 700]} tick={{ fontSize: tickSmall }} /><YAxis type="category" dataKey="name" width={yAxisWidth} tick={{ fontSize: tickSmall }} /><Tooltip /><Bar dataKey="value" fill={COLORS.teal} barSize={barSize} radius={[0, 4, 4, 0]} /></BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="aep-widget" style={{ '--widget-index': 3 }}>
                <div className="aep-widget-header"><span className="aep-card-title">Graph count by graph size</span><MoreIcon /></div>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={graphBySize} layout="vertical" margin={chartMargin}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" tick={{ fontSize: tickSmall }} /><YAxis type="category" dataKey="name" width={36} tick={{ fontSize: tickSmall }} /><Tooltip /><Bar dataKey="value" fill={COLORS.teal} barSize={barSize + 4} radius={[0, 4, 4, 0]} /></BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="aep-widget" style={{ '--widget-index': 4 }}>
                <div className="aep-widget-header"><span className="aep-card-title">Graphs with multiple identities</span><MoreIcon /></div>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={graphsMultiIdentity} layout="vertical" margin={chartMargin}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" tick={{ fontSize: tickSmall }} /><YAxis type="category" dataKey="name" width={yAxisWidth} tick={{ fontSize: tickSmall }} /><Tooltip /><Bar dataKey="value" fill={COLORS.teal} barSize={barSize} radius={[0, 4, 4, 0]} /></BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'namespaces' && (
          <div className="aep-datalake-section aep-tab-content">
            <div className="aep-data-table aep-section-table">
              <div className="aep-data-table-header aep-section-table-header">
                <span>Name</span><span>Symbol</span><span>Count</span><span>Type</span>
              </div>
              {identityNamespaces.map((ns, i) => (
                <div key={ns.name} className="aep-data-table-row aep-section-table-row" style={{ '--row-index': i }}>
                  <span className="aep-recent-name">{ns.name}</span>
                  <span>{ns.symbol}</span>
                  <span className="aep-data-value">{ns.count}</span>
                  <span className="aep-status-pill active">{ns.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'graph' && (
          <div className="aep-datalake-section aep-tab-content">
            <p className="aep-info-text">Identity graph viewer — 750 active graphs across 10 namespaces.</p>
            <KpiGrid
              variant="mini"
              items={[
                { label: 'Total graphs', value: '750' },
                { label: 'Avg identities/graph', value: '2.1' },
                { label: 'Graphs size 2', value: '720' },
                { label: 'Graphs size 3+', value: '30' },
              ]}
            />
            <div className="aep-widget-grid-2" style={{ marginTop: 20 }}>
              <AnalyticsWidget title="Graph growth trend">
                <ChartContainer size="sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={identityGraphTrend} margin={chartMargin}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: tick }} />
                      <YAxis tick={{ fontSize: tick }} width={42} domain={[700, 760]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="graphs" stroke={COLORS.teal} strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </AnalyticsWidget>
              <div className="aep-widget">
                <div className="aep-widget-header"><span className="aep-card-title">Recent identity graphs</span></div>
                <DataTable
                  scroll={false}
                  columns={[
                    { key: 'graphId', label: 'Graph ID', cellClass: 'aep-recent-name' },
                    { key: 'size', label: 'Size' },
                    { key: 'namespaces', label: 'Namespaces' },
                    { key: 'status', label: 'Status', render: (row) => <StatusPill status={row.status} /> },
                  ]}
                  rows={identityGraphSamples.slice(0, 5)}
                  rowKey="graphId"
                  className="aep-data-table-compact"
                  emptyMessage="No graphs available"
                />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <DataTable
                columns={[
                  { key: 'graphId', label: 'Graph ID', cellClass: 'aep-recent-name' },
                  { key: 'size', label: 'Size' },
                  { key: 'namespaces', label: 'Namespaces' },
                  { key: 'lastUpdated', label: 'Updated', cellClass: 'aep-recent-meta' },
                  { key: 'status', label: 'Status', render: (row) => <StatusPill status={row.status} /> },
                ]}
                rows={identityGraphSamples}
                rowKey="graphId"
                rowClassName="aep-section-table-row aep-section-table-row-5"
                headerClassName="aep-section-table-header aep-section-table-row-5"
                emptyMessage="No identity graphs found"
              />
            </div>
          </div>
        )}

        {activeTab === 'simulation' && (
          <div className="aep-datalake-section aep-tab-content">
            <div className="aep-toolbar" style={{ paddingTop: 0 }}>
              <div className="aep-toolbar-left">
                Simulate namespace:
                <select
                  className="aep-select"
                  value={simNsA}
                  onChange={(e) => {
                    const next = e.target.value;
                    setSimNsA(next);
                    if (next === simNsB) {
                      setSimNsB(identityNamespacesList.find((ns) => ns !== next) || 'email');
                    }
                  }}
                  aria-label="Primary namespace"
                >
                  {identityNamespacesList.map((ns) => <option key={ns} value={ns}>{ns}</option>)}
                </select>
                with
                <select className="aep-select" value={simNsB} onChange={(e) => setSimNsB(e.target.value)} aria-label="Secondary namespace">
                  {identityNamespacesList.filter((ns) => ns !== simNsA).map((ns) => <option key={ns} value={ns}>{ns}</option>)}
                </select>
              </div>
              <button type="button" className="aep-btn aep-btn-primary">Run simulation</button>
            </div>
            <KpiGrid variant="mini" items={[
              { label: 'Estimated overlap', value: simulation.overlap.toLocaleString('en-US') },
              { label: 'Overlap rate', value: simulation.overlapRate },
              { label: 'Unique profiles', value: simulation.uniqueProfiles.toLocaleString('en-US') },
              { label: 'Confidence', value: simulation.confidence },
            ]} className="aep-data-transition" key={`${simNsA}-${simNsB}`} />
          </div>
        )}
      </div>
    </AEPLayout>
  );
};

export default IdentitiesPage;
