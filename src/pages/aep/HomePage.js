import AEPLayout from '../../components/aep/AEPLayout';
import { EditIcon, CodexIcon } from '../../components/aep/icons';
import {
  homeKpis, recentSources, recentDatasets, recentProfiles,
  recentAudiences, quickStats,
} from '../../data/platformData';

const HomePage = () => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <AEPLayout>
      <div className="aep-page">
        <div className="aep-hero-banner stagger-1">
          <div className="aep-hero-content">
            <h1 className="aep-greeting">{greeting}, Anurag!</h1>
            <p className="aep-hero-sub">Your Codex Copilot workspace is healthy. 7 jobs running, 98.4% ingestion success.</p>
          </div>
          <button type="button" className="aep-btn aep-btn-primary"><EditIcon /> Customize home</button>
        </div>

        <div className="aep-quick-stats stagger-2">
          {quickStats.map((s) => (
            <div key={s.label} className="aep-quick-stat">
              <span className="aep-quick-stat-icon">{s.icon}</span>
              <div>
                <div className="aep-quick-stat-value">{s.value}</div>
                <div className="aep-quick-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="aep-kpi-row stagger-3">
          {homeKpis.map((kpi) => (
            <div key={kpi.label} className="aep-kpi-card">
              <div className="aep-kpi-top">
                <div className="aep-kpi-label">{kpi.label}</div>
                <span className={`aep-kpi-trend${kpi.trendUp ? ' up' : ' down'}`}>{kpi.trend}</span>
              </div>
              <div className="aep-kpi-value">{kpi.value}</div>
              <div className="aep-kpi-link">{kpi.link}</div>
              {kpi.sub && <div className="aep-kpi-sub">{kpi.sub}</div>}
              <div className="aep-kpi-meta">{kpi.meta}</div>
            </div>
          ))}
        </div>

        <div className="aep-recent-grid stagger-4">
          <div className="aep-recent-col">
            <div className="aep-recent-header">
              <h3>Recent sources</h3>
              <span className="aep-card-link">View all</span>
            </div>
            {recentSources.map((item) => (
              <div key={item.name} className="aep-recent-item">
                <span className="aep-item-icon"><CodexIcon /></span>
                <div className="aep-recent-item-body">
                  <span className="aep-recent-name">{item.name}</span>
                  <span className="aep-recent-meta">{item.time} · <span className={`aep-status-pill ${item.status.toLowerCase()}`}>{item.status}</span></span>
                </div>
              </div>
            ))}
          </div>
          <div className="aep-recent-col">
            <div className="aep-recent-header">
              <h3>Recent datasets</h3>
              <span className="aep-card-link">View all</span>
            </div>
            {recentDatasets.map((item) => (
              <div key={item.name} className="aep-recent-item">
                <span className="aep-item-icon">📊</span>
                <div className="aep-recent-item-body">
                  <span className="aep-recent-name">{item.name}</span>
                  <span className="aep-recent-meta">{item.records} records · {item.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="aep-recent-col">
            <div className="aep-recent-header">
              <h3>Recent profiles</h3>
              <span className="aep-card-link">View all</span>
            </div>
            {recentProfiles.map((item) => (
              <div key={item.name} className="aep-recent-item">
                <span className="aep-item-icon">👤</span>
                <div className="aep-recent-item-body">
                  <span className="aep-recent-name">{item.name}</span>
                  <span className="aep-recent-meta">{item.count} profiles · {item.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="aep-recent-col">
            <div className="aep-recent-header">
              <h3>Recent audiences</h3>
              <span className="aep-card-link">View all</span>
            </div>
            {recentAudiences.map((item) => (
              <div key={item.name} className="aep-recent-item">
                <span className="aep-item-icon">🎯</span>
                <div className="aep-recent-item-body">
                  <span className="aep-recent-name">{item.name}</span>
                  <span className="aep-recent-meta">{item.size} members · {item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AEPLayout>
  );
};

export default HomePage;
