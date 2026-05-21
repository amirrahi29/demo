import { Link } from 'react-router-dom';
import AEPLayout from '../../components/aep/AEPLayout';
import KpiGrid from '../../components/aep/KpiGrid';
import DataTable from '../../components/aep/DataTable';
import { pipelinePillars, pipelineStages } from '../../data/pipelineData';

const relatedLinks = {
  ingestion: [
    { to: '/sources', label: 'Manage sources' },
    { to: '/monitoring', label: 'Ingestion monitoring' },
    { to: '/destinations', label: 'Landing destinations' },
  ],
  transformation: [
    { to: '/workflows', label: 'Pipeline workflows' },
    { to: '/datasets', label: 'Curated datasets' },
    { to: '/queries', label: 'Transform queries' },
  ],
  standardization: [
    { to: '/schemas', label: 'Schema registry' },
    { to: '/identities', label: 'Identity mapping' },
    { to: '/datasets', label: 'Standardized outputs' },
  ],
};

const PipelineHubPage = ({ pillarId }) => {
  const config = pipelinePillars[pillarId];
  const stage = pipelineStages.find((s) => s.id === pillarId);
  const links = relatedLinks[pillarId] || [];

  if (!config) return null;

  return (
    <AEPLayout>
      <div className="aep-page">
        <div className="aep-pipeline-hero stagger-1" style={{ '--pillar-color': stage?.color }}>
          <div className="aep-pipeline-hero-icon">{stage?.icon}</div>
          <div>
            <h1 className="aep-page-title">{config.title}</h1>
            <p className="aep-pipeline-subtitle">{config.subtitle}</p>
          </div>
        </div>

        <div className="aep-pipeline-links stagger-2">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="aep-btn aep-btn-pipeline">{link.label} →</Link>
          ))}
        </div>

        <div className="aep-kpi-row stagger-3" style={{ marginTop: 20 }}>
          {config.kpis.map((kpi) => (
            <div key={kpi.label} className="aep-kpi-card">
              <div className="aep-kpi-top">
                <div className="aep-kpi-label">{kpi.label}</div>
                <span className={`aep-kpi-trend${kpi.trendUp ? ' up' : ' down'}`}>{kpi.trend}</span>
              </div>
              <div className="aep-kpi-value">{kpi.value}</div>
              <div className="aep-kpi-meta">{kpi.meta}</div>
            </div>
          ))}
        </div>

        <div className="aep-datalake-section aep-tab-content stagger-4" style={{ marginTop: 24 }}>
          <div className="aep-datalake-title" style={{ marginBottom: 16 }}>Recent pipeline activity</div>
          <DataTable rows={config.activities} emptyMessage="No pipeline activity" />
        </div>

        <div className="aep-datalake-section stagger-5" style={{ marginTop: 16 }}>
          <div className="aep-datalake-title" style={{ marginBottom: 16 }}>Operational metrics</div>
          <KpiGrid variant="mini" items={config.metrics} />
        </div>

        <div className="aep-pipeline-nav-row stagger-6">
          {pipelineStages.map((s) => (
            <Link
              key={s.id}
              to={s.path}
              className={`aep-pipeline-nav-card${s.id === pillarId ? ' active' : ''}`}
              style={{ '--pillar-color': s.color }}
            >
              <span className="aep-pipeline-nav-icon">{s.icon}</span>
              <span className="aep-pipeline-nav-label">{s.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </AEPLayout>
  );
};

export const IngestionPage = () => <PipelineHubPage pillarId="ingestion" />;
export const TransformationPage = () => <PipelineHubPage pillarId="transformation" />;
export const StandardizationPage = () => <PipelineHubPage pillarId="standardization" />;

export default PipelineHubPage;
