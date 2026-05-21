import TealiumLayout from '../../components/tealium/TealiumLayout';
import KpiGrid from '../../components/aep/KpiGrid';
import EmptyState from '../../components/aep/EmptyState';
import StatusPill from '../../components/aep/StatusPill';
import { tealiumSources } from '../../data/platformData';
import { tealiumSectionConfigs } from '../../data/tealiumData';

const TealiumSectionPage = ({ section }) => {
  const config = tealiumSectionConfigs[section] || tealiumSectionConfigs.usage;

  const rows = config.useTealiumSources
    ? tealiumSources.map((s) => ({ name: s.name, metric: s.volume, status: s.trend }))
    : config.rows;

  return (
    <TealiumLayout>
      <div className="tealium-page-hero">
        <div>
          <div className="tealium-breadcrumb">
            Data Supply Chain &gt; <span>{config.title}</span>
          </div>
          <h1 className="tealium-page-title">{config.title}</h1>
          {config.subtitle && <p className="tealium-page-subtitle">{config.subtitle}</p>}
        </div>
      </div>

      <KpiGrid variant="summary" items={config.summary} />

      <div className="tealium-table-card tealium-section-table" style={{ marginTop: 24 }}>
        <div className="tealium-table-header">{config.title}</div>
        <div className="tealium-table-subheader">
          <span>Name</span>
          <span>Metric · Status</span>
        </div>
        <div className="tealium-table-body">
          {rows.length === 0 ? (
            <EmptyState message="No pipeline data" hint="Check filters or try another time range." icon="📊" />
          ) : rows.map((row) => (
            <div key={row.name} className="tealium-table-row">
              <div className="tealium-row-name">
                <span className="tealium-row-text">{row.name}</span>
              </div>
              <div className="tealium-row-metrics">
                <span className="tealium-volume">{row.metric}</span>
                <StatusPill status={row.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </TealiumLayout>
  );
};

export default TealiumSectionPage;
