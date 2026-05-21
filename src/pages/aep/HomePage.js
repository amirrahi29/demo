import { Link } from 'react-router-dom';
import AEPLayout from '../../components/aep/AEPLayout';
import KpiGrid from '../../components/aep/KpiGrid';
import RecentPanel from '../../components/aep/RecentPanel';
import StatusPill from '../../components/aep/StatusPill';
import { EditIcon, CodexIcon } from '../../components/aep/icons';
import {
  homeKpis, recentSources, recentDatasets, recentProfiles,
  recentAudiences, quickStats, workspaceConfig,
} from '../../data/platformData';
import { pipelineStages, pipelineFlowStats } from '../../data/pipelineData';

const HomePage = () => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const { userName, heroStats } = workspaceConfig;

  return (
    <AEPLayout>
      <div className="aep-page">
        <div className="aep-hero-banner stagger-1">
          <div className="aep-hero-content">
            <h1 className="aep-greeting">{greeting}, {userName}!</h1>
            <p className="aep-hero-sub">
              Data pipeline is healthy — Ingestion {heroStats.ingestionSuccess}, Transformation {heroStats.transformSuccess}, Standardization {heroStats.standardizationScore}. {heroStats.jobsRunning} jobs running.
            </p>
          </div>
          <button type="button" className="aep-btn aep-btn-primary"><EditIcon /> Customize home</button>
        </div>

        <div className="aep-pipeline-flow-banner stagger-2">
          <div className="aep-pipeline-flow-title">End-to-end data pipeline</div>
          <div className="aep-pipeline-flow-track">
            {pipelineStages.map((stage, index) => (
              <div key={stage.id} className="aep-pipeline-flow-item-wrap">
                <Link to={stage.path} className="aep-pipeline-flow-item" style={{ '--pillar-color': stage.color }}>
                  <span className="aep-pipeline-flow-icon">{stage.icon}</span>
                  <span className="aep-pipeline-flow-label">{stage.label}</span>
                  <span className="aep-pipeline-flow-desc">{stage.description}</span>
                </Link>
                {index < pipelineStages.length - 1 && <span className="aep-pipeline-flow-arrow">→</span>}
              </div>
            ))}
          </div>
          <div className="aep-pipeline-flow-stats">
            <span>Ingested <strong>{pipelineFlowStats.ingested}</strong></span>
            <span className="aep-pipeline-flow-dot">·</span>
            <span>Transformed <strong>{pipelineFlowStats.transformed}</strong></span>
            <span className="aep-pipeline-flow-dot">·</span>
            <span>Standardized <strong>{pipelineFlowStats.standardized}</strong></span>
            <span className="aep-pipeline-flow-dot">·</span>
            <span>Published <strong>{pipelineFlowStats.published}</strong></span>
          </div>
        </div>

        <KpiGrid variant="quick" items={quickStats} className="stagger-3" />

        <div className="aep-kpi-row stagger-4">
          {homeKpis.map((kpi) => (
            <Link key={kpi.label} to={kpi.path} className="aep-kpi-card aep-kpi-card-link">
              <div className="aep-kpi-top">
                <div className="aep-kpi-label">{kpi.label}</div>
                <span className={`aep-kpi-trend${kpi.trendUp ? ' up' : ' down'}`}>{kpi.trend}</span>
              </div>
              <div className="aep-kpi-value">{kpi.value}</div>
              <div className="aep-kpi-link">{kpi.link} →</div>
              {kpi.sub && <div className="aep-kpi-sub">{kpi.sub}</div>}
              <div className="aep-kpi-meta">{kpi.meta}</div>
            </Link>
          ))}
        </div>

        <div className="aep-recent-grid stagger-5">
          <RecentPanel
            title="Recent ingestions"
            viewAllPath="/ingestion"
            items={recentSources.map((item) => ({ ...item, icon: <CodexIcon /> }))}
            renderMeta={(item) => (
              <>{item.time} · <StatusPill status={item.status} /></>
            )}
          />
          <RecentPanel
            title="Recent transformations"
            viewAllPath="/transformation"
            items={recentDatasets.map((item) => ({ ...item, icon: '⚙️' }))}
            renderMeta={(item) => `${item.records} rows · ${item.time}`}
          />
          <RecentPanel
            title="Standardization runs"
            viewAllPath="/standardization"
            items={recentProfiles.map((item) => ({ ...item, icon: '📐' }))}
            renderMeta={(item) => `${item.count} · ${item.time}`}
          />
          <RecentPanel
            title="Pipeline alerts"
            viewAllPath="/alerts"
            items={recentAudiences.map((item) => ({ ...item, icon: '🔔' }))}
            renderMeta={(item) => `${item.size} · ${item.time}`}
          />
        </div>
      </div>
    </AEPLayout>
  );
};

export default HomePage;
