import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import AEPLayout from '../../components/aep/AEPLayout';
import { IngestIcon, FingerprintIcon, UserIcon, TargetIcon, ExportIcon, InfoIcon } from '../../components/aep/icons';
import { monitoringMetrics, COLORS } from '../../data/platformData';

const cardConfig = {
  datalake: {
    icon: IngestIcon, title: 'Data lake',
    metrics: (d) => [
      ['Records received', d.received], ['Records ingested', d.ingested],
      ['Records failed', d.failed], ['Records deleted', d.deleted], ['Records updated', d.updated],
    ],
  },
  identities: {
    icon: FingerprintIcon, title: 'Identities',
    metrics: (d) => [
      ['Records received', d.received], ['Records ingested', d.ingested], ['Success rate', d.successRate],
    ],
  },
  profiles: {
    icon: UserIcon, title: 'Profiles',
    metrics: (d) => [
      ['Records received', d.received], ['Profile fragments created', d.created],
      ['Profile fragments updated', d.updated], ['Success rate', d.successRate],
    ],
  },
  destinations: {
    icon: ExportIcon, title: 'Destinations',
    metrics: (d) => [
      ['Streaming activation rate', d.streamingRate], ['Batch failed dataflow runs', d.batchFailed],
    ],
  },
};

const MonitoringPage = () => {
  const [selectedCard, setSelectedCard] = useState('datalake');
  const [metricsOn, setMetricsOn] = useState(true);
  const data = monitoringMetrics;

  const renderDetail = () => {
    if (selectedCard === 'datalake') {
      return (
        <div className="aep-datalake-section">
          <div className="aep-datalake-header">
            <div className="aep-datalake-title">Data lake <InfoIcon /> <a href="#sources">| All sources</a></div>
            <div className="aep-toolbar-right">
              <select className="aep-select" defaultValue="24h"><option>Last 24 hours</option></select>
              <div className="aep-toggle">
                <div className={`aep-toggle-switch${metricsOn ? ' on' : ''}`} onClick={() => setMetricsOn(!metricsOn)} role="switch" aria-checked={metricsOn} />
                Metrics and graphs
              </div>
            </div>
          </div>
          {metricsOn && (
            <div className="aep-chart-panels">
              <div className="aep-chart-panel">
                <div className="aep-chart-panel-title">Processing Rate <span className="aep-panel-badge">Peak 5.2K/hr</span></div>
                <div className="aep-widget-chart" style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.datalake.processingRate}>
                      <defs>
                        <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="rate" stroke={COLORS.blue} fill="url(#rateGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="aep-chart-panel">
                <div className="aep-chart-panel-title">Records deleted <span className="aep-panel-badge">Total 330</span></div>
                <div className="aep-widget-chart" style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.datalake.recordsDeleted}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS.teal} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedCard === 'identities') {
      return (
        <div className="aep-datalake-section">
          <div className="aep-datalake-title" style={{ marginBottom: 16 }}>Identity ingestion trend</div>
          <div className="aep-widget-chart" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.identities.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [v.toLocaleString(), 'Records']} />
                <Line type="monotone" dataKey="count" stroke={COLORS.teal} strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (selectedCard === 'profiles') {
      return (
        <div className="aep-datalake-section">
          <div className="aep-datalake-title" style={{ marginBottom: 16 }}>Profile fragment activity</div>
          <div className="aep-widget-chart" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.profiles.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="created" fill={COLORS.blue} name="Created" radius={[4, 4, 0, 0]} />
                <Bar dataKey="updated" fill={COLORS.teal} name="Updated" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (selectedCard === 'destinations') {
      return (
        <div className="aep-datalake-section">
          <div className="aep-datalake-title" style={{ marginBottom: 16 }}>Destination connectors</div>
          <div className="aep-data-table">
            <div className="aep-data-table-header">
              <span>Connector</span><span>Success rate</span><span>Volume</span>
            </div>
            {data.destinations.connectors.map((c) => (
              <div key={c.name} className="aep-data-table-row">
                <span>{c.name}</span>
                <span className="aep-status-pill active">{c.success}</span>
                <span className="aep-data-value">{c.volume}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <AEPLayout sidebarVariant="monitoring">
      <div className="aep-page">
        <h1 className="aep-page-title">Monitoring</h1>
        <div className="aep-tabs">
          <button type="button" className="aep-tab active">Dashboard</button>
          <button type="button" className="aep-tab">Batch end-to-end</button>
          <button type="button" className="aep-tab">Streaming end-to-end</button>
          <button type="button" className="aep-tab">Edge</button>
        </div>
        <div className="aep-toolbar" style={{ paddingTop: 12 }}>
          <div className="aep-toolbar-left">
            Data type: <select className="aep-select" defaultValue="all"><option value="all">All</option></select>
          </div>
        </div>
        <div className="aep-section-label">Data ingestion and retention</div>
        <div className="aep-monitoring-cards">
          {['datalake', 'identities', 'profiles'].map((key) => {
            const cfg = cardConfig[key];
            const Icon = cfg.icon;
            const m = data[key];
            return (
              <div
                key={key}
                className={`aep-monitoring-card${selectedCard === key ? ' selected' : ''}`}
                onClick={() => setSelectedCard(key)}
                role="button"
                tabIndex={0}
              >
                <div className="aep-monitoring-card-header"><Icon /> {cfg.title}</div>
                {cfg.metrics(m).map(([label, val]) => (
                  <div key={label} className="aep-monitoring-metric"><span>{label}</span><span>{val}</span></div>
                ))}
              </div>
            );
          })}
          <div
            className={`aep-monitoring-card${selectedCard === 'audiences' ? ' selected' : ''}`}
            onClick={() => setSelectedCard('audiences')}
            role="button"
            tabIndex={0}
          >
            <div className="aep-monitoring-card-header"><TargetIcon /> Audiences</div>
            <div style={{ fontSize: 12, color: '#6e6e6e', marginBottom: 4 }}>Last evaluation job</div>
            <div className="aep-status-dot failed">Failed 05/20/2026, 10:18 AM</div>
            <div style={{ fontSize: 12, color: '#6e6e6e', marginTop: 8, marginBottom: 4 }}>Last export job</div>
            <div className="aep-status-dot success">Success 04/19/2026, 10:30 AM</div>
          </div>
          <div
            className={`aep-monitoring-card${selectedCard === 'destinations' ? ' selected' : ''}`}
            onClick={() => setSelectedCard('destinations')}
            role="button"
            tabIndex={0}
          >
            <div className="aep-monitoring-card-header"><ExportIcon /> Destinations</div>
            {cardConfig.destinations.metrics(data.destinations).map(([label, val]) => (
              <div key={label} className="aep-monitoring-metric"><span>{label}</span><span>{val}</span></div>
            ))}
          </div>
        </div>
        <div className="aep-status-footer">Status shown as of May 20, 2026, 9:03 PM</div>
        {selectedCard !== 'audiences' && renderDetail()}
        {selectedCard === 'audiences' && (
          <div className="aep-datalake-section">
            <div className="aep-datalake-title" style={{ marginBottom: 16 }}>Audience job history</div>
            <div className="aep-data-table">
              <div className="aep-data-table-header"><span>Job</span><span>Status</span><span>Time</span></div>
              <div className="aep-data-table-row"><span>Customer evaluation</span><span className="aep-status-pill failed">Failed</span><span>05/20/2026 10:18 AM</span></div>
              <div className="aep-data-table-row"><span>Customer export</span><span className="aep-status-pill active">Success</span><span>04/19/2026 10:30 AM</span></div>
              <div className="aep-data-table-row"><span>Segment refresh</span><span className="aep-status-pill active">Success</span><span>05/19/2026 6:00 AM</span></div>
              <div className="aep-data-table-row"><span>Lookalike build</span><span className="aep-status-pill active">Success</span><span>05/18/2026 2:15 PM</span></div>
            </div>
          </div>
        )}
      </div>
    </AEPLayout>
  );
};

export default MonitoringPage;
