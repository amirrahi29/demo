import TealiumLayout from '../../components/tealium/TealiumLayout';
import { tealiumSources, monitoringMetrics } from '../../data/platformData';

const dataAccess = [
  { name: 'EventStore', status: 'Enabled', detail: '53 Linked Feeds', volume: '200K' },
  { name: 'EventDB', status: 'Enabled', detail: '12 partitions', volume: '400K' },
  { name: 'AudienceStore', status: 'Enabled', detail: 'Real-time sync', volume: '350K' },
  { name: 'AudienceDB', status: 'Enabled', detail: 'Batch export', volume: '500K' },
];

const connectors = [
  { name: 'Google Ads ID', success: '88.8k', failed: '24.8k', icon: 'G' },
  { name: 'DV Twitter', success: '45.2k', failed: '12.1k', icon: 'T' },
  { name: 'Drift (2)', success: '32.5k', failed: '8.4k', icon: 'D' },
  { name: 'Google Analytics (3)', success: '120.3k', failed: '15.6k', icon: 'GA' },
  { name: 'Google Sheets (2)', success: '18.7k', failed: '2.3k', icon: 'GS' },
  { name: 'Salesforce MC', success: '56.4k', failed: '3.2k', icon: 'SF' },
];

const DataSupplyChainPage = () => (
  <TealiumLayout>
    <div className="tealium-breadcrumb">Data Supply Chain &gt; <span>Overview</span></div>

    <div className="tealium-summary-row">
      <div className="tealium-summary-card"><span className="tealium-summary-value">98.4%</span><span className="tealium-summary-label">Ingestion success</span></div>
      <div className="tealium-summary-card"><span className="tealium-summary-value">{monitoringMetrics.datalake.received}</span><span className="tealium-summary-label">Events today</span></div>
      <div className="tealium-summary-card"><span className="tealium-summary-value">19</span><span className="tealium-summary-label">Active connectors</span></div>
      <div className="tealium-summary-card"><span className="tealium-summary-value">7</span><span className="tealium-summary-label">Running jobs</span></div>
    </div>

    <div className="tealium-page-header">
      <div className="tealium-filters">
        <button type="button" className="tealium-pill active">All Products</button>
        <button type="button" className="tealium-pill">EventStream</button>
        <button type="button" className="tealium-pill">AudienceStream</button>
        <button type="button" className="tealium-pill">DataAccess</button>
        <select className="tealium-time-select" defaultValue="1h">
          <option value="1h">within Last Hour</option>
          <option value="24h">within Last 24 Hours</option>
        </select>
      </div>
    </div>

    <div className="tealium-flow">
      <div className="tealium-flow-step">
        <div className="tealium-flow-icon">🌐</div>
        <div className="tealium-flow-label">Data Sources</div>
        <div className="tealium-flow-value">10 Sources</div>
      </div>
      <div className="tealium-flow-arrow">→</div>
      <div className="tealium-flow-step">
        <div className="tealium-flow-icon">📥</div>
        <div className="tealium-flow-label">Events Received</div>
        <div className="tealium-flow-value">432.4k</div>
      </div>
      <div className="tealium-flow-arrow">→</div>
      <div className="tealium-flow-step">
        <div className="tealium-flow-icon">📦</div>
        <div className="tealium-flow-label">Events Inspected</div>
        <div className="tealium-inspected">
          <span className="green">342</span><span>/</span>
          <span className="yellow">22</span><span>/</span>
          <span className="red">2.3k</span>
        </div>
      </div>
      <div className="tealium-flow-arrow">→</div>
      <div className="tealium-flow-step">
        <div className="tealium-flow-icon">⚡</div>
        <div className="tealium-flow-label">Actions Triggered</div>
        <div className="tealium-flow-value">59.7M / 62.3M</div>
      </div>
      <div className="tealium-flow-arrow">→</div>
      <div className="tealium-flow-step">
        <div className="tealium-flow-icon">🔌</div>
        <div className="tealium-flow-label">Connectors</div>
        <div className="tealium-flow-value">19 · 18 active</div>
      </div>
    </div>

    <div className="tealium-tables">
      <div className="tealium-table-card">
        <div className="tealium-table-header">Sources</div>
        <div className="tealium-table-subheader"><span>Data Sources</span><span>Volume · Trend</span></div>
        {tealiumSources.map((src) => (
          <div key={src.name} className="tealium-table-row">
            <div className="tealium-row-name">
              <span className="tealium-row-icon">{src.icon}</span>
              {src.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="tealium-sparkline" />
              <span className="tealium-volume">{src.volume}</span>
              <span className={`tealium-trend${src.trend.startsWith('+') ? ' up' : ' down'}`}>{src.trend}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="tealium-table-card">
        <div className="tealium-table-header">Destinations</div>
        <div className="tealium-section-title">DataAccess</div>
        {dataAccess.map((item) => (
          <div key={item.name} className="tealium-table-row">
            <div className="tealium-row-name">
              <span className="tealium-row-icon">💾</span>
              <div><div>{item.name}</div>{item.detail && <div style={{ fontSize: 11, color: '#78909c' }}>{item.detail}</div>}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="tealium-status-enabled">{item.status}</div>
              <div className="tealium-volume">{item.volume}</div>
            </div>
          </div>
        ))}
        <div className="tealium-section-title">Connectors</div>
        <div className="tealium-connector-header"><span>Connectors</span><span className="tealium-dot-green">Success</span><span className="tealium-dot-red">Failed</span></div>
        {connectors.map((c) => (
          <div key={c.name} className="tealium-connector-row">
            <div className="tealium-row-name"><span className="tealium-row-icon">{c.icon}</span>{c.name}</div>
            <span>{c.success}</span><span>{c.failed}</span>
          </div>
        ))}
      </div>
    </div>
  </TealiumLayout>
);

export default DataSupplyChainPage;
