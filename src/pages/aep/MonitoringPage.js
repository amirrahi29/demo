import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import AEPLayout from '../../components/aep/AEPLayout';
import PageTabs from '../../components/aep/PageTabs';
import ChartContainer from '../../components/aep/ChartContainer';
import { IngestIcon, FingerprintIcon, UserIcon, TargetIcon, ExportIcon, InfoIcon } from '../../components/aep/icons';
import { useResponsiveChart } from '../../DEF';
import {
  monitoringBatchJobs, monitoringStreaming, monitoringEdge, COLORS,
  monitoringAudienceJobs,
} from '../../data/platformData';
import DataTable from '../../components/aep/DataTable';
import StatusPill from '../../components/aep/StatusPill';
import MiniSparkline from '../../components/charts/MiniSparkline';
import {
  monitoringTimeRanges, monitoringDataTypes,
  MONITORING_TIME_OPTIONS, MONITORING_TYPE_OPTIONS,
} from '../../data/dropdownData';
import '../../styles/monitoring.css';

const MONITORING_TABS = [
  { id: 'dashboard', label: 'Overview' },
  { id: 'batch', label: 'Batch end-to-end' },
  { id: 'streaming', label: 'Streaming end-to-end' },
  { id: 'edge', label: 'Edge network' },
];

const cardConfig = {
  datalake: {
    icon: IngestIcon,
    title: 'Batch ingestion',
    subtitle: 'Data lake landing zone',
    color: '#1473e6',
    health: 'healthy',
    primary: (d) => ({ label: 'Records ingested', value: d.ingested }),
    successRate: 98.4,
    metrics: (d) => [
      ['Records received', d.received],
      ['Failed records', d.failed, true],
      ['Records updated', d.updated],
      ['Records deleted', d.deleted],
    ],
  },
  identities: {
    icon: FingerprintIcon,
    title: 'Identity resolution',
    subtitle: 'Namespace matching & graph',
    color: '#6e49cb',
    health: 'healthy',
    primary: (d) => ({ label: 'Success rate', value: d.successRate }),
    successRate: 99.7,
    metrics: (d) => [
      ['Records received', d.received],
      ['Records ingested', d.ingested],
    ],
  },
  profiles: {
    icon: UserIcon,
    title: 'Profile fragments',
    subtitle: 'Unified profile assembly',
    color: '#2d9d78',
    health: 'healthy',
    primary: (d) => ({ label: 'Success rate', value: d.successRate }),
    successRate: 99.2,
    metrics: (d) => [
      ['Records received', d.received],
      ['Fragments created', d.created],
      ['Fragments updated', d.updated],
    ],
  },
  destinations: {
    icon: ExportIcon,
    title: 'Landing zones',
    subtitle: 'Publish & activation',
    color: '#e68619',
    health: 'healthy',
    primary: (d) => ({ label: 'Streaming activation', value: d.streamingRate }),
    successRate: 97.8,
    metrics: (d) => [
      ['Batch failed runs', d.batchFailed, true],
    ],
  },
  audiences: {
    icon: TargetIcon,
    title: 'Validation jobs',
    subtitle: 'Schema & quality checks',
    color: '#e34850',
    health: 'warning',
    primary: () => ({ label: 'Last evaluation', value: 'Failed' }),
    successRate: 72,
    metrics: () => [
      ['Last run', '05/20/2026 10:18 AM'],
      ['Export job', 'Success 04/19/2026'],
    ],
  },
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="aep-chart-tooltip">
      <div className="aep-chart-tooltip-label">{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className="aep-chart-tooltip-row">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <strong>{typeof entry.value === 'number' ? entry.value.toLocaleString('en-US') : entry.value}</strong>
        </div>
      ))}
    </div>
  );
};

const MonitoringCard = ({
  cardKey, cfg, metrics, selected, onSelect, index, health,
}) => {
  const Icon = cfg.icon;
  const primary = cfg.primary(metrics);

  return (
    <button
      type="button"
      className={`mon-pipeline-tile${selected ? ' active' : ''}`}
      style={{ '--tile-accent': cfg.color, '--card-index': index }}
      onClick={() => onSelect(cardKey)}
      aria-pressed={selected}
    >
      <div className="mon-pipeline-tile-top">
        <div className="mon-pipeline-tile-icon"><Icon /></div>
        <span className={`mon-pipeline-tile-health ${health}`}>{health}</span>
      </div>
      <div className="mon-pipeline-tile-name">{cfg.title}</div>
      <div className="mon-pipeline-tile-metric">{primary.value}</div>
      <div className="mon-pipeline-tile-sub">{primary.label}</div>
    </button>
  );
};

const MonitoringPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCard, setSelectedCard] = useState('datalake');
  const [timeRange, setTimeRange] = useState('24h');
  const [dataType, setDataType] = useState('all');
  const [metricsOn, setMetricsOn] = useState(true);
  const { tick, tickSmall, chartMargin, legendProps, showDualAxis, isMobile } = useResponsiveChart();

  const rangeData = monitoringTimeRanges[timeRange];
  const typeConfig = monitoringDataTypes[dataType];
  const visibleCards = typeConfig.cards;

  const getCardMetrics = (key) => {
    if (key === 'datalake') return rangeData.datalake;
    if (key === 'identities') return rangeData.identities;
    if (key === 'profiles') return rangeData.profiles;
    if (key === 'destinations') return rangeData.destinations;
    return monitoringTimeRanges['24h'].destinations;
  };

  const heroKpis = useMemo(() => [
    { icon: '📥', label: 'Records received', value: rangeData.datalake.received, trend: '+8.4%', trendUp: true, accent: '#1473e6' },
    { icon: '✅', label: 'Successfully ingested', value: rangeData.datalake.ingested, trend: '98.4%', trendUp: true, accent: '#2d9d78' },
    { icon: '⚠️', label: 'Failed / quarantined', value: rangeData.datalake.failed, trend: '-12%', trendUp: true, accent: '#e34850' },
    { icon: '⚡', label: 'Peak throughput', value: rangeData.badge.rate.replace('Peak ', ''), trend: 'Live', neutral: true, accent: '#6e49cb' },
  ], [rangeData]);

  const successTrend = useMemo(
    () => rangeData.datalake.processingRate.map((p, i) => ({
      hour: p.hour,
      rate: Number((98.2 + (i % 3) * 0.3 + (p.rate % 500) / 5000).toFixed(1)),
    })),
    [rangeData],
  );

  const throughputData = useMemo(
    () => rangeData.datalake.processingRate.map((p) => ({
      hour: p.hour,
      received: p.rate,
      ingested: Math.round(p.rate * 0.984),
      failed: Math.round(p.rate * 0.016),
    })),
    [rangeData],
  );

  let cardIndex = 0;

  const renderDatalakeDetail = () => {
    const d = rangeData.datalake;
    return (
      <div className="aep-monitoring-detail-panel">
        <div className="aep-monitoring-detail-head">
          <div>
            <div className="aep-monitoring-detail-title">
              Batch ingestion <InfoIcon />
            </div>
            <p className="aep-monitoring-detail-desc">
              Real-time view of records flowing into the data lake — throughput, success rate, and quarantine volume.
            </p>
          </div>
          <div className="aep-toolbar-right">
            <select
              className="aep-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              aria-label="Time range"
            >
              {MONITORING_TIME_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
            <div className="aep-toggle">
              <div
                className={`aep-toggle-switch${metricsOn ? ' on' : ''}`}
                onClick={() => setMetricsOn(!metricsOn)}
                role="switch"
                aria-checked={metricsOn}
                tabIndex={0}
              />
              Charts
            </div>
          </div>
        </div>

        <div className="aep-monitoring-stat-chips">
          <div className="aep-stat-chip"><span>Received</span><strong>{d.received}</strong></div>
          <div className="aep-stat-chip success"><span>Ingested</span><strong>{d.ingested}</strong></div>
          <div className="aep-stat-chip danger"><span>Failed</span><strong>{d.failed}</strong></div>
          <div className="aep-stat-chip"><span>Updated</span><strong>{d.updated}</strong></div>
          <div className="aep-stat-chip"><span>Deleted</span><strong>{d.deleted}</strong></div>
        </div>

        <div className="aep-monitoring-detail-body">
          <div className="aep-monitoring-funnel">
            {[
              { label: 'Received', value: d.received },
              { label: 'Ingested', value: d.ingested },
              { label: 'Failed', value: d.failed },
              { label: 'Updated', value: d.updated },
            ].map((step) => (
              <div key={step.label} className="aep-monitoring-funnel-step">
                <div className="aep-monitoring-funnel-value">{step.value}</div>
                <div className="aep-monitoring-funnel-label">{step.label}</div>
              </div>
            ))}
          </div>

          {metricsOn && (
            <div className="aep-monitoring-chart-grid aep-data-transition" key={timeRange}>
              <div className="aep-chart-panel" style={{ '--panel-index': 1 }}>
                <div className="aep-chart-panel-title">
                  Success rate trend <span className="aep-panel-badge">98.4% avg</span>
                </div>
                <ChartContainer size="sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={successTrend} margin={chartMargin}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f8" />
                      <XAxis dataKey="hour" tick={{ fontSize: tickSmall }} stroke="#959595" />
                      <YAxis domain={[96, 100]} tick={{ fontSize: tickSmall }} width={42} stroke="#959595" />
                      <Tooltip content={<ChartTooltip />} />
                      <Line type="monotone" dataKey="rate" name="Success %" stroke={COLORS.teal} strokeWidth={2} dot={{ r: isMobile ? 2 : 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="aep-chart-panel" style={{ '--panel-index': 2 }}>
                <div className="aep-chart-panel-title">
                  Quarantined records <span className="aep-panel-badge">{rangeData.badge.deleted}</span>
                </div>
                <ChartContainer size="sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rangeData.datalake.recordsDeleted} margin={chartMargin}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f8" />
                      <XAxis dataKey="hour" tick={{ fontSize: tickSmall }} stroke="#959595" />
                      <YAxis tick={{ fontSize: tickSmall }} width={42} stroke="#959595" />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="count" name="Deleted" fill={COLORS.orange} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCardDetail = () => {
    if (selectedCard === 'datalake') return renderDatalakeDetail();

    const titles = {
      identities: { title: 'Identity resolution', desc: 'Namespace matching throughput and ingestion success across identity graph.' },
      profiles: { title: 'Profile fragments', desc: 'Fragment creation and update activity for unified customer profiles.' },
      destinations: { title: 'Landing zones', desc: 'Connector activation rates and publish volume to downstream systems.' },
      audiences: { title: 'Validation jobs', desc: 'Schema validation and quality check job history.' },
    };

    if (selectedCard === 'identities') {
      const t = titles.identities;
      return (
        <div className="aep-monitoring-detail-panel">
          <div className="aep-monitoring-detail-head">
            <div>
              <div className="aep-monitoring-detail-title">{t.title}</div>
              <p className="aep-monitoring-detail-desc">{t.desc}</p>
            </div>
          </div>
          <div className="aep-monitoring-stat-chips">
            <div className="aep-stat-chip"><span>Received</span><strong>{rangeData.identities.received}</strong></div>
            <div className="aep-stat-chip success"><span>Ingested</span><strong>{rangeData.identities.ingested}</strong></div>
            <div className="aep-stat-chip success"><span>Success rate</span><strong>{rangeData.identities.successRate}</strong></div>
          </div>
          <div className="aep-monitoring-detail-body">
            <ChartContainer key={timeRange}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rangeData.identities.trend} margin={chartMargin}>
                  <defs>
                    <linearGradient id="idGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.purple || '#6e49cb'} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={COLORS.purple || '#6e49cb'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f8" />
                  <XAxis dataKey="day" tick={{ fontSize: tick }} stroke="#959595" />
                  <YAxis tick={{ fontSize: tick }} width={48} stroke="#959595" />
                  <Tooltip content={<ChartTooltip />} formatter={(v) => [Number(v).toLocaleString('en-US'), 'Records']} />
                  <Area type="monotone" dataKey="count" name="Records" stroke={COLORS.purple || '#6e49cb'} fill="url(#idGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      );
    }

    if (selectedCard === 'profiles') {
      const t = titles.profiles;
      return (
        <div className="aep-monitoring-detail-panel">
          <div className="aep-monitoring-detail-head">
            <div>
              <div className="aep-monitoring-detail-title">{t.title}</div>
              <p className="aep-monitoring-detail-desc">{t.desc}</p>
            </div>
          </div>
          <div className="aep-monitoring-stat-chips">
            <div className="aep-stat-chip"><span>Received</span><strong>{rangeData.profiles.received}</strong></div>
            <div className="aep-stat-chip success"><span>Created</span><strong>{rangeData.profiles.created}</strong></div>
            <div className="aep-stat-chip"><span>Updated</span><strong>{rangeData.profiles.updated}</strong></div>
          </div>
          <div className="aep-monitoring-detail-body">
            <ChartContainer key={timeRange}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rangeData.profiles.trend} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f8" />
                  <XAxis dataKey="day" tick={{ fontSize: tick }} stroke="#959595" />
                  <YAxis tick={{ fontSize: tick }} width={48} stroke="#959595" />
                  <Tooltip content={<ChartTooltip />} /><Legend {...legendProps} />
                  <Bar dataKey="created" fill={COLORS.blue} name="Created" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="updated" fill={COLORS.teal} name="Updated" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      );
    }

    if (selectedCard === 'destinations') {
      const t = titles.destinations;
      const dest = getCardMetrics('destinations');
      return (
        <div className="aep-monitoring-detail-panel">
          <div className="aep-monitoring-detail-head">
            <div>
              <div className="aep-monitoring-detail-title">{t.title}</div>
              <p className="aep-monitoring-detail-desc">{t.desc}</p>
            </div>
          </div>
          <div className="aep-monitoring-stat-chips">
            <div className="aep-stat-chip success"><span>Streaming rate</span><strong>{dest.streamingRate}</strong></div>
            <div className="aep-stat-chip danger"><span>Batch failures</span><strong>{dest.batchFailed}</strong></div>
          </div>
          <div className="aep-monitoring-detail-body">
            <div className="aep-data-table aep-section-table">
              <div className="aep-data-table-header aep-section-table-header">
                <span>Connector</span><span>Success rate</span><span>Volume</span>
              </div>
              {dest.connectors?.map((c) => (
                <div key={c.name} className="aep-data-table-row aep-section-table-row aep-section-table-row-3">
                  <span className="aep-recent-name">{c.name}</span>
                  <span><StatusPill status={c.success} /></span>
                  <span className="aep-data-value">{c.volume}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (selectedCard === 'audiences') {
      const t = titles.audiences;
      return (
        <div className="aep-monitoring-detail-panel">
          <div className="aep-monitoring-detail-head">
            <div>
              <div className="aep-monitoring-detail-title">{t.title}</div>
              <p className="aep-monitoring-detail-desc">{t.desc}</p>
            </div>
          </div>
          <div className="aep-monitoring-detail-body">
            <DataTable
              columns={[
                { key: 'name', label: 'Job', cellClass: 'aep-recent-name' },
                { key: 'status', label: 'Status', render: (row) => <StatusPill status={row.status} /> },
                { key: 'time', label: 'Time', cellClass: 'aep-recent-meta' },
              ]}
              rows={monitoringAudienceJobs}
              rowClassName="aep-section-table-row aep-section-table-row-3"
              headerClassName="aep-section-table-header aep-section-table-row-3"
              emptyMessage="No validation jobs"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  const renderDashboard = () => {
    const d = rangeData.datalake;
    const sparkData = rangeData.datalake.processingRate.map((p) => p.rate);

    return (
      <>
        <div className="mon-dash-header">
          <div className="mon-dash-header-left">
            <div className="mon-health-ring" aria-label="Pipeline health 98.4%">
              <span>98.4%</span>
            </div>
            <div className="mon-health-meta">
              <h2>Pipeline healthy</h2>
              <p>{rangeData.label} · All ingestion lanes operational</p>
            </div>
            <span className="mon-live-badge">Live</span>
          </div>
          <div className="mon-dash-filters">
            <select
              className="aep-select"
              value={dataType}
              onChange={(e) => {
                setDataType(e.target.value);
                const cards = monitoringDataTypes[e.target.value].cards;
                if (!cards.includes(selectedCard)) setSelectedCard(cards[0]);
              }}
              aria-label="Pipeline filter"
            >
              {MONITORING_TYPE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
            <select
              className="aep-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              aria-label="Time range"
            >
              {MONITORING_TIME_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mon-kpi-strip" key={`kpi-${timeRange}`}>
          {heroKpis.map((kpi, i) => (
            <div key={kpi.label} className="mon-kpi-tile" style={{ '--tile-index': i }}>
              <div
                className="mon-kpi-tile-icon"
                style={{ background: `${kpi.accent}14`, color: kpi.accent }}
              >
                {kpi.icon}
              </div>
              <div className="mon-kpi-tile-body">
                <div className="mon-kpi-tile-value">{kpi.value}</div>
                <div className="mon-kpi-tile-label">{kpi.label}</div>
                <div className={`mon-kpi-tile-trend${kpi.neutral ? '' : kpi.trendUp ? ' up' : ' down'}`}>
                  {kpi.trend}
                </div>
              </div>
              {i === 0 && (
                <div className="mon-kpi-tile-spark">
                  <MiniSparkline data={sparkData} color={kpi.accent} width={72} height={28} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mon-charts-layout" key={`charts-${timeRange}`}>
          <div className="mon-chart-panel">
            <div className="mon-chart-panel-head">
              <span className="mon-chart-panel-title">Ingestion throughput</span>
              <span className="mon-chart-panel-badge">{typeConfig.label}</span>
            </div>
            <ChartContainer size="md">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={throughputData} margin={chartMargin}>
                  <defs>
                    <linearGradient id="ingestGradMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="hour" tick={{ fontSize: tickSmall }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: tickSmall }} width={48} stroke="#9ca3af" />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend {...legendProps} />
                  <Area type="monotone" dataKey="received" name="Received" stroke={COLORS.blue} fill="url(#ingestGradMain)" strokeWidth={2} />
                  <Bar dataKey="ingested" name="Ingested" fill={COLORS.teal} radius={[3, 3, 0, 0]} barSize={isMobile ? 10 : 16} />
                  <Line type="monotone" dataKey="failed" name="Failed" stroke={COLORS.red} strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="mon-chart-panel">
            <div className="mon-chart-panel-head">
              <span className="mon-chart-panel-title">Processing rate</span>
              <span className="mon-chart-panel-badge">{rangeData.badge.rate}</span>
            </div>
            <ChartContainer size="sm">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rangeData.datalake.processingRate} margin={chartMargin}>
                  <defs>
                    <linearGradient id="rateGradSide" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.teal} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={COLORS.teal} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="hour" tick={{ fontSize: tickSmall }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: tickSmall }} width={42} stroke="#9ca3af" />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="rate" name="Records/hr" stroke={COLORS.teal} fill="url(#rateGradSide)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mon-side-stats">
              <div className="mon-side-stat">
                <div className="mon-side-stat-label">Ingested</div>
                <div className="mon-side-stat-value">{d.ingested}</div>
              </div>
              <div className="mon-side-stat danger">
                <div className="mon-side-stat-label">Failed</div>
                <div className="mon-side-stat-value">{d.failed}</div>
              </div>
              <div className="mon-side-stat">
                <div className="mon-side-stat-label">Updated</div>
                <div className="mon-side-stat-value">{d.updated}</div>
              </div>
              <div className="mon-side-stat">
                <div className="mon-side-stat-label">Deleted</div>
                <div className="mon-side-stat-value">{d.deleted}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mon-pipeline-section-title">Pipeline components · click to drill down</div>
        <div className="mon-pipeline-tiles" key={`tiles-${dataType}-${timeRange}`}>
          {visibleCards.map((key) => {
            const cfg = cardConfig[key];
            if (!cfg) return null;
            const index = cardIndex++;
            return (
              <MonitoringCard
                key={key}
                cardKey={key}
                cfg={cfg}
                metrics={key === 'audiences' ? null : getCardMetrics(key)}
                selected={selectedCard === key}
                onSelect={setSelectedCard}
                index={index}
                health={cfg.health}
              />
            );
          })}
        </div>

        <div key={`${selectedCard}-${timeRange}`} className="aep-monitoring-detail">
          {renderCardDetail()}
        </div>
      </>
    );
  };

  const renderBatch = () => (
    <div className="aep-monitoring-detail-panel aep-tab-content">
      <div className="aep-monitoring-detail-head">
        <div>
          <div className="aep-monitoring-detail-title">Batch end-to-end jobs</div>
          <p className="aep-monitoring-detail-desc">Scheduled batch ingestion runs with record counts and duration.</p>
        </div>
      </div>
      <div className="aep-monitoring-detail-body">
        <div className="aep-table-scroll">
          <div className="aep-data-table aep-section-table">
            <div className="aep-data-table-header aep-section-table-header">
              <span>Job name</span><span>Status</span><span>Records</span><span>Duration</span><span>Time</span>
            </div>
            {monitoringBatchJobs.map((job) => (
              <div key={job.name} className="aep-data-table-row aep-section-table-row aep-section-table-row-5">
                <span className="aep-recent-name">{job.name}</span>
                <span><StatusPill status={job.status} /></span>
                <span>{job.records}</span>
                <span>{job.duration}</span>
                <span className="aep-recent-meta">{job.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStreaming = () => (
    <div className="aep-monitoring-detail-panel aep-tab-content">
      <div className="aep-monitoring-detail-head">
        <div>
          <div className="aep-monitoring-detail-title">Streaming end-to-end</div>
          <p className="aep-monitoring-detail-desc">Live event throughput and ingestion latency across streaming connectors.</p>
        </div>
      </div>
      <div className="aep-monitoring-detail-body">
        <ChartContainer size="lg">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monitoringStreaming} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f8" />
              <XAxis dataKey="hour" tick={{ fontSize: tick }} stroke="#959595" />
              <YAxis yAxisId="left" tick={{ fontSize: tick }} width={48} stroke="#959595" />
              {showDualAxis && <YAxis yAxisId="right" orientation="right" tick={{ fontSize: tick }} width={48} stroke="#959595" />}
              <Tooltip content={<ChartTooltip />} /><Legend {...legendProps} />
              <Line yAxisId="left" type="monotone" dataKey="events" stroke={COLORS.blue} strokeWidth={2} name="Events" dot={{ r: isMobile ? 3 : 4 }} />
              {showDualAxis && (
                <Line yAxisId="right" type="monotone" dataKey="latency" stroke={COLORS.teal} strokeWidth={2} name="Latency (ms)" dot={{ r: isMobile ? 3 : 4 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );

  const renderEdge = () => (
    <div className="aep-monitoring-detail-panel aep-tab-content">
      <div className="aep-monitoring-detail-head">
        <div>
          <div className="aep-monitoring-detail-title">Edge network status</div>
          <p className="aep-monitoring-detail-desc">Regional edge nodes processing streaming ingestion workloads.</p>
        </div>
      </div>
      <div className="aep-monitoring-detail-body">
        <div className="aep-data-table aep-section-table">
          <div className="aep-data-table-header aep-section-table-header">
            <span>Region</span><span>Events</span><span>Latency</span><span>Status</span>
          </div>
          {monitoringEdge.map((row) => (
            <div key={row.region} className="aep-data-table-row aep-section-table-row">
              <span className="aep-recent-name">{row.region}</span>
              <span className="aep-data-value">{row.events}</span>
              <span>{row.latency}</span>
              <span><StatusPill status={row.status} /></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabContent = {
    dashboard: renderDashboard,
    batch: renderBatch,
    streaming: renderStreaming,
    edge: renderEdge,
  };

  return (
    <AEPLayout>
      <div className="aep-page aep-monitoring-page">
        <h1 className="aep-page-title">Ingestion monitoring</h1>
        <p className="aep-page-subtitle">
          Enterprise pipeline observability — track batch, streaming, and edge ingestion with real-time health metrics.
        </p>
        <PageTabs
          tabs={MONITORING_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          rightContent={activeTab === 'dashboard' ? (
            <span className="mon-live-badge">Updated 9:03 PM</span>
          ) : null}
        />
        <div key={activeTab} className="aep-tab-content">
          {tabContent[activeTab]?.()}
        </div>
      </div>
    </AEPLayout>
  );
};

export default MonitoringPage;
