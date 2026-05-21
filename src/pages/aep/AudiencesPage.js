import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import AEPLayout from '../../components/aep/AEPLayout';
import PageTabs from '../../components/aep/PageTabs';
import ChartContainer from '../../components/aep/ChartContainer';
import { SettingsIcon } from '../../components/aep/icons';
import useResponsiveChart from '../../hooks/useResponsiveChart';
import {
  audienceKpis, audienceTrend, audienceByType, audienceBrowseList,
  audienceFeeds, audienceJobs, COLORS,
} from '../../data/platformData';

const AUDIENCE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'browse', label: 'Browse' },
  { id: 'feeds', label: 'Feeds' },
  { id: 'jobs', label: 'Jobs' },
];

const PIE_COLORS = [COLORS.blue, COLORS.teal, COLORS.purple, COLORS.orange];

const AudiencesPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { tick, tickSmall, pieRadius, legendProps, isMobile, chartMargin } = useResponsiveChart();

  return (
    <AEPLayout>
      <div className="aep-page">
        <div className="aep-page-header-row stagger-1">
          <h1 className="aep-page-title">Audiences</h1>
          <button type="button" className="aep-btn aep-btn-primary">+ Create audience</button>
        </div>

        <PageTabs
          tabs={AUDIENCE_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          rightContent={<button type="button" className="aep-btn"><SettingsIcon /> Settings</button>}
        />

        {activeTab === 'overview' && (
          <>
            <div className="aep-kpi-row stagger-2" style={{ marginTop: 20 }}>
              {audienceKpis.map((kpi) => (
                <div key={kpi.label} className="aep-kpi-card">
                  <div className="aep-kpi-top">
                    <div className="aep-kpi-label">{kpi.label}</div>
                    {kpi.trendUp !== null && (
                      <span className={`aep-kpi-trend${kpi.trendUp ? ' up' : ' down'}`}>{kpi.trend}</span>
                    )}
                  </div>
                  <div className="aep-kpi-value">{kpi.value}</div>
                </div>
              ))}
            </div>
            <div className="aep-widget-grid stagger-3" style={{ marginTop: 20 }}>
              <div className="aep-widget" style={{ '--widget-index': 0 }}>
                <div className="aep-widget-header"><span className="aep-card-title">Audience growth trend</span></div>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={audienceTrend} margin={chartMargin}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" tick={{ fontSize: tick }} /><YAxis tick={{ fontSize: tick }} width={42} /><Tooltip /><Line type="monotone" dataKey="count" stroke={COLORS.blue} strokeWidth={2} dot={{ r: isMobile ? 3 : 5 }} /></LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="aep-widget" style={{ '--widget-index': 1 }}>
                <div className="aep-widget-header"><span className="aep-card-title">Audiences by type</span></div>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={audienceByType}
                        dataKey="value"
                        nameKey="type"
                        cx="50%"
                        cy={isMobile ? '45%' : '50%'}
                        outerRadius={pieRadius}
                        label={isMobile ? false : ({ type, value }) => `${type}: ${value}`}
                      >
                        {audienceByType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend {...legendProps} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="aep-widget" style={{ '--widget-index': 2 }}>
                <div className="aep-widget-header"><span className="aep-card-title">Size distribution</span></div>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={audienceByType} margin={chartMargin}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="type" tick={{ fontSize: tickSmall }} interval={0} angle={isMobile ? -25 : 0} textAnchor={isMobile ? 'end' : 'middle'} height={isMobile ? 50 : 30} /><YAxis tick={{ fontSize: tickSmall }} width={42} /><Tooltip /><Bar dataKey="value" fill={COLORS.teal} radius={[4, 4, 0, 0]} /></BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'browse' && (
          <div className="aep-recent-grid aep-tab-content" style={{ marginTop: 20 }}>
            <div className="aep-recent-col" style={{ gridColumn: '1 / -1' }}>
              <div className="aep-audience-table">
                <div className="aep-data-table-header aep-audience-table-header">
                  <span>Name</span><span>Size</span><span>Last updated</span><span>Status</span>
                </div>
                {audienceBrowseList.map((item, i) => (
                  <div key={item.name} className="aep-data-table-row aep-audience-table-row" style={{ '--row-index': i }}>
                    <span className="aep-recent-name">🎯 {item.name}</span>
                    <span className="aep-data-value">{item.size}</span>
                    <span className="aep-recent-meta">{item.time}</span>
                    <span className={`aep-status-pill ${item.status === 'Paused' ? 'paused' : 'active'}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feeds' && (
          <div className="aep-datalake-section aep-tab-content">
            <div className="aep-data-table aep-section-table">
              <div className="aep-data-table-header aep-section-table-header">
                <span>Feed name</span><span>Destination</span><span>Status</span><span>Last sync</span>
              </div>
              {audienceFeeds.map((f, i) => (
                <div key={f.name} className="aep-data-table-row aep-section-table-row" style={{ '--row-index': i }}>
                  <span className="aep-recent-name">{f.name}</span>
                  <span>{f.destination}</span>
                  <span className="aep-status-pill active">{f.status}</span>
                  <span className="aep-recent-meta">{f.lastSync}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="aep-datalake-section aep-tab-content">
            <div className="aep-data-table aep-section-table">
              <div className="aep-data-table-header aep-section-table-header aep-section-table-row-3">
                <span>Job name</span><span>Status</span><span>Time</span>
              </div>
              {audienceJobs.map((j, i) => (
                <div key={j.name} className="aep-data-table-row aep-section-table-row aep-section-table-row-3" style={{ '--row-index': i }}>
                  <span className="aep-recent-name">{j.name}</span>
                  <span className={`aep-status-pill ${j.status === 'Failed' ? 'failed' : j.status === 'Running' ? 'paused' : 'active'}`}>{j.status}</span>
                  <span className="aep-recent-meta">{j.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AEPLayout>
  );
};

export default AudiencesPage;
