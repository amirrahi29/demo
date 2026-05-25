import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const APP_LOCALE = 'en-US';

function formatAppDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(APP_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatAppDateTime(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(APP_LOCALE, {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return String(iso);
  }
}

function formatDate(iso) {
  return formatAppDate(iso);
}

function getChartViewportWidth() {
  return typeof window !== 'undefined' ? window.innerWidth : 1200;
}

function useResponsiveChart() {
  const [width, setWidth] = useState(getChartViewportWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = width <= 480;
  const isTablet = width <= 768;
  const isSmall = width <= 1024;

  return {
    width,
    isMobile,
    isTablet,
    isSmall,
    tick: isMobile ? 9 : isTablet ? 10 : 11,
    tickSmall: isMobile ? 8 : isTablet ? 9 : 10,
    yAxisWidth: isMobile ? 44 : isTablet ? 56 : 72,
    barSize: isMobile ? 7 : isTablet ? 9 : 12,
    pieRadius: isMobile ? 52 : isTablet ? 72 : 90,
    chartMargin: isMobile
      ? { top: 8, right: 6, left: -12, bottom: 0 }
      : isTablet
        ? { top: 10, right: 12, left: -4, bottom: 4 }
        : { top: 12, right: 16, left: 4, bottom: 5 },
    axisMargin: isMobile
      ? { top: 8, right: 8, left: 0, bottom: 0 }
      : { top: 10, right: 16, left: 0, bottom: 5 },
    legendProps: isMobile
      ? { verticalAlign: 'bottom', align: 'center', wrapperStyle: { fontSize: 10, paddingTop: 8 } }
      : { wrapperStyle: { fontSize: 11 } },
    showDualAxis: !isMobile,
  };
}

function toSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 56);
}

function createDemoProject(id, name, index = 0) {
  const statuses = ['on-track', 'on-track', 'at-risk', 'delayed', 'on-track', 'blocked', 'on-track'];
  const risks = ['low', 'medium', 'medium', 'high', 'low', 'high', 'medium'];
  const status = statuses[index % statuses.length];
  const risk = risks[index % risks.length];
  const progress = [82, 71, 58, 35, 88, 52, 67, 44, 90, 64][index % 10];
  const delayDays = status === 'delayed' || status === 'blocked' ? [28, 23, 76, 5][index % 4] : (index % 5 === 0 ? 4 : 0);
  const delayReason = delayDays > 20
    ? 'Cross-team dependency awaiting sign-off'
    : delayDays > 0
      ? 'Minor scope adjustment from stakeholders'
      : null;
  const clients = ['Internal', 'Enterprise', 'GPT Portfolio', 'Strategic Client'];
  return {
    id,
    name,
    status,
    risk,
    client: clients[index % clients.length],
    progress,
    duration: {
      plannedDays: 90,
      elapsedDays: Math.round(progress * 0.9),
      remainingDays: Math.max(0, 90 - Math.round(progress * 0.9)),
    },
    timeline: {
      startDate: '2026-02-01',
      expectedEndDate: '2026-05-30',
      projectedEndDate: delayDays ? '2026-06-20' : '2026-05-28',
    },
    teamSize: 3 + (index % 4),
    delayDays,
    delayReason,
    blockers: status === 'blocked' ? ['Approval pending', 'Environment unavailable'] : [],
    modules: [
      { id: `${id}-m1`, name: 'Discovery & Planning', status: 'done', estimatedDays: 12, actualDays: 11, assignee: 'Lead' },
      { id: `${id}-m2`, name: 'Build & Integrate', status: progress > 70 ? 'done' : 'in-progress', estimatedDays: 24, actualDays: Math.round(progress * 0.2), assignee: 'Engineer' },
      { id: `${id}-m3`, name: 'Validation & Rollout', status: progress > 85 ? 'in-progress' : 'pending', estimatedDays: 14, actualDays: 0, assignee: 'Engineer' },
    ],
    developers: [
      { id: `${id}-d1`, name: 'Delivery Lead', role: 'Lead', utilization: 82 + (index % 10), currentModule: 'Build & Integrate' },
      { id: `${id}-d2`, name: 'Engineer A', role: 'Engineer', utilization: 75 + (index % 12), currentModule: 'Build & Integrate' },
      { id: `${id}-d3`, name: 'Engineer B', role: 'Engineer', utilization: 68 + (index % 15), currentModule: 'Validation & Rollout' },
    ],
  };
}

const LAY_OF_LAND_ROWS = [
  { fast: 'FOCUS & Deliver on BU & Functional Priorities', fastShort: 'FOCUS', initiative: 'Deliver against medium term Guidance', team: 'BU Leaders' },
  { fast: 'FOCUS & Deliver on BU & Functional Priorities', fastShort: 'FOCUS', initiative: 'Client 0 Lyric', team: 'BU Leaders' },
  { fast: 'FOCUS & Deliver on BU & Functional Priorities', fastShort: 'FOCUS', initiative: 'NextGen development per plan', team: 'BU Leaders' },
  { fast: 'FOCUS & Deliver on BU & Functional Priorities', fastShort: 'FOCUS', initiative: 'PI Acceleration', team: 'PI Leaders' },
  { fast: 'ACCELERATE - Product Portfolio Impact', fastShort: 'ACCELERATE', initiative: 'AI tool adoption (% of assoc.)', team: 'Prasanna & Team' },
  { fast: 'ACCELERATE - Product Portfolio Impact', fastShort: 'ACCELERATE', initiative: 'AI Productivity Benefit (Cumulative %)', team: 'Prasanna & Team' },
  { fast: 'ACCELERATE - Product Portfolio Impact', fastShort: 'ACCELERATE', initiative: 'AI Infrastructure Progress (AI Studio)', team: 'Prasanna & Team' },
  { fast: 'ACCELERATE - Product Portfolio Impact', fastShort: 'ACCELERATE', initiative: 'AI Infrastructure Progress (Personalization Engine & Data Central)', team: 'Amin & Team' },
  { fast: 'ACCELERATE - Product Portfolio Impact', fastShort: 'ACCELERATE', initiative: 'Deliver on Persona based agent plan', team: 'Prasanna & Team' },
  { fast: 'ACCELERATE - Product Portfolio Impact', fastShort: 'ACCELERATE', initiative: 'AI Centric (BU) Roadmaps', team: 'Prasanna & Team' },
  { fast: 'ACCELERATE - Product Portfolio Impact', fastShort: 'ACCELERATE', initiative: 'Accelerate NG dev. & Migration Factory via AI', team: 'Prasanna & Team' },
  { fast: 'ACCELERATE - Product Portfolio Impact', fastShort: 'ACCELERATE', initiative: 'Portfolio & TAM Expansion', team: 'Prasanna & Team' },
  { fast: 'ACCELERATE - Product Portfolio Impact', fastShort: 'ACCELERATE', initiative: 'H2A (Human to Agent) Standards', team: 'Prasanna & Team' },
  { fast: 'SCALE - GPT Led Growth Bets', fastShort: 'SCALE', initiative: 'Breakthrough Business Revenue - Marketplace', team: 'Oz & Team' },
  { fast: 'SCALE - GPT Led Growth Bets', fastShort: 'SCALE', initiative: 'Breakthrough Business Revenue - Data', team: 'Oz & Team' },
  { fast: 'SCALE - GPT Led Growth Bets', fastShort: 'SCALE', initiative: 'Investment and Revenue Gains from Ventures', team: 'Oz & Team' },
  { fast: 'TRANSFORM - GPT Operations & Engagement', fastShort: 'TRANSFORM', initiative: 'Vendor Management (TESM)', team: 'Varun & Team' },
  { fast: 'TRANSFORM - GPT Operations & Engagement', fastShort: 'TRANSFORM', initiative: 'GPT Global Delivery Model', team: 'Varun & Team' },
  { fast: 'TRANSFORM - GPT Operations & Engagement', fastShort: 'TRANSFORM', initiative: 'SDLC/ADLC', team: 'Ram & Team' },
  { fast: 'TRANSFORM - GPT Operations & Engagement', fastShort: 'TRANSFORM', initiative: 'People Excellence (Workforce & Talent Strategy)', team: 'Emma & Team' },
  { fast: 'TRANSFORM - GPT Operations & Engagement', fastShort: 'TRANSFORM', initiative: 'Stakeholder Excellence', team: 'Varun & Team' },
  { fast: 'TRANSFORM - GPT Operations & Engagement', fastShort: 'TRANSFORM', initiative: 'Collaboration / Associate Experience', team: 'Prakash & Team' },
  { fast: 'TRANSFORM - GPT Operations & Engagement', fastShort: 'TRANSFORM', initiative: 'Cloud Migration', team: 'Prakash & Team' },
  { fast: 'TRANSFORM - GPT Operations & Engagement', fastShort: 'TRANSFORM', initiative: 'IAM', team: 'Prakash & Team' },
  { fast: 'TRANSFORM - GPT Operations & Engagement', fastShort: 'TRANSFORM', initiative: 'Risk and Resiliency', team: 'Ram & Team' },
  { fast: 'TRANSFORM - GPT Operations & Engagement', fastShort: 'TRANSFORM', initiative: 'GPT Performance Management (Control Tower)', team: 'Varun & Team' },
];

function summarizeProjects(projects) {
  const delayed = projects.filter((p) => p.status === 'delayed' || p.status === 'blocked').length;
  const pendingModules = projects.reduce((sum, p) => sum + p.modules.filter((m) => m.status === 'pending').length, 0);
  const avgUtilization = projects.length
    ? Math.round(projects.reduce((sum, p) => sum + (p.developers.reduce((s, d) => s + d.utilization, 0) / Math.max(p.developers.length, 1)), 0) / projects.length)
    : 0;
  const teamSize = projects.reduce((sum, p) => sum + p.teamSize, 0);
  const status = delayed >= 2 ? 'at-risk' : delayed === 1 ? 'delayed' : 'on-track';
  return { activeProjects: projects.length, delayedProjects: delayed, pendingModules, developers: teamSize, avgUtilization, status };
}

function summarizeFastStatusCounts(fast) {
  const projects = fast.initiatives.flatMap((ini) => ini.projects);
  return {
    onTrack: projects.filter((p) => p.status === 'on-track').length,
    atRisk: projects.filter((p) => p.status === 'at-risk').length,
    offTrack: projects.filter((p) => p.status === 'delayed' || p.status === 'blocked').length,
  };
}

function SidebarFastStatusRow({ fast }) {
  const counts = summarizeFastStatusCounts(fast);
  return (
    <span className="def-sidebar-status-row" aria-label="Project status mix">
      <span className="def-sidebar-status-line ok">
        <i style={{ background: '#22c55e' }} aria-hidden="true" />
        On {counts.onTrack}
      </span>
      <span className="def-sidebar-status-line risk">
        <i style={{ background: '#f59e0b' }} aria-hidden="true" />
        Risk {counts.atRisk}
      </span>
      <span className="def-sidebar-status-line late">
        <i style={{ background: '#ef4444' }} aria-hidden="true" />
        Off {counts.offTrack}
      </span>
    </span>
  );
}

const IMPERATIVE_LABELS = {
  FOCUS: 'Focus',
  ACCELERATE: 'Accelerate',
  SCALE: 'Scale',
  TRANSFORM: 'Transform',
};

/** Reference rows aligned to Command Center Initiative Tracker (EXL / ADP). */
const INITIATIVE_TRACKER_REF = {
  'pi acceleration': {
    initiative: 'Deliver on BU & Functional Priorities & KTLO',
    budgetPct: 10, budgetTotalM: 24, budgetSpentM: 2, schedulePct: 60,
    target: '100%', ctt: '20% of 100%', trend: [24, 22, 20, 20], trendUp: false, risk: 'high', source: 'adp',
  },
  'ai tool adoption (% of assoc.)': {
    initiative: 'AI Foundation', budgetPct: 40, budgetTotalM: 5, budgetSpentM: 2, schedulePct: 60,
    target: '$8M Revenue', ctt: '$1M of $8M (12.5%)', trend: [14, 13, 12, 12.5], trendUp: false, risk: 'medium', source: 'adp',
  },
  'ai productivity benefit (cumulative %)': {
    initiative: 'AI Foundation', budgetPct: 45, budgetTotalM: 12, budgetSpentM: 5, schedulePct: 75,
    target: '$12M Revenue', ctt: '$4M of $12M (33.3%)', trend: [28, 30, 31, 33], trendUp: true, risk: 'medium', source: 'sample',
  },
  'deliver on persona based agent plan': {
    initiative: 'AI Foundation', budgetPct: 40, budgetTotalM: 1, budgetSpentM: 0.4, schedulePct: 50,
    target: '50%', ctt: '20% of 50%', trend: [22, 21, 20, 20], trendUp: false, risk: 'medium', source: 'sample',
  },
  'ai infrastructure progress (ai studio)': {
    initiative: 'AI Foundation', budgetPct: 40, budgetTotalM: 1, budgetSpentM: 0.4, schedulePct: 60,
    target: '25%', ctt: '10% of 25%', trend: [12, 11, 10, 10], trendUp: false, risk: 'medium', source: 'sample',
  },
  'portfolio & tam expansion': {
    initiative: 'Data and Intelligence Layer', budgetPct: 50, budgetTotalM: 18, budgetSpentM: 9, schedulePct: 60,
    target: '$108M', ctt: '$12M of $108M (11%)', trend: [14, 13, 12, 11], trendUp: false, risk: 'high', source: 'adp',
  },
  'ai centric (bu) roadmaps': {
    initiative: 'Data and Intelligence Layer', budgetPct: 50, budgetTotalM: 24, budgetSpentM: 12, schedulePct: 50,
    target: '$108M', ctt: '$25M of $108M (23%)', trend: [26, 25, 24, 23], trendUp: false, risk: 'medium', source: 'adp',
  },
  'accelerate ng dev. & migration factory via ai': {
    initiative: 'AI Accelerated EVC Revenue', budgetPct: 50, budgetTotalM: 8, budgetSpentM: 4, schedulePct: 40,
    target: '$108M', ctt: '$5M of $108M (4.6%)', trend: [6, 5.5, 5, 4.6], trendUp: false, risk: 'high', source: 'sample',
  },
  'h2a (human to agent) standards': {
    initiative: 'AI Accelerated EVC Revenue', budgetPct: 50, budgetTotalM: 5, budgetSpentM: 2.5, schedulePct: 50,
    target: '100%', ctt: '30% of 100%', trend: [34, 32, 31, 30], trendUp: false, risk: 'medium', source: 'sample',
  },
  'breakthrough business revenue - marketplace': {
    initiative: 'AI Accelerated AVM Revenue', budgetPct: 50, budgetTotalM: 3, budgetSpentM: 1.6, schedulePct: 50,
    target: '100%', ctt: '30% of 100%', trend: [33, 32, 31, 30], trendUp: false, risk: 'medium', source: 'sample',
  },
  'breakthrough business revenue - data': {
    initiative: 'AI Accelerated CXP Revenue', budgetPct: 100, budgetTotalM: 4, budgetSpentM: 4, schedulePct: 75,
    target: '100%', ctt: '50% of 100%', trend: [42, 45, 48, 50], trendUp: true, risk: 'low', source: 'sample',
  },
  'investment and revenue gains from ventures': {
    initiative: 'AI Accelerated CXP Revenue', budgetPct: 100, budgetTotalM: 2, budgetSpentM: 2, schedulePct: 75,
    target: '100%', ctt: '50% of 100%', trend: [44, 46, 48, 50], trendUp: true, risk: 'low', source: 'sample',
  },
};

const SCORECARD_STATUS_META = {
  'on-track': { label: 'On Track', tone: 'track' },
  'on-watch': { label: 'On Watch', tone: 'watch' },
  'at-risk': { label: 'At Risk', tone: 'risk' },
};

/** Executive initiative scorecard KPI rows (reference screenshots). */
const INITIATIVE_SCORECARD_REF = {
  'deliver against medium term guidance': {
    strategicTargets: [
      { label: 'Product Rollout', value: 'Lyric : 6 / 10' },
      { label: 'Migration Readiness', value: 'Customer Base : 72%' },
      { label: 'Risk Mix', value: 'Low / Med / High : 30 / 50 / 20' },
    ],
    kpis: [
      { kpi: 'Cost Savings Realized', status: 'on-watch', current: '$8.7M', target2029: '$18M', targetYearOne: '$12M', comments: '—' },
      { kpi: 'Migration Readiness', status: 'on-track', current: '70:30', target2029: '80:20', targetYearOne: '75:25', comments: '—' },
      { kpi: 'Milestone Achievement', status: 'on-track', current: '78%', target2029: '>85%', targetYearOne: '80%', comments: '—' },
      { kpi: 'Product Rollout Velocity', status: 'on-watch', current: '6 products', target2029: '10 products', targetYearOne: '8 products', comments: '—' },
      { kpi: 'Risk & Compliance Score', status: 'at-risk', current: 'Medium', target2029: 'Low', targetYearOne: 'Low-Medium', comments: '—' },
    ],
  },
  'ai productivity benefit (cumulative %)': {
    strategicTargets: [
      { label: 'Agents in Pipeline', value: 'Client Persona : 18' },
      { label: 'Agents Rolled Out', value: 'Client Persona : 6' },
      { label: 'Risk Mix', value: 'Low / Med / High : 25 / 50 / 25' },
    ],
    kpis: [
      { kpi: 'Agents in Pipeline', status: 'on-track', current: '18', target2029: '25', targetYearOne: '20', comments: '—' },
      { kpi: 'Agents Rolled Out', status: 'on-watch', current: '6', target2029: '15', targetYearOne: '10', comments: '—' },
      { kpi: 'Persona Coverage', status: 'on-track', current: '64%', target2029: '90%', targetYearOne: '75%', comments: '—' },
      { kpi: 'User Satisfaction', status: 'on-track', current: '82', target2029: '90', targetYearOne: '85', comments: '—' },
      { kpi: 'Model Reliability', status: 'on-watch', current: '89%', target2029: '95%', targetYearOne: '92%', comments: '—' },
    ],
  },
  'investment and revenue gains from ventures': {
    strategicTargets: [
      { label: 'Targets in Pipeline', value: 'M&A : 9' },
      { label: 'Deals Closed', value: 'M&A : 3' },
      { label: 'Risk Mix', value: 'Low / Med / High : 22 / 48 / 30' },
    ],
    kpis: [
      { kpi: 'Targets in Pipeline', status: 'on-track', current: '9', target2029: '12', targetYearOne: '10', comments: '—' },
      { kpi: 'Deals Closed', status: 'on-track', current: '3', target2029: '5', targetYearOne: '4', comments: '—' },
      { kpi: 'Due Diligence Completion', status: 'on-watch', current: '67%', target2029: '90%', targetYearOne: '78%', comments: '—' },
      { kpi: 'Revenue from New Ventures', status: 'on-watch', current: '$15M', target2029: '$25M', targetYearOne: '$18M', comments: '—' },
      { kpi: 'Integration Risk', status: 'on-watch', current: 'Moderate-High', target2029: 'Low', targetYearOne: 'Medium', comments: '—' },
    ],
  },
};

function deriveScorecardStatus(initiativeStatus, risk) {
  if (initiativeStatus === 'delayed' || initiativeStatus === 'blocked' || risk === 'high') return 'at-risk';
  if (initiativeStatus === 'at-risk' || risk === 'medium') return 'on-watch';
  return 'on-track';
}

function buildFallbackScorecard(initiative) {
  const progress = Math.round(
    initiative.projects.reduce((sum, project) => sum + project.progress, 0)
      / Math.max(initiative.projects.length, 1),
  );
  const risk = initiative.status === 'on-track' ? 'low' : initiative.status === 'at-risk' ? 'medium' : 'high';
  const headlineStatus = deriveScorecardStatus(initiative.status, risk);
  return {
    strategicTargets: [
      { label: 'Milestone Progress', value: `${progress}% complete` },
      { label: 'Active Projects', value: String(initiative.projects.length) },
      { label: 'Risk Mix', value: headlineStatus === 'on-track' ? 'Low / Med / High : 40 / 45 / 15' : 'Low / Med / High : 25 / 45 / 30' },
    ],
    kpis: [
      {
        kpi: 'Milestone Achievement',
        status: deriveScorecardStatus(initiative.status, risk),
        current: `${progress}%`,
        target2029: '>85%',
        targetYearOne: '70%',
        comments: '—',
      },
      {
        kpi: 'Schedule Adherence',
        status: progress >= 70 ? 'on-track' : progress >= 50 ? 'on-watch' : 'at-risk',
        current: `${progress}%`,
        target2029: '90%',
        targetYearOne: '75%',
        comments: '—',
      },
      {
        kpi: 'Delivery Risk',
        status: headlineStatus,
        current: risk === 'high' ? 'High' : risk === 'medium' ? 'Medium' : 'Low',
        target2029: 'Low',
        targetYearOne: 'Low-Medium',
        comments: '—',
      },
    ],
  };
}

function buildInitiativeScorecard(initiative) {
  return INITIATIVE_SCORECARD_REF[initiative.name.toLowerCase()] ?? buildFallbackScorecard(initiative);
}

function buildInitiativeScorecardSummary(ini) {
  const ref = INITIATIVE_TRACKER_REF[ini.name.toLowerCase()];
  const scorecard = buildInitiativeScorecard(ini);
  const firstKpi = scorecard.kpis[0];
  const progress = ini.projects[0]?.progress ?? 55;
  const risk = ref?.risk ?? (ini.status === 'on-track' ? 'low' : ini.status === 'at-risk' ? 'medium' : 'high');
  return {
    scorecardStatus: firstKpi?.status ?? deriveScorecardStatus(ini.status, risk),
    current: firstKpi?.current ?? ref?.ctt ?? `${progress}%`,
    target2029: firstKpi?.target2029 ?? ref?.target ?? `${Math.min(100, progress + 15)}%`,
    targetYearOne: firstKpi?.targetYearOne ?? `${Math.min(100, progress + 8)}%`,
    comments: firstKpi?.comments ?? '—',
  };
}

function ScorecardStatusCell({ status }) {
  const meta = SCORECARD_STATUS_META[status] || SCORECARD_STATUS_META['on-watch'];
  return (
    <span className="def-scorecard-status">
      <i className={`def-scorecard-dot def-scorecard-dot-${meta.tone}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

function StrategicTargetCards({ targets }) {
  if (!targets?.length) return null;
  return (
    <div className="def-scorecard-targets">
      <p className="def-scorecard-targets-label">Strategic targets — 2029</p>
      <div className="def-scorecard-targets-row">
        {targets.map((target) => (
          <div key={target.label} className="def-scorecard-target-card">
            <span>{target.label}</span>
            <strong>{target.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function InitiativeKpiTable({
  rows,
  showImperativeColumn = false,
  onRowClick,
  emptyMessage = 'No KPI rows to display.',
}) {
  const colSpan = showImperativeColumn ? 7 : 6;
  return (
    <div className="def-scorecard-table-scroll def-table-scroll-wrap">
      <table className="def-scorecard-table">
        <thead>
          <tr>
            {showImperativeColumn ? <th>Strategic imperative</th> : null}
            <th>KPI</th>
            <th>Status</th>
            <th>Current</th>
            <th>2029 Target</th>
            <th>Year One Target</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={onRowClick ? 'def-scorecard-row-click' : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={onRowClick ? (event) => { if (event.key === 'Enter') onRowClick(row); } : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              role={onRowClick ? 'button' : undefined}
            >
              {showImperativeColumn && row.showImperative ? (
                <td className="def-scorecard-imperative" rowSpan={row.imperativeSpan}>{row.imperative}</td>
              ) : null}
              <td className="def-scorecard-kpi"><strong>{row.kpi}</strong></td>
              <td><ScorecardStatusCell status={row.scorecardStatus} /></td>
              <td>{row.current}</td>
              <td>{row.target2029}</td>
              <td>{row.targetYearOne}</td>
              <td>{row.comments}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={colSpan} className="def-cockpit-empty">{emptyMessage}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function formatBudgetM(totalM, spentM, pct) {
  return `${pct}% of $${totalM}M ($${spentM}M spent)`;
}

function applyTrackerRowSpans(rows) {
  const normalized = rows.map((row) => {
    const { imperativeSpan, showImperative, ...rest } = row;
    return rest;
  });
  const withSpans = normalized.map((row) => ({
    ...row,
    imperativeSpan: 0,
    showImperative: false,
  }));
  let i = 0;
  while (i < withSpans.length) {
    const imp = withSpans[i].imperative;
    let impEnd = i;
    while (impEnd < withSpans.length && withSpans[impEnd].imperative === imp) impEnd += 1;
    withSpans[i].showImperative = true;
    withSpans[i].imperativeSpan = impEnd - i;
    i = impEnd;
  }
  return withSpans;
}

function buildInitiativeTrackerRows(fastCategories) {
  const imperativeOrder = { Focus: 0, Accelerate: 1, Scale: 2, Transform: 3 };
  const rows = [];

  fastCategories.forEach((fast) => {
    const imperative = IMPERATIVE_LABELS[fast.shortName] || fast.shortName;
    const defaultInitiative = fast.name
      .replace(/^FOCUS &\s*|^ACCELERATE -\s*|^SCALE -\s*|^TRANSFORM -\s*/i, '')
      .trim();

    fast.initiatives.forEach((ini, index) => {
      const ref = INITIATIVE_TRACKER_REF[ini.name.toLowerCase()];
      const progress = ini.projects[0]?.progress ?? 55;
      const budgetPct = ref?.budgetPct ?? Math.min(95, 15 + (index % 6) * 12);
      const budgetTotalM = ref?.budgetTotalM ?? 2 + (index % 5);
      const budgetSpentM = ref?.budgetSpentM ?? Math.round(budgetTotalM * (budgetPct / 100) * 10) / 10;
      const schedulePct = ref?.schedulePct ?? progress;
      const risk = ref?.risk ?? (ini.status === 'on-track' ? 'low' : ini.status === 'at-risk' ? 'medium' : 'high');
      const trend = ref?.trend ?? [
        Math.max(5, progress - 12),
        Math.max(5, progress - 8),
        Math.max(5, progress - 4),
        progress,
      ];
      const trendUp = ref?.trendUp ?? trend[trend.length - 1] >= trend[0];

      const scorecardStatus = deriveScorecardStatus(ini.status, risk);
      const scorecardSummary = buildInitiativeScorecardSummary(ini);

      rows.push({
        id: `${fast.id}-${ini.id}`,
        fastId: fast.id,
        initiativeId: ini.id,
        imperative,
        initiative: ref?.initiative ?? defaultInitiative,
        kpi: ini.name,
        scorecardStatus,
        current: scorecardSummary.current,
        target2029: scorecardSummary.target2029,
        targetYearOne: scorecardSummary.targetYearOne,
        comments: scorecardSummary.comments,
        source: ref?.source ?? 'sample',
        subInitiative: ini.name,
        budgetPct,
        budgetLabel: formatBudgetM(budgetTotalM, budgetSpentM, budgetPct),
        schedulePct,
        target: ref?.target ?? `${Math.min(100, progress + 15)}%`,
        ctt: ref?.ctt ?? `${progress}% of ${Math.min(100, progress + 15)}%`,
        trend,
        trendUp,
        risk,
        notes: '—',
        budgetTone: budgetPct >= 80 ? 'warn' : 'ok',
      });
    });
  });

  rows.sort(
    (a, b) =>
      (imperativeOrder[a.imperative] ?? 9) - (imperativeOrder[b.imperative] ?? 9)
      || a.imperative.localeCompare(b.imperative)
      || a.kpi.localeCompare(b.kpi),
  );

  return applyTrackerRowSpans(rows);
}

function getInitiativeTrackerDetail(initiative, fastCategory) {
  const ref = INITIATIVE_TRACKER_REF[initiative.name.toLowerCase()];
  const progress = Math.round(
    initiative.projects.reduce((sum, project) => sum + project.progress, 0)
      / Math.max(initiative.projects.length, 1),
  );
  const defaultParent = fastCategory.name
    .replace(/^FOCUS &\s*|^ACCELERATE -\s*|^SCALE -\s*|^TRANSFORM -\s*/i, '')
    .trim();
  const delayed = initiative.projects.filter(
    (project) => project.status === 'delayed' || project.status === 'blocked',
  ).length;
  const budgetPct = ref?.budgetPct ?? Math.min(95, 18 + progress / 2);
  const budgetTotalM = ref?.budgetTotalM ?? 2 + (initiative.projects.length % 4);
  const budgetSpentM = ref?.budgetSpentM ?? Math.round(budgetTotalM * (budgetPct / 100) * 10) / 10;

  return {
    parentInitiative: ref?.initiative ?? defaultParent,
    imperative: IMPERATIVE_LABELS[fastCategory.shortName] || fastCategory.shortName,
    budgetPct,
    budgetLabel: formatBudgetM(budgetTotalM, budgetSpentM, budgetPct),
    budgetTone: budgetPct >= 80 ? 'warn' : 'ok',
    schedulePct: ref?.schedulePct ?? progress,
    target: ref?.target ?? `${Math.min(100, progress + 15)}%`,
    ctt: ref?.ctt ?? `${progress}% of ${Math.min(100, progress + 15)}%`,
    trend: ref?.trend ?? [
      Math.max(0, progress - 10),
      Math.max(0, progress - 6),
      Math.max(0, progress - 3),
      progress,
    ],
    trendUp: ref?.trendUp ?? progress >= (ref?.trend?.[0] ?? progress - 5),
    risk: ref?.risk ?? (initiative.status === 'on-track' ? 'low' : initiative.status === 'at-risk' ? 'medium' : 'high'),
    source: ref?.source ?? 'sample',
    delayed,
  };
}

function InitiativeTracker({ rows, lastUpdated, onOpenInitiative }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = !q
      ? rows
      : rows.filter(
        (r) =>
          r.imperative.toLowerCase().includes(q)
          || r.kpi.toLowerCase().includes(q)
          || r.initiative?.toLowerCase().includes(q),
      );
    return applyTrackerRowSpans(base);
  }, [rows, query]);

  const updatedLabel = useMemo(() => formatAppDateTime(lastUpdated), [lastUpdated]);

  return (
    <section className="def-cockpit-section def-cockpit-tracker def-cockpit-interactive def-stagger-in" style={{ '--stagger': '400ms' }}>
      <div className="def-tracker-head">
        <div className="def-tracker-head-main">
          <h2 className="def-cockpit-section-title">Initiative scorecard</h2>
          <p className="def-tracker-updated">Last updated: {updatedLabel}</p>
        </div>
        <div className="def-tracker-legend">
          <span className="def-tracker-legend-item adp"><i aria-hidden="true" /> Source: ADP / Provided by ADP</span>
          <span className="def-tracker-legend-item sample"><i aria-hidden="true" /> Illustrative data / Sample data</span>
        </div>
      </div>
      <div className="def-tracker-toolbar">
        <label className="def-tracker-search">
          <span className="sr-only">Search initiatives</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search initiative…"
          />
        </label>
        <span className="def-tracker-count">{filtered.length} initiatives</span>
      </div>
      <InitiativeKpiTable
        rows={filtered}
        showImperativeColumn
        onRowClick={onOpenInitiative ? (row) => onOpenInitiative(row.fastId, row.initiativeId) : undefined}
        emptyMessage="No initiatives match your search."
      />
    </section>
  );
}

function buildLayOfLandCategories() {
  const fastMap = new Map();
  LAY_OF_LAND_ROWS.forEach((row, index) => {
    const fastId = toSlug(row.fast);
    if (!fastMap.has(fastId)) fastMap.set(fastId, { id: fastId, name: row.fast, shortName: row.fastShort, initiatives: [] });
    const initiativeId = toSlug(row.initiative);
    const projects = [createDemoProject(`prj-${index + 1}`, row.initiative, index)];
    const teamSummary = summarizeProjects(projects);
    fastMap.get(fastId).initiatives.push({
      id: initiativeId, name: row.initiative, status: teamSummary.status,
      team: { id: toSlug(`${row.team}-${initiativeId}`), name: row.team, status: teamSummary.status, summary: teamSummary },
      projects,
    });
  });
  return Array.from(fastMap.values()).map((fast) => {
    const allProjects = fast.initiatives.flatMap((i) => i.projects);
    const delayed = allProjects.filter((p) => p.status === 'delayed' || p.status === 'blocked').length;
    const healthScore = Math.max(52, Math.min(92, Math.round(allProjects.reduce((s, p) => s + p.progress, 0) / Math.max(allProjects.length, 1))));
    return {
      ...fast,
      status: delayed >= 3 ? 'at-risk' : delayed >= 1 ? 'delayed' : 'on-track',
      healthScore,
      summary: {
        initiatives: fast.initiatives.length,
        teams: new Set(fast.initiatives.map((i) => i.team.name)).size,
        activeProjects: allProjects.length,
        delayedProjects: delayed,
        avgUtilization: Math.round(allProjects.reduce((s, p) => s + p.progress, 0) / Math.max(allProjects.length, 1)),
      },
    };
  });
}

function computePortfolioSummary(fastCategories) {
  const initiatives = fastCategories.flatMap((f) => f.initiatives);
  const projects = initiatives.flatMap((i) => i.projects);
  const teams = new Set(initiatives.map((i) => i.team.name));
  const activeProjects = projects.filter((p) => p.status !== 'completed').length;
  const delayedProjects = projects.filter((p) => p.status === 'delayed' || p.status === 'blocked').length;
  const atRiskProjects = projects.filter((p) => p.status === 'at-risk' || p.risk === 'high').length;
  const onTrackProjects = projects.filter((p) => p.status === 'on-track').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const offTrackProjects = projects.filter((p) => ['at-risk', 'delayed', 'blocked'].includes(p.status)).length;
  const overallHealth = projects.length ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0;
  const denom = Math.max(projects.length, 1);
  return {
    totalFastCategories: fastCategories.length,
    totalInitiatives: initiatives.length,
    totalTeams: teams.size,
    totalProjects: projects.length,
    activeProjects,
    delayedProjects,
    atRiskProjects,
    onTrackProjects,
    completedProjects,
    offTrackProjects,
    onTrackPct: Math.round((onTrackProjects / denom) * 100),
    atRiskPct: Math.round((atRiskProjects / denom) * 100),
    offTrackPct: Math.round((offTrackProjects / denom) * 100),
    overallHealth,
    totalDevelopers: projects.reduce((s, p) => s + p.teamSize, 0),
  };
}

const FAST_CATEGORIES = buildLayOfLandCategories();

const ORG_DATA = {
  organization: {
    name: 'ADP Demo',
    lastUpdated: '2026-05-25T09:30:00+05:30',
    viewerName: 'C. Coleman',
    viewerRole: 'Chief Executive',
  },

  ceoSummary: computePortfolioSummary(FAST_CATEGORIES),

  ceoTrends: {
    targetHealth: 80,
    symbol: 'PORTFOLIO',
    ranges: ['8W', '6M'],
    weekly: [
      { label: '31 Mar', open: 67, high: 70, low: 66, close: 68, volume: 1840, onTrack: 5, atRisk: 3, delayed: 2, utilization: 81 },
      { label: '7 Apr', open: 68, high: 71, low: 67, close: 70, volume: 1920, onTrack: 5, atRisk: 3, delayed: 2, utilization: 82 },
      { label: '14 Apr', open: 70, high: 72, low: 69, close: 71, volume: 2050, onTrack: 6, atRisk: 3, delayed: 2, utilization: 83 },
      { label: '21 Apr', open: 71, high: 72, low: 68, close: 69, volume: 2180, onTrack: 5, atRisk: 4, delayed: 3, utilization: 84 },
      { label: '28 Apr', open: 69, high: 73, low: 68, close: 72, volume: 2010, onTrack: 6, atRisk: 3, delayed: 2, utilization: 85 },
      { label: '5 May', open: 72, high: 74, low: 71, close: 73, volume: 2240, onTrack: 6, atRisk: 4, delayed: 3, utilization: 86 },
      { label: '12 May', open: 73, high: 74, low: 70, close: 71, volume: 2090, onTrack: 6, atRisk: 4, delayed: 3, utilization: 87 },
      { label: '19 May', open: 71, high: 73, low: 70, close: 72, volume: 2160, onTrack: 6, atRisk: 4, delayed: 3, utilization: 87 },
    ],
    monthly: [
      { label: 'Dec', open: 73, high: 75, low: 72, close: 74, volume: 8200, onTrack: 5, atRisk: 2, delayed: 1, utilization: 78 },
      { label: 'Jan', open: 74, high: 75, low: 71, close: 73, volume: 8450, onTrack: 5, atRisk: 3, delayed: 2, utilization: 80 },
      { label: 'Feb', open: 73, high: 74, low: 70, close: 71, volume: 8680, onTrack: 5, atRisk: 3, delayed: 2, utilization: 82 },
      { label: 'Mar', open: 71, high: 72, low: 69, close: 70, volume: 8920, onTrack: 6, atRisk: 3, delayed: 2, utilization: 83 },
      { label: 'Apr', open: 70, high: 72, low: 69, close: 71, volume: 9100, onTrack: 6, atRisk: 4, delayed: 3, utilization: 85 },
      { label: 'May', open: 71, high: 73, low: 70, close: 72, volume: 9280, onTrack: 6, atRisk: 4, delayed: 3, utilization: 87 },
    ],
  },

  fastCategories: FAST_CATEGORIES,
};

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

const STATUS_META = {
  'on-track': { label: 'On Track', color: '#059669', bg: '#ecfdf5' },
  delayed: { label: 'Delayed', color: '#d97706', bg: '#fffbeb' },
  blocked: { label: 'Blocked', color: '#dc2626', bg: '#fef2f2' },
  completed: { label: 'Completed', color: '#2563eb', bg: '#eff6ff' },
  'at-risk': { label: 'At Risk', color: '#ea580c', bg: '#fff7ed' },
};

const RISK_META = {
  low: { label: 'Low Risk', color: '#059669' },
  medium: { label: 'Medium Risk', color: '#d97706' },
  high: { label: 'High Risk', color: '#dc2626' },
};

const MODULE_STATUS = {
  done: { label: 'Done', color: '#059669', bg: '#ecfdf5' },
  'in-progress': { label: 'In Progress', color: '#2563eb', bg: '#eff6ff' },
  pending: { label: 'Pending', color: '#64748b', bg: '#f1f5f9' },
};

function healthColor(score) {
  if (score >= 80) return '#059669';
  if (score >= 65) return '#d97706';
  return '#dc2626';
}

function findFastCategory(id) {
  return ORG_DATA.fastCategories.find((f) => f.id === id);
}

function findInitiative(fastCategory, initiativeId) {
  return fastCategory?.initiatives.find((i) => i.id === initiativeId);
}

function findProject(initiative, projectId) {
  return initiative?.projects.find((p) => p.id === projectId);
}

function getInitials(name) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

const CRITICAL_STATUS = new Set(['at-risk', 'delayed', 'blocked']);

/* ─────────────────────────────────────────────────────────────
   UI PRIMITIVES
───────────────────────────────────────────────────────────── */

function StatusPill({ status }) {
  const meta = STATUS_META[status] || { label: status, color: '#64748b', bg: '#f1f5f9' };
  const isCritical = CRITICAL_STATUS.has(status);
  return (
    <span
      className={`def-pill${isCritical ? ' def-pill-pulse' : ''}`}
      style={{ color: meta.color, background: meta.bg, borderColor: `${meta.color}44`, boxShadow: `0 0 0 1px ${meta.color}18` }}
    >
      {isCritical && <span className="def-pill-dot" style={{ background: meta.color }} />}
      {meta.label}
    </span>
  );
}

function RiskBadge({ risk }) {
  const meta = RISK_META[risk] || { label: risk, color: '#64748b' };
  return (
    <span className="def-risk" style={{ color: meta.color, borderColor: `${meta.color}33`, background: `${meta.color}0d` }}>
      {meta.label}
    </span>
  );
}

function ProgressBar({ value, color, animate = true }) {
  const fillColor = color || healthColor(value);
  return (
    <div className="def-progress-track">
      <div
        className={`def-progress-fill${animate ? ' def-progress-animate' : ''}`}
        style={{ '--def-progress': `${Math.min(value, 100)}%`, background: fillColor }}
      />
    </div>
  );
}

function KpiStrip({ items }) {
  const icons = {
    'Overall Health': '◆',
    'Active Projects': '▣',
    'On Track': '✓',
    'At Risk': '!',
    'Delayed / Blocked': '⏱',
    'Delayed': '⏱',
    Completed: '★',
    'Health Score': '◆',
    'Team Leads': '👥',
    Developers: '⌘',
    'Avg Utilization': '⚡',
    Utilization: '⚡',
    'Team Size': '⌘',
    'Pending Modules': '▤',
    Progress: '↗',
    Planned: '📅',
    Elapsed: '⏳',
    Delay: '⚠',
  };

  return (
    <div className={`def-kpi-strip${items.length === 4 ? ' def-kpi-strip-quad' : ''}`}>
      {items.map((item, index) => (
        <div
          key={item.label}
          className="def-kpi-item def-stagger-in"
          style={{
            '--stagger': `${index * 70}ms`,
            '--kpi-color': item.color || '#8b5cf6',
          }}
        >
          <div className="def-kpi-icon-wrap">
            <span className="def-kpi-icon">{icons[item.label] || '●'}</span>
          </div>
          <div className="def-kpi-body">
            <span className="def-kpi-num">{item.value}</span>
            <span className="def-kpi-lbl">{item.label}</span>
          </div>
          <div className="def-kpi-glow" />
        </div>
      ))}
    </div>
  );
}

function SectionCard({ title, desc, children, className = '' }) {
  return (
    <section className={`def-panel ${className}`.trim()}>
      {(title || desc) && (
        <div className="def-panel-head">
          {title && <h2 className="def-section-title">{title}</h2>}
          {desc && <p className="def-section-desc">{desc}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

function HierarchyTrail({ items }) {
  if (!items?.length) return null;
  return (
    <nav className="def-breadcrumb" aria-label="Organization hierarchy">
      {items.map((item, index) => (
        <span key={item.key} className="def-bc-item">
          {index > 0 && <span className="def-bc-sep" aria-hidden="true">›</span>}
          {item.onClick ? (
            <button type="button" className="def-bc-link" onClick={item.onClick}>
              {item.tier && <span className="def-bc-tier">{item.tier}</span>}
              {item.label}
            </button>
          ) : (
            <span className="def-bc-current">
              {item.tier && <span className="def-bc-tier">{item.tier}</span>}
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

function AppSidebar({
  layer,
  fastCategory,
  initiative,
  onGoCeo,
  onSelectFast,
  onSelectInitiative,
  open,
  onNavigate,
}) {
  const pillarFasts = ORG_DATA.fastCategories;
  /** Placeholder slice for portfolios outside pillars (empty in demo lay-of-land). */
  const otherInitiatives = [];

  const [expandedFast, setExpandedFast] = useState(fastCategory?.id ?? pillarFasts[0]?.id ?? null);

  useEffect(() => {
    if (fastCategory?.id) setExpandedFast(fastCategory.id);
  }, [fastCategory?.id]);

  const goCeo = () => {
    onGoCeo();
    onNavigate?.();
  };

  const pickFast = (fastId) => {
    onSelectFast(fastId);
    setExpandedFast(fastId);
    onNavigate?.();
  };

  const pickInitiative = (fastId, initiativeId) => {
    onSelectInitiative(fastId, initiativeId);
    setExpandedFast(fastId);
    onNavigate?.();
  };

  const toggleFast = (fastId) => {
    setExpandedFast((prev) => (prev === fastId ? null : fastId));
  };

  return (
    <aside className={`def-sidebar${open ? ' def-sidebar-open' : ''}`}>
      <nav className="def-sidebar-nav">
        <p className="def-sidebar-label">Executive</p>
        <button
          type="button"
          className={`def-sidebar-link def-sidebar-link-ceo${layer === 'ceo' ? ' active' : ''}`}
          onClick={goCeo}
        >
          <span className="def-sidebar-tier def-sidebar-tier-ceo">CC</span>
          <span className="def-sidebar-link-text">
            <strong>Command Center Cockpit</strong>
            <small>Portfolio health & FAST pillars</small>
          </span>
        </button>

        <p className="def-sidebar-label def-sidebar-label-section">
          FAST pillars
          <span className="def-sidebar-count">{pillarFasts.length}</span>
        </p>

        {pillarFasts.map((fast) => {
          const isExpanded = expandedFast === fast.id;
          const isActive = fastCategory?.id === fast.id;
          return (
            <div key={fast.id} className={`def-sidebar-group${isActive ? ' active' : ''}`}>
              <div className="def-sidebar-row">
                <button
                  type="button"
                  className={`def-sidebar-link${isActive && layer !== 'ceo' ? ' active' : ''}`}
                  onClick={() => pickFast(fast.id)}
                >
                  <span className="def-sidebar-tier def-sidebar-tier-mgr">{fast.shortName.slice(0, 2)}</span>
                  <span className="def-sidebar-link-text">
                    <strong>{fast.shortName}</strong>
                    <SidebarFastStatusRow fast={fast} />
                  </span>
                  <strong className="def-sidebar-score" style={{ color: healthColor(fast.healthScore) }}>
                    {fast.healthScore}%
                  </strong>
                </button>
                <button
                  type="button"
                  className={`def-sidebar-toggle${isExpanded ? ' open' : ''}`}
                  onClick={() => toggleFast(fast.id)}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? 'Hide' : 'Show'} initiatives under ${fast.shortName}`}
                  title={`${isExpanded ? 'Hide' : 'Show'} initiatives`}
                >
                  {isExpanded ? '▾' : '▸'}
                </button>
              </div>
              {isExpanded && (
                <div className="def-sidebar-nested">
                  <p className="def-sidebar-sublabel">
                    Initiatives
                    <span className="def-sidebar-count">{fast.initiatives.length}</span>
                  </p>
                  {fast.initiatives.map((ini) => {
                    const isIniActive = initiative?.id === ini.id && fastCategory?.id === fast.id;
                    return (
                      <button
                        key={ini.id}
                        type="button"
                        className={`def-sidebar-nested-link${isIniActive ? ' active' : ''}`}
                        onClick={() => pickInitiative(fast.id, ini.id)}
                      >
                        <span className="def-sidebar-tier def-sidebar-tier-tl">★</span>
                        <span className="def-sidebar-nested-text">
                          <strong>{ini.name}</strong>
                          <small>{ini.team?.name ?? 'Team'}</small>
                        </span>
                        <StatusPill status={ini.status} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {otherInitiatives.length > 0 && (
          <>
            <p className="def-sidebar-label def-sidebar-label-section">
              Other portfolios
              <span className="def-sidebar-count">{otherInitiatives.length}</span>
            </p>
            {otherInitiatives.map((item) => (
              <button
                key={item.id}
                type="button"
                className="def-sidebar-link"
                onClick={() => pickInitiative(item.fastId, item.id)}
              >
                <span className="def-sidebar-tier def-sidebar-tier-tl">+</span>
                <span className="def-sidebar-link-text">
                  <strong>{item.name}</strong>
                  <small>Outside FAST taxonomy</small>
                </span>
              </button>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}

function AppFooter({ compact = false }) {
  return (
    <footer className={`def-footer${compact ? ' def-footer-compact' : ''}`}>
      <span>{ORG_DATA.ceoSummary.totalProjects} projects tracked</span>
    </footer>
  );
}

function Avatar({ name, tone = 'blue' }) {
  return <span className={`def-avatar def-avatar-${tone}`}>{getInitials(name)}</span>;
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="def-theme-toggle"
      onClick={onToggle}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? 'Dark mode' : 'Light mode'}
    >
      {theme === 'light' ? '☾' : '☀'}
    </button>
  );
}

const THEME_STORAGE_KEY = 'adp-demo-theme';


function sparkSeries(weekly, pick) {
  return weekly.map((w, ix) => ({ ix, v: pick(w) }));
}

function buildCockpitAnalytics(orgData, filterFastId) {
  const { fastCategories, ceoTrends, ceoSummary: globalSummary } = orgData;
  const pillarFasts = filterFastId ? fastCategories.filter((f) => f.id === filterFastId) : fastCategories;
  const initiatives = pillarFasts.flatMap((f) => f.initiatives.map((i) => ({
    ...i,
    pillar: f.shortName,
    fastId: f.id,
  })));
  const projects = initiatives.flatMap((i) => i.projects);
  const ceoSummary = filterFastId ? computePortfolioSummary(pillarFasts) : globalSummary;

  const weekly = ceoTrends.weekly;
  const monthly = ceoTrends.monthly.slice(-4);

  const statusMovement = weekly.map((w) => ({
    label: w.label,
    OnTrack: w.onTrack ?? 0,
    AtRisk: w.atRisk ?? 0,
    Delayed: w.delayed ?? 0,
  }));

  const quarterlyBars = monthly.map((m, i) => ({
    quarter: `${m.label}`,
    onTrack: m.onTrack ?? 0,
    atRisk: m.atRisk ?? 0,
    delayed: m.delayed ?? 0,
    sortKey: i,
  }));

  const recoveryTable = initiatives
    .filter((ini) => ini.projects.some((p) => CRITICAL_STATUS.has(p.status)))
    .slice(0, 8)
    .map((ini) => {
      const flagged = [...ini.projects].filter((p) => CRITICAL_STATUS.has(p.status)).sort((a, b) => (b.delayDays || 0) - (a.delayDays || 0))[0];
      return {
        id: `${ini.fastId}-${ini.id}`,
        initiative: ini.name,
        pillar: ini.pillar,
        path: flagged?.delayReason || 'Remediation + dependency burn-down plan',
        eta: formatDate(flagged?.timeline.projectedEndDate || flagged?.timeline.expectedEndDate),
        sponsor: ini.team?.name ?? 'Delivery sponsor',
      };
    });

  const teamOverview = initiatives.map((ini) => ({
    id: `${ini.fastId}-${ini.team?.id}-${ini.id}`,
    team: ini.team?.name ?? 'Team',
    initiative: ini.name,
    pillar: ini.pillar,
    status: ini.status,
    projects: ini.projects.length,
    utilization: ini.team?.summary?.avgUtilization ?? 0,
    health: Math.round(ini.projects.reduce((s, p) => s + p.progress, 0) / Math.max(ini.projects.length, 1)),
  }));

  const initiativeTracker = buildInitiativeTrackerRows(pillarFasts);

  const topRisks = [...projects]
    .filter((p) => p.risk === 'high' || CRITICAL_STATUS.has(p.status))
    .sort((a, b) => (b.delayDays || 0) - (a.delayDays || 0))
    .slice(0, 7)
    .map((p) => ({
      id: p.id,
      title: p.name,
      level: p.risk === 'high' ? 'High risk' : p.status === 'blocked' ? 'Blocked' : 'At risk delivery',
      note: p.delayReason || `Client: ${p.client}`,
      risk: p.risk,
    }));

  const upcomingMilestones = initiatives
    .flatMap((ini) =>
      ini.projects.flatMap((p) =>
        p.modules
          .filter((m) => m.status !== 'done')
          .map((m) => ({
            id: `${p.id}-${m.id}`,
            initiative: ini.name,
            pillar: ini.pillar,
            project: p.name,
            milestone: m.name,
            pacing: `${m.actualDays}/${m.estimatedDays}d`,
          }))))
    .slice(0, 6);

  const insightLines = [];
  insightLines.push(`The FAST framework tracks ${ceoSummary.totalInitiatives} initiatives across ${ceoSummary.totalTeams} delivery teams.`);
  insightLines.push(`Portfolio health is ${ceoSummary.overallHealth}%. ${ceoSummary.offTrackPct}% of projects need attention or escalation.`);
  insightLines.push(ceoSummary.delayedProjects || ceoSummary.atRiskProjects
    ? `Review PI acceleration and open dependencies — ${ceoSummary.delayedProjects} delayed or blocked projects remain.`
    : 'Progress is stable week over week. Monitor vendor and cloud migration risks.');

  const lastQuarterBullets = [
    `Average team utilization was ${weekly[weekly.length - 1]?.utilization ?? 85}%. Portfolio health ended near ${weekly[weekly.length - 1]?.close ?? ceoSummary.overallHealth}%.`,
    `${ceoSummary.onTrackPct}% of projects are on track across FAST pillars.`,
    `${ceoSummary.atRiskProjects > 0 ? `${ceoSummary.atRiskProjects} initiatives need executive sponsorship` : 'No major executive sponsorship gaps this quarter'}.`,
  ];

  const sparks = {
    health: sparkSeries(weekly, (w) => w.close),
    mix: sparkSeries(weekly, (w) => w.onTrack + w.atRisk * 1.05),
    pillars: sparkSeries(weekly, (w) => w.close * 1.03),
    initiatives: sparkSeries(weekly, () => ceoSummary.totalInitiatives),
    velocity: sparkSeries(weekly, (w) => w.utilization ?? 82),
    risk: sparkSeries(weekly, (w) => (w.delayed + w.atRisk) * -1.8 + 68),
    complete: sparkSeries(weekly, (w) => w.close * 0.92),
  };

  return {
    ceoSummary,
    statusMovement,
    quarterlyBars,
    recoveryTable,
    teamOverview,
    initiativeTracker,
    topRisks,
    upcomingMilestones,
    insightLines,
    lastQuarterBullets,
    sparks,
  };
}

function useViewport() {
  const [vp, setVp] = useState(() => ({
    compact: false,
    isMobile: false,
    isTablet: false,
    chartH: 210,
    wsChartH: 192,
    wsBarH: 156,
  }));

  useEffect(() => {
    const sync = () => {
      const width = window.innerWidth;
      setVp({
        compact: width < 640,
        isMobile: width < 480,
        isTablet: width < 768,
        chartH: width < 480 ? 160 : width < 640 ? 180 : width < 768 ? 195 : width < 1024 ? 205 : 220,
        wsChartH: width < 480 ? 148 : width < 640 ? 168 : width < 768 ? 176 : width < 1024 ? 184 : 192,
        wsBarH: width < 480 ? 118 : width < 640 ? 132 : width < 768 ? 140 : width < 1024 ? 148 : 156,
      });
    };
    sync();
    window.addEventListener('resize', sync, { passive: true });
    return () => window.removeEventListener('resize', sync);
  }, []);

  return vp;
}

const FAST_PILLAR_ICONS = {
  FOCUS: '◎',
  ACCELERATE: '⚡',
  SCALE: '◆',
  TRANSFORM: '↻',
};

const COCKPIT_METRIC_ICONS = {
  'FAST pillars': '🏛',
  Initiatives: '📊',
  'Projects in flight': '📁',
  'On-track mix': '✓',
  'At-risk share': '◐',
  'Off-track share': '⚠',
  'Completed projects': '★',
  'Portfolio health': '◆',
};

function CockpitMetricSpark({ data, stroke }) {
  const line = stroke || '#6366f1';
  return (
    <div className="def-cockpit-metric-spark">
      <ResponsiveContainer width="100%" height={40}>
        <LineChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <XAxis dataKey="ix" hide />
          <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
          <Line type="monotone" dataKey="v" stroke={line} strokeWidth={2.5} dot={false} isAnimationActive animationDuration={900} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function CockpitMetricCard({ title, value, subtitle, accent, spark, delay = '0ms' }) {
  const icon = COCKPIT_METRIC_ICONS[title] || '●';
  return (
    <article className={`def-cockpit-metric-card def-cockpit-interactive def-stagger-in${accent ? ` ${accent}` : ''}`} style={{ '--stagger': delay }}>
      <div className="def-cockpit-metric-icon" aria-hidden="true">{icon}</div>
      <div className="def-cockpit-metric-copy">
        <span className="def-cockpit-metric-label">{title}</span>
        <strong className="def-cockpit-metric-value">{value}</strong>
        {subtitle ? <small className="def-cockpit-metric-sub">{subtitle}</small> : null}
      </div>
      <CockpitMetricSpark
        data={spark}
        stroke={accent === 'def-accent-amber' ? '#d97706' : accent === 'def-accent-rose' ? '#dc2626' : accent === 'def-accent-emerald' ? '#059669' : undefined}
      />
    </article>
  );
}

function FastHealthCard({ fast, theme, onSelectFast, index = 0 }) {
  const projects = fast.initiatives.flatMap((ini) => ini.projects);
  const onCount = projects.filter((p) => p.status === 'on-track').length;
  const atCount = projects.filter((p) => p.status === 'at-risk').length;
  const lateCount = projects.filter((p) => p.status === 'delayed' || p.status === 'blocked').length;
  const total = Math.max(projects.length, 1);
  const leadTeam = fast.initiatives[0]?.team?.name ?? 'Delivery team';
  const trendUp = fast.healthScore >= 70;

  const data = [
    { name: 'On Track', value: onCount || 0, fill: '#22c55e' },
    { name: 'At Risk', value: atCount, fill: '#f59e0b' },
    { name: 'Off Track', value: lateCount, fill: '#ef4444' },
  ].filter((d) => d.value > 0);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="def-cockpit-fast-health def-cockpit-interactive def-stagger-in"
      style={{ '--stagger': `${120 + index * 70}ms` }}
      onClick={() => onSelectFast?.(fast.id)}
      aria-label={`Open ${fast.shortName} pillar`}
    >
      <div className="def-cockpit-fast-head">
        <span className="def-cockpit-fast-icon">{FAST_PILLAR_ICONS[fast.shortName] || '●'}</span>
        <div className="def-cockpit-fast-titles">
          <p className="def-cockpit-fast-kicker">{fast.shortName}</p>
          <h3>{fast.name}</h3>
        </div>
      </div>
      <div className="def-cockpit-fast-body">
        <div className="def-cockpit-fast-chart">
          <ResponsiveContainer width="100%" height={88}>
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={data.length ? data : [{ name: 'Empty', value: 1, fill: isDark ? '#334155' : '#e2e8f0' }]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="88%"
                paddingAngle={3}
                stroke="none"
                isAnimationActive
                animationDuration={800}
              >
                {(data.length ? data : [{ fill: isDark ? '#334155' : '#e2e8f0' }]).map((e) => (
                  <Cell key={e.name || 'empty'} fill={e.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="def-cockpit-fast-donut-center">
            <strong>{total}</strong>
            <span>Initiatives</span>
          </div>
        </div>
        <ul className="def-cockpit-fast-legend">
          <li><i style={{ background: '#22c55e' }} />On Track <strong>{onCount}</strong></li>
          <li><i style={{ background: '#f59e0b' }} />At Risk <strong>{atCount}</strong></li>
          <li><i style={{ background: '#ef4444' }} />Off Track <strong>{lateCount}</strong></li>
        </ul>
      </div>
      <div className="def-cockpit-fast-foot">
        <span className="def-cockpit-fast-team">Team · {leadTeam}</span>
        <span className={`def-cockpit-fast-trend${trendUp ? ' up' : ' down'}`}>
          {trendUp ? '↑' : '↓'} {Math.abs(fast.healthScore % 15) + 4}%
        </span>
      </div>
    </button>
  );
}

function CockpitStackedArea({ data, theme, height = 240 }) {
  const chart = useResponsiveChart();
  const isDark = theme === 'dark';
  const tick = isDark ? '#a1a1aa' : '#475569';
  const grid = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.12)';
  const first = data[0];
  const last = data[data.length - 1];
  const improved = Math.max(0, (last?.OnTrack ?? 0) - (first?.OnTrack ?? 0));
  const deteriorated = Math.max(0, (last?.Delayed ?? 0) - (first?.Delayed ?? 0));
  const net = improved - deteriorated;

  return (
    <div className="def-cockpit-chart-card def-cockpit-interactive def-stagger-in" style={{ '--stagger': '160ms' }}>
      <div className="def-cockpit-chart-head">
        <h3 className="def-cockpit-card-title">Status movement</h3>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={chart.chartMargin}>
          <defs>
            <linearGradient id="cockpitOn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0.06} />
            </linearGradient>
            <linearGradient id="cockpitRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.42} />
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.06} />
            </linearGradient>
            <linearGradient id="cockpitLate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#f87171" stopOpacity={0.06} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 8" stroke={grid} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: tick, fontSize: chart.tickSmall }} axisLine={{ stroke: grid }} tickMargin={4} />
          <YAxis width={chart.yAxisWidth} tick={{ fill: tick, fontSize: chart.tickSmall }} axisLine={{ stroke: grid }} tickMargin={2} />
          <Tooltip />
          <Legend {...chart.legendProps} iconSize={8} formatter={(value) => <span style={{ color: tick }}>{value}</span>} />
          <Area name="On track" type="monotone" dataKey="OnTrack" stackId="mix" stroke="#059669" fill="url(#cockpitOn)" isAnimationActive animationDuration={900} />
          <Area name="At risk" type="monotone" dataKey="AtRisk" stackId="mix" stroke="#d97706" fill="url(#cockpitRisk)" isAnimationActive animationDuration={900} />
          <Area name="Delayed / blocked" type="monotone" dataKey="Delayed" stackId="mix" stroke="#dc2626" fill="url(#cockpitLate)" isAnimationActive animationDuration={900} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="def-cockpit-movement-stats">
        <div className="def-cockpit-move-stat improved">
          <span>Improved</span>
          <strong>+{improved}</strong>
        </div>
        <div className="def-cockpit-move-stat deteriorated">
          <span>Deteriorated</span>
          <strong>−{deteriorated}</strong>
        </div>
        <div className={`def-cockpit-move-stat net${net >= 0 ? ' positive' : ' negative'}`}>
          <span>Net movement</span>
          <strong>{net >= 0 ? '+' : ''}{net}</strong>
        </div>
      </div>
    </div>
  );
}

function CockpitQuarterBars({ rows, theme, height = 240, compact = false }) {
  const chart = useResponsiveChart();
  const isDark = theme === 'dark';
  const tick = isDark ? '#a1a1aa' : '#475569';
  const grid = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(226,232,240,1)';
  return (
    <div className="def-cockpit-chart-card def-cockpit-interactive def-stagger-in" style={{ '--stagger': '240ms' }}>
      <div className="def-cockpit-chart-head">
        <h3 className="def-cockpit-card-title">Quarterly throughput</h3>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart layout="vertical" data={rows} margin={chart.axisMargin}>
          <CartesianGrid strokeDasharray="3 8" stroke={grid} horizontal={false} />
          <XAxis type="number" tick={{ fill: tick, fontSize: chart.tickSmall }} axisLine={{ stroke: grid }} />
          <YAxis type="category" dataKey="quarter" width={compact ? chart.yAxisWidth - 16 : chart.yAxisWidth - 8} tick={{ fill: tick, fontSize: chart.tickSmall }} axisLine={{ stroke: grid }} />
          <Tooltip />
          <Legend {...chart.legendProps} iconSize={8} />
          <Bar dataKey="onTrack" name="On track" stackId="sq" fill="#34d399" radius={[4, 0, 0, 4]} isAnimationActive animationDuration={800} />
          <Bar dataKey="atRisk" name="At risk" stackId="sq" fill="#fbbf24" isAnimationActive animationDuration={800} />
          <Bar dataKey="delayed" name="Delayed" stackId="sq" fill="#f87171" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LAYER VIEWS
───────────────────────────────────────────────────────────── */

function CeoView({ theme, onSelectFast, onOpenInitiative }) {
  const vp = useViewport();
  const [portfolioScope, setPortfolioScope] = useState('all');
  const analytics = useMemo(
    () => buildCockpitAnalytics(ORG_DATA, portfolioScope === 'all' ? null : portfolioScope),
    [portfolioScope],
  );
  const { organization } = ORG_DATA;
  const filterOptions = useMemo(
    () => [{ id: 'all', label: 'All FAST pillars' }, ...ORG_DATA.fastCategories.map((f) => ({ id: f.id, label: f.shortName }))],
    [],
  );
  const wsBlockHeight = vp.wsChartH + vp.wsBarH + 108;

  return (
    <div
      className={`def-layer def-page-enter def-cockpit def-cockpit-theme-${theme}`}
      style={{ '--cockpit-chart-h': `${vp.chartH}px`, '--cockpit-ws-h': `${wsBlockHeight}px` }}
    >
      <header className="def-cockpit-top def-cockpit-interactive def-stagger-in" style={{ '--stagger': '0ms' }}>
        <div className="def-cockpit-top-copy">
          <p className="def-cockpit-eyebrow">Command Center</p>
          <h1 className="def-cockpit-title">Command Center Cockpit</h1>
        </div>
        <div className="def-cockpit-top-controls">
          <label className="def-cockpit-filter">
            <span>Scope</span>
            <select value={portfolioScope} onChange={(e) => setPortfolioScope(e.target.value)}>
              {filterOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </label>
          <div className="def-updated def-live-badge def-cockpit-live">
            <span className="def-live-dot" />
            Live
          </div>
          <div className="def-cockpit-user-chip">
            <Avatar name={organization.viewerName} tone="indigo" />
            <div>
              <strong>{organization.viewerName}</strong>
              <small>{organization.viewerRole}</small>
            </div>
          </div>
        </div>
      </header>

      <div className="def-cockpit-metrics-row">
        <CockpitMetricCard title="FAST pillars" value={analytics.ceoSummary.totalFastCategories} subtitle="Active pillars" spark={analytics.sparks.pillars} delay="0ms" accent="def-accent-emerald" />
        <CockpitMetricCard title="Initiatives" value={analytics.ceoSummary.totalInitiatives} subtitle="Active initiatives" spark={analytics.sparks.initiatives} delay="40ms" />
        <CockpitMetricCard title="Projects in flight" value={analytics.ceoSummary.activeProjects} subtitle={`${analytics.ceoSummary.totalProjects} total`} spark={analytics.sparks.mix} delay="80ms" />
        <CockpitMetricCard title="On-track mix" value={`${analytics.ceoSummary.onTrackPct}%`} subtitle={`${analytics.ceoSummary.onTrackProjects} projects`} spark={analytics.sparks.health} delay="120ms" accent="def-accent-emerald" />
        <CockpitMetricCard title="At-risk share" value={`${analytics.ceoSummary.atRiskPct}%`} subtitle={`${analytics.ceoSummary.atRiskProjects} projects`} spark={analytics.sparks.risk} delay="160ms" accent="def-accent-amber" />
        <CockpitMetricCard title="Off-track share" value={`${analytics.ceoSummary.offTrackPct}%`} subtitle={`${analytics.ceoSummary.offTrackProjects} projects`} spark={analytics.sparks.risk} delay="200ms" accent="def-accent-rose" />
        <CockpitMetricCard title="Completed projects" value={analytics.ceoSummary.completedProjects} subtitle="Finished to date" spark={analytics.sparks.complete} delay="240ms" />
        <CockpitMetricCard title="Portfolio health" value={`${analytics.ceoSummary.overallHealth}%`} subtitle="Overall score" spark={analytics.sparks.velocity} delay="280ms" accent="def-accent-indigo" />
      </div>

      <section className="def-cockpit-section def-cockpit-interactive def-stagger-in" style={{ '--stagger': '60ms' }}>
        <h2 className="def-cockpit-section-title">FAST pillars health</h2>
        <div className="def-cockpit-fast-grid">
          {ORG_DATA.fastCategories.map((f, i) => (
            <FastHealthCard key={f.id} fast={f} theme={theme} onSelectFast={onSelectFast} index={i} />
          ))}
        </div>
      </section>

      <div className="def-cockpit-workspace">
        <div className="def-cockpit-ws-charts">
          <CockpitStackedArea data={analytics.statusMovement} theme={theme} height={vp.wsChartH} />
          <CockpitQuarterBars rows={analytics.quarterlyBars} theme={theme} height={vp.wsBarH} compact={vp.compact} />
        </div>
        <div className="def-cockpit-table-card def-cockpit-ws-recovery def-cockpit-interactive def-stagger-in" style={{ '--stagger': '200ms' }}>
          <h3 className="def-cockpit-card-title">Recovery plays</h3>
          <div className="def-cockpit-table-scroll def-cockpit-table-scroll-recovery">
            <table className="def-cockpit-table def-cockpit-table-recovery">
              <thead>
                <tr>
                  <th>Initiative</th>
                  <th>FAST</th>
                  <th>Path</th>
                  <th>ETA</th>
                  <th>Team</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recoveryTable.map((row) => (
                  <tr key={row.id}>
                    <td><strong>{row.initiative}</strong></td>
                    <td>{row.pillar}</td>
                    <td>{row.path}</td>
                    <td>{row.eta}</td>
                    <td>{row.sponsor}</td>
                  </tr>
                ))}
                {analytics.recoveryTable.length === 0 && (
                  <tr><td colSpan={5} className="def-cockpit-empty">No recovery actions.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="def-cockpit-rail">
          <div className="def-cockpit-rail-card def-cockpit-interactive def-stagger-in" style={{ '--stagger': '280ms' }}>
            <p className="def-cockpit-rail-label">Last quarter retrospective</p>
            <ul className="def-cockpit-bullets tight">
              {analytics.lastQuarterBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
          <div className="def-cockpit-rail-card def-cockpit-interactive def-stagger-in" style={{ '--stagger': '320ms' }}>
            <p className="def-cockpit-rail-label">Top delivery risks</p>
            <ul className="def-cockpit-risk-list">
              {analytics.topRisks.slice(0, 4).map((risk) => (
                <li key={risk.id}>
                  <div className="def-cockpit-risk-copy">
                    <strong>{risk.title}</strong>
                    <span>{risk.level}</span>
                  </div>
                  <span className={`def-cockpit-risk-score${risk.risk === 'high' ? ' high' : ''}`}>
                    {risk.risk === 'high' ? 25 : 18}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="def-cockpit-rail-card def-cockpit-interactive subtle def-stagger-in" style={{ '--stagger': '360ms' }}>
            <p className="def-cockpit-rail-label">Portfolio snapshot</p>
            <dl className="def-cockpit-dl">
              <div><dt>Teams online</dt><dd>{analytics.ceoSummary.totalTeams}</dd></div>
              <div><dt>Contributor hours</dt><dd>{analytics.ceoSummary.totalDevelopers}</dd></div>
            </dl>
          </div>
        </aside>
      </div>

      <InitiativeTracker
        rows={analytics.initiativeTracker}
        lastUpdated={organization.lastUpdated}
        onOpenInitiative={onOpenInitiative}
      />
    </div>
  );
}

function FastCategoryView({ fastCategory, onSelectInitiative, onSelectProject, onGoCeo, onBack }) {
  const scorecardRows = useMemo(
    () => fastCategory.initiatives.map((ini) => {
      const summary = buildInitiativeScorecardSummary(ini);
      return {
        id: ini.id,
        initiativeId: ini.id,
        kpi: ini.name,
        scorecardStatus: summary.scorecardStatus,
        current: summary.current,
        target2029: summary.target2029,
        targetYearOne: summary.targetYearOne,
        comments: summary.comments,
      };
    }),
    [fastCategory],
  );
  const imperative = IMPERATIVE_LABELS[fastCategory.shortName] || fastCategory.shortName;

  return (
    <div className="def-layer def-page-enter def-initiative-page">
      <HierarchyTrail
        items={[
          { key: 'sec', tier: 'Strategic Execution', label: 'Cockpit', onClick: onGoCeo },
          { key: 'fast', tier: 'FAST', label: fastCategory.shortName },
        ]}
      />

      <header className="def-initiative-header">
        <div className="def-initiative-header-main">
          <div className="def-initiative-meta">
            <span className="def-initiative-pillar">{imperative}</span>
            <span className="def-initiative-parent">{fastCategory.name}</span>
          </div>
          <h1 className="def-initiative-title">{fastCategory.shortName} pillar</h1>
          <p className="def-initiative-sub">
            {fastCategory.summary.initiatives} initiatives
            {' · '}
            {fastCategory.summary.activeProjects} projects
            {' · '}
            {fastCategory.summary.teams} teams
          </p>
        </div>
        <div className="def-initiative-header-aside">
          <StatusPill status={fastCategory.status} />
        </div>
      </header>

      <SectionCard
        title="Initiative KPIs"
        desc={`Executive initiative scorecard — ${fastCategory.initiatives.length} initiatives under ${imperative}`}
      >
        <InitiativeKpiTable
          rows={scorecardRows}
          onRowClick={(row) => onSelectInitiative(row.initiativeId)}
        />
      </SectionCard>

      <button type="button" className="def-back-btn" onClick={onBack}>← Back to Command Center Cockpit</button>
    </div>
  );
}

function InitiativeView({ fastCategory, initiative, onGoCeo, onGoFast, onGoTeam, onSelectProject }) {
  const detail = useMemo(
    () => getInitiativeTrackerDetail(initiative, fastCategory),
    [initiative, fastCategory],
  );
  const scorecard = useMemo(() => buildInitiativeScorecard(initiative), [initiative]);
  const kpiRows = useMemo(
    () => scorecard.kpis.map((row, index) => ({
      id: `${initiative.id}-kpi-${index}`,
      ...row,
    })),
    [initiative.id, scorecard.kpis],
  );
  const team = initiative.team;
  const teamSize = team?.summary?.developers
    ?? initiative.projects.reduce((sum, project) => sum + project.teamSize, 0);

  return (
    <div className="def-layer def-page-enter def-initiative-page">
      <HierarchyTrail
        items={[
          { key: 'sec', tier: 'Strategic Execution', label: 'Cockpit', onClick: onGoCeo },
          { key: 'fast', tier: 'FAST', label: fastCategory.shortName, onClick: onGoFast },
          { key: 'ini', tier: 'Initiative', label: initiative.name },
        ]}
      />

      <header className="def-initiative-header">
        <div className="def-initiative-header-main">
          <div className="def-initiative-meta">
            <span className="def-initiative-pillar">{detail.imperative}</span>
            <span className="def-initiative-parent">{detail.parentInitiative}</span>
          </div>
          <h1 className="def-initiative-title">{initiative.name}</h1>
          <p className="def-initiative-sub">
            Executive initiative scorecard — Q2 2026
            {' · '}
            Team: <strong>{team?.name ?? 'Unassigned'}</strong>
          </p>
        </div>
        <div className="def-initiative-header-aside">
          <StatusPill status={initiative.status} />
          <span className={`def-initiative-source ${detail.source}`}>
            {detail.source === 'adp' ? 'Provided by ADP' : 'Sample data'}
          </span>
        </div>
      </header>

      <StrategicTargetCards targets={scorecard.strategicTargets} />

      <SectionCard title="Initiative KPIs" desc="Key metrics tracked against 2029 and year-one targets">
        <InitiativeKpiTable rows={kpiRows} />
      </SectionCard>

      <div className="def-initiative-quick-stats">
        <div className="def-initiative-stat">
          <span className="def-initiative-stat-num">{initiative.projects.length}</span>
          <span className="def-initiative-stat-lbl">Active projects</span>
        </div>
        <div className="def-initiative-stat">
          <span className="def-initiative-stat-num">{detail.delayed}</span>
          <span className="def-initiative-stat-lbl">Delayed / blocked</span>
        </div>
        <div className="def-initiative-stat">
          <span className="def-initiative-stat-num">{teamSize}</span>
          <span className="def-initiative-stat-lbl">Team size</span>
        </div>
        <div className="def-initiative-stat">
          <span className="def-initiative-stat-num">{team?.summary?.avgUtilization ?? detail.schedulePct}%</span>
          <span className="def-initiative-stat-lbl">Avg utilization</span>
        </div>
      </div>

      <SectionCard
        title="Projects"
        desc={`${initiative.projects.length} program${initiative.projects.length !== 1 ? 's' : ''} under this initiative`}
      >
        <div className="def-table-wrap def-table-pro def-table-scroll-wrap">
          <table className="def-table def-project-table def-initiative-project-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Status</th>
                <th>Progress</th>
                <th>End date</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {initiative.projects.map((project) => (
                <tr key={project.id} className="def-table-row def-project-row">
                  <td>
                    <strong className="def-project-name">{project.name}</strong>
                    {project.delayReason && (
                      <span className="def-project-row-hint">{project.delayReason}</span>
                    )}
                  </td>
                  <td>{project.client}</td>
                  <td>
                    <div className="def-project-row-badges">
                      <StatusPill status={project.status} />
                      <RiskBadge risk={project.risk} />
                    </div>
                  </td>
                  <td>
                    <div className="def-inline-progress def-inline-progress-wide">
                      <ProgressBar value={project.progress} />
                      <span>{project.progress}%</span>
                    </div>
                  </td>
                  <td style={{
                    color: project.delayDays > 0 ? '#dc2626' : 'inherit',
                    fontWeight: project.delayDays > 0 ? 600 : 400,
                  }}
                  >
                    {formatDate(project.timeline.projectedEndDate)}
                    {project.delayDays > 0 && ` (+${project.delayDays}d)`}
                  </td>
                  <td className="def-project-row-action">
                    {onSelectProject ? (
                      <button
                        type="button"
                        className="def-btn-sm def-btn-ghost"
                        onClick={() => onSelectProject(project.id)}
                      >
                        Details
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="def-initiative-actions">
          <button type="button" className="def-btn-sm" onClick={onGoTeam}>
            View team workspace
          </button>
        </div>
      </SectionCard>

      <button type="button" className="def-back-btn" onClick={onGoCeo}>← Back to Command Center Cockpit</button>
    </div>
  );
}

const MODULE_CHART_COLORS = {
  done: '#34d399',
  'in-progress': '#6366f1',
  pending: '#94a3b8',
};

function buildModuleChartData(project) {
  const counts = { done: 0, 'in-progress': 0, pending: 0 };
  project.modules.forEach((m) => {
    counts[m.status] = (counts[m.status] || 0) + 1;
  });
  return Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([status, value]) => ({
      name: MODULE_STATUS[status].label,
      value,
      status,
      fill: MODULE_CHART_COLORS[status],
    }));
}

function buildProjectBurndown(project) {
  const totalWeeks = Math.max(4, Math.min(8, Math.ceil(project.duration.plannedDays / 14)));
  const elapsedWeeks = Math.max(
    1,
    Math.round((project.duration.elapsedDays / Math.max(project.duration.plannedDays, 1)) * totalWeeks),
  );
  return Array.from({ length: totalWeeks }, (_, i) => {
    const week = i + 1;
    const planned = Math.round((week / totalWeeks) * 100);
    let actual = null;
    if (week <= elapsedWeeks) {
      actual = week === elapsedWeeks
        ? project.progress
        : Math.round((week / elapsedWeeks) * project.progress * 0.94);
    }
    return { label: `W${week}`, planned, actual };
  });
}

function DrawerChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="def-drawer-chart-tooltip">
      <strong>{label}</strong>
      {payload.map((entry) => (
        <span key={entry.name || entry.dataKey}>
          {entry.name}: <strong>{entry.value}{entry.dataKey === 'util' || entry.name === 'Planned' || entry.name === 'Actual' ? '%' : ''}</strong>
        </span>
      ))}
    </div>
  );
}

function ProjectProgressGauge({ progress, theme }) {
  const ringData = [
    { name: 'complete', value: progress, fill: healthColor(progress) },
    { name: 'remaining', value: 100 - progress, fill: theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#e8edf4' },
  ];

  return (
    <div className="def-drawer-gauge">
      <ResponsiveContainer width="100%" aspect={1} minWidth={0}>
        <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <Pie
            data={ringData}
            cx="50%"
            cy="50%"
            innerRadius="68%"
            outerRadius="88%"
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            isAnimationActive
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="def-drawer-gauge-center">
        <strong>{progress}%</strong>
        <span>Complete</span>
      </div>
    </div>
  );
}

function ProjectDetailCharts({ project, theme }) {
  const isDark = theme === 'dark';
  const tick = isDark ? '#94949e' : '#64748b';
  const grid = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(148,163,184,0.2)';
  const moduleData = useMemo(() => buildModuleChartData(project), [project]);
  const burndownData = useMemo(() => buildProjectBurndown(project), [project]);

  return (
    <div className="def-drawer-charts def-drawer-charts-compact">
      <div className="def-drawer-chart-card">
        <div className="def-drawer-chart-head">
          <h3>Modules</h3>
          <span>{project.modules.length} total</span>
        </div>
        <div className="def-drawer-chart-wrap">
          <ResponsiveContainer width="100%" height={150} minWidth={0}>
            <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <Pie
                data={moduleData}
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {moduleData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<DrawerChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="def-drawer-donut-legend def-drawer-donut-legend-inline">
          {moduleData.map((item) => (
            <span key={item.status}>
              <i style={{ background: item.fill }} />
              {item.name} · {item.value}
            </span>
          ))}
        </div>
      </div>

      <div className="def-drawer-chart-card">
        <div className="def-drawer-chart-head">
          <h3>Delivery</h3>
          <span>Planned vs actual</span>
        </div>
        <div className="def-drawer-chart-wrap">
          <ResponsiveContainer width="100%" height={150} minWidth={0}>
            <ComposedChart data={burndownData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
              <defs>
                <linearGradient id="defDrawerArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke={grid} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: tick }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tick={{ fontSize: 10, fill: tick }}
                axisLine={false}
                tickLine={false}
                width={42}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<DrawerChartTooltip />} />
              <Legend verticalAlign="top" align="right" iconSize={8} wrapperStyle={{ fontSize: '10px', paddingBottom: '4px' }} />
              <Line type="monotone" dataKey="planned" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Planned" />
              <Area type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={2} fill="url(#defDrawerArea)" name="Actual" connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ProjectDetailContent({ project, theme }) {
  const onSchedule = project.delayDays <= 0;

  return (
    <>
      <div className="def-drawer-summary">
        <ProjectProgressGauge progress={project.progress} theme={theme} />
        <div className="def-drawer-summary-stats">
          <div className="def-drawer-summary-stat">
            <span>Duration</span>
            <strong>{project.duration.elapsedDays}d / {project.duration.plannedDays}d</strong>
            <small>{project.duration.remainingDays}d remaining</small>
          </div>
          <div className="def-drawer-summary-stat">
            <span>Target end</span>
            <strong>{formatDate(project.timeline.expectedEndDate)}</strong>
          </div>
          <div className="def-drawer-summary-stat">
            <span>Projected</span>
            <strong style={{ color: onSchedule ? '#059669' : '#dc2626' }}>
              {formatDate(project.timeline.projectedEndDate)}
              {!onSchedule && ` (+${project.delayDays}d)`}
            </strong>
          </div>
        </div>
      </div>

      {project.blockers.length > 0 && (
        <div className="def-drawer-alert def-drawer-alert-danger">
          <strong>Blockers</strong>
          <ul>{project.blockers.map((b) => <li key={b}>{b}</li>)}</ul>
        </div>
      )}

      {project.delayReason && (
        <div className="def-drawer-alert def-drawer-alert-warn">
          <strong>Delay</strong>
          <p>{project.delayReason}</p>
        </div>
      )}

      <ProjectDetailCharts project={project} theme={theme} />

      <div className="def-drawer-block def-drawer-block-compact">
        <div className="def-drawer-block-head">
          <h3>Task list</h3>
          <span>{project.modules.length} modules</span>
        </div>
        <div className="def-drawer-module-list">
          {project.modules.map((mod) => {
            const modMeta = MODULE_STATUS[mod.status];
            return (
              <article key={mod.id} className={`def-drawer-module def-drawer-module-${mod.status}`}>
                <div className="def-drawer-module-top">
                  <strong>{mod.name}</strong>
                  <span className="def-pill def-pill-sm" style={{ color: modMeta.color, background: modMeta.bg }}>
                    {modMeta.label}
                  </span>
                </div>
                <div className="def-drawer-module-meta">
                  <span>{mod.assignee}</span>
                  <span>{mod.estimatedDays}d est.{mod.actualDays ? ` · ${mod.actualDays}d actual` : ''}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="def-drawer-block def-drawer-block-compact">
        <div className="def-drawer-block-head">
          <h3>Team members</h3>
          <span>{project.developers.length} people</span>
        </div>
        <div className="def-drawer-team-list">
          {project.developers.map((dev) => (
            <article key={dev.id} className="def-drawer-team-row">
              <Avatar name={dev.name} tone="slate" />
              <div className="def-drawer-team-info">
                <strong>{dev.name}</strong>
                <span>{dev.role} · {dev.currentModule}</span>
              </div>
              <span
                className="def-drawer-team-util"
                style={{ color: dev.utilization > 90 ? '#dc2626' : dev.utilization > 80 ? '#6366f1' : '#059669' }}
              >
                {dev.utilization}%
              </span>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function ProjectDetailDrawer({ project, team, open, onClose, theme = 'light' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !project) return null;

  const onSchedule = project.delayDays <= 0;

  return (
    <div className="def-drawer-root open" role="presentation">
      <button type="button" className="def-drawer-backdrop" aria-label="Close project details" onClick={onClose} />
      <aside className="def-drawer def-drawer-pro" role="dialog" aria-modal="true" aria-labelledby="def-drawer-title">
        <header className="def-drawer-head def-drawer-head-clean">
          <div className="def-drawer-head-row">
            <span className="def-drawer-tier">Project details</span>
            <button type="button" className="def-drawer-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
          <h2 id="def-drawer-title">{project.name}</h2>
          <p className="def-drawer-subtitle">
            Client: <strong>{project.client}</strong>
            {' · '}
            Team: <strong>{team?.name ?? 'Unassigned'}</strong>
          </p>
          <div className="def-drawer-head-badges">
            <StatusPill status={project.status} />
            <RiskBadge risk={project.risk} />
            <span className={`def-drawer-schedule-chip${onSchedule ? ' ok' : ' late'}`}>
              {onSchedule ? 'On schedule' : `${project.delayDays} days behind`}
            </span>
          </div>
        </header>
        <div className="def-drawer-body def-drawer-body-pro">
          <ProjectDetailContent project={project} theme={theme} />
        </div>
      </aside>
    </div>
  );
}

function TeamView({
  fastCategory,
  initiative,
  team,
  activeProjectId,
  onOpenProject,
  onGoCeo,
  onGoFast,
  onGoInitiative,
}) {
  const projects = initiative.projects;
  const delayedCount = projects.filter(
    (project) => project.status === 'delayed' || project.status === 'blocked',
  ).length;
  const avgProgress = Math.round(
    projects.reduce((sum, project) => sum + project.progress, 0) / Math.max(projects.length, 1),
  );
  const teamSize = team.summary?.developers
    ?? projects.reduce((sum, project) => sum + project.teamSize, 0);

  return (
    <div className="def-layer def-page-enter def-initiative-page">
      <HierarchyTrail
        items={[
          { key: 'sec', tier: 'Strategic Execution', label: 'Cockpit', onClick: onGoCeo },
          { key: 'fast', tier: 'FAST', label: fastCategory.shortName, onClick: onGoFast },
          { key: 'ini', tier: 'Initiative', label: initiative.name, onClick: onGoInitiative },
          { key: 'team', tier: 'Team', label: team.name },
        ]}
      />

      <header className="def-initiative-header">
        <div className="def-initiative-header-main">
          <div className="def-initiative-meta">
            <span className="def-initiative-pillar">{fastCategory.shortName}</span>
            <span className="def-initiative-parent">{initiative.name}</span>
          </div>
          <h1 className="def-initiative-title">{team.name}</h1>
          <p className="def-initiative-sub">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
            {' · '}
            {teamSize} team members
            {' · '}
            {fastCategory.shortName} pillar
          </p>
        </div>
        <div className="def-initiative-header-aside">
          <StatusPill status={team.status ?? initiative.status} />
        </div>
      </header>

      <div className="def-initiative-quick-stats">
        <div className="def-initiative-stat">
          <span className="def-initiative-stat-num">{projects.length}</span>
          <span className="def-initiative-stat-lbl">Active projects</span>
        </div>
        <div className="def-initiative-stat">
          <span className="def-initiative-stat-num">{delayedCount}</span>
          <span className="def-initiative-stat-lbl">Delayed / blocked</span>
        </div>
        <div className="def-initiative-stat">
          <span className="def-initiative-stat-num">{avgProgress}%</span>
          <span className="def-initiative-stat-lbl">Average progress</span>
        </div>
        <div className="def-initiative-stat">
          <span className="def-initiative-stat-num">{team.summary?.avgUtilization ?? avgProgress}%</span>
          <span className="def-initiative-stat-lbl">Avg utilization</span>
        </div>
      </div>

      <SectionCard
        title="Projects"
        desc={`${projects.length} project${projects.length !== 1 ? 's' : ''} owned by ${team.name}`}
      >
        <div className="def-table-wrap def-table-pro def-table-scroll-wrap">
          <table className="def-table def-project-table def-initiative-project-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Status</th>
                <th>Progress</th>
                <th>End date</th>
                <th>Team size</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className={`def-table-row def-project-row${activeProjectId === project.id ? ' def-project-row-active' : ''}`}
                >
                  <td>
                    <strong className="def-project-name">{project.name}</strong>
                    {project.delayReason && (
                      <span className="def-project-row-hint">{project.delayReason}</span>
                    )}
                  </td>
                  <td>{project.client}</td>
                  <td>
                    <div className="def-project-row-badges">
                      <StatusPill status={project.status} />
                      <RiskBadge risk={project.risk} />
                    </div>
                  </td>
                  <td>
                    <div className="def-inline-progress def-inline-progress-wide">
                      <ProgressBar value={project.progress} />
                      <span>{project.progress}%</span>
                    </div>
                  </td>
                  <td style={{
                    color: project.delayDays > 0 ? '#dc2626' : 'inherit',
                    fontWeight: project.delayDays > 0 ? 600 : 400,
                  }}
                  >
                    {formatDate(project.timeline.projectedEndDate)}
                    {project.delayDays > 0 && ` (+${project.delayDays}d)`}
                  </td>
                  <td>{project.teamSize}</td>
                  <td className="def-project-row-action">
                    <button
                      type="button"
                      className="def-btn-sm def-btn-ghost"
                      onClick={() => onOpenProject(project.id)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <button type="button" className="def-back-btn" onClick={onGoCeo}>← Back to Command Center Cockpit</button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */

const STYLES = `
  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
  html, body, #root {
    margin: 0; padding: 0; min-height: 100vh; max-width: 100%; overflow-x: hidden;
  }
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
    font-size: 14px; line-height: 1.5; color: #111827; background: #f7f8fa;
  }
  ::selection { background: rgba(20, 115, 230, 0.2); color: #2c2c2c; }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15); border-radius: 4px; transition: background 0.2s;
  }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.25); }

  :root {
    --def-blue: #6366f1;
    --def-blue-dark: #4f46e5;
    --def-violet: #a855f7;
    --def-cyan: #22d3ee;
    --def-pink: #ec4899;
    --def-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
    --def-gradient-soft: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08));
    --def-radius: 18px;
    --def-radius-sm: 12px;
    --def-sidebar-w: 256px;
    --def-topbar-h: 56px;
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --content-pad-x: clamp(var(--space-3), 1.5vw, var(--space-5));
    --content-pad-y: clamp(var(--space-3), 1.8vw, var(--space-5));
    --section-gap: var(--space-5);
    --cockpit-gap: var(--space-2);
    --cockpit-pad: var(--space-2);
    --text-min: 0.6875rem;
    --text-xs: 0.75rem;
  }

  .def-app.def-theme-light {
    --def-text: #334155;
    --def-muted: #64748b;
    --def-subtle: #94a3b8;
    --def-heading: #1e293b;
    --def-hero-title: #f8fafc;
    --def-hero-muted: #cbd5e1;
    --def-glass: rgba(255,255,255,0.72);
    --def-surface: rgba(255,255,255,0.88);
    --def-border: rgba(148,163,184,0.35);
    --def-border-soft: rgba(148,163,184,0.2);
    --def-shadow: 0 8px 32px rgba(15,23,42,0.06), 0 1px 0 rgba(255,255,255,0.9) inset;
    --def-shadow-lg: 0 24px 60px rgba(99,102,241,0.12), 0 8px 24px rgba(15,23,42,0.06);
    --def-shadow-glow: 0 0 0 1px rgba(99,102,241,0.15), 0 12px 40px rgba(99,102,241,0.15);
    --def-bg-app: linear-gradient(160deg, #eef2ff 0%, #f5f3ff 35%, #fdf2f8 70%, #ecfeff 100%);
    --def-topbar-bg: rgba(255,255,255,0.9);
    --def-topbar-text: #334155;
    --def-topbar-border: rgba(148,163,184,0.25);
    --def-topbar-pill-bg: rgba(99,102,241,0.08);
    --def-topbar-pill-border: rgba(99,102,241,0.22);
    --def-sidebar-bg: rgba(255,255,255,0.94);
    --def-sidebar-text: #334155;
    --def-sidebar-muted: #64748b;
    --def-sidebar-border: rgba(148,163,184,0.22);
    --def-sidebar-hover: rgba(99,102,241,0.08);
    --def-sidebar-active: linear-gradient(135deg, rgba(99,102,241,0.14), rgba(168,85,247,0.1));
    --def-sidebar-shadow: 8px 0 32px rgba(99,102,241,0.08);
    --def-footer-bg: rgba(255,255,255,0.65);
    --def-chart-ticker-bg: linear-gradient(135deg, rgba(238,242,255,0.98) 0%, rgba(224,231,255,0.95) 50%, rgba(245,243,255,0.92) 100%);
    --def-chart-wrap-bg: linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(224,231,255,0.96) 100%);
    --def-chart-text: #334155;
    --def-chart-muted: #64748b;
    --def-chart-border: rgba(99,102,241,0.22);
    --def-mesh-1: rgba(99,102,241,0.28);
    --def-mesh-2: rgba(236,72,153,0.18);
    --def-mesh-3: rgba(34,211,238,0.15);
    --def-accordion-bg: rgba(99,102,241,0.06);
    --def-live-badge-bg: #f8fafc;
    --def-live-badge-border: #e2e8f0;
    --def-live-badge-text: #64748b;
    --def-progress-track: #e2e8f0;
    --def-card-stat-bg: rgba(255,255,255,0.55);
    --def-table-head-bg: linear-gradient(180deg, rgba(99,102,241,0.08), rgba(168,85,247,0.04));
    --def-table-row-hover: linear-gradient(90deg, rgba(99,102,241,0.08), rgba(236,72,153,0.04));
  }

  .def-app.def-theme-dark {
    --def-text: #d4d4d8;
    --def-muted: #94949e;
    --def-subtle: #71717a;
    --def-heading: #e4e4e7;
    --def-hero-title: #e4e4e7;
    --def-hero-muted: #a1a1aa;
    --def-glass: rgba(0,0,0,0.62);
    --def-surface: rgba(10,10,10,0.88);
    --def-border: rgba(255,255,255,0.1);
    --def-border-soft: rgba(255,255,255,0.06);
    --def-shadow: 0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.04) inset;
    --def-shadow-lg: 0 24px 60px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35);
    --def-shadow-glow: 0 0 0 1px rgba(255,255,255,0.06), 0 12px 40px rgba(0,0,0,0.5);
    --def-bg-app: linear-gradient(160deg, #000000 0%, #050505 35%, #0a0a0a 70%, #000000 100%);
    --def-topbar-bg: rgba(0,0,0,0.94);
    --def-topbar-text: #d4d4d8;
    --def-topbar-border: rgba(255,255,255,0.06);
    --def-topbar-pill-bg: rgba(255,255,255,0.06);
    --def-topbar-pill-border: rgba(255,255,255,0.1);
    --def-sidebar-bg: rgba(0,0,0,0.97);
    --def-sidebar-text: #d4d4d8;
    --def-sidebar-muted: #71717a;
    --def-sidebar-border: rgba(255,255,255,0.06);
    --def-sidebar-hover: rgba(255,255,255,0.06);
    --def-sidebar-active: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04));
    --def-sidebar-shadow: 8px 0 40px rgba(0,0,0,0.45);
    --def-footer-bg: rgba(0,0,0,0.65);
    --def-chart-ticker-bg: linear-gradient(135deg, rgba(0,0,0,0.98) 0%, rgba(8,8,8,0.96) 50%, rgba(14,14,14,0.94) 100%);
    --def-chart-wrap-bg: linear-gradient(180deg, rgba(0,0,0,0.98) 0%, rgba(12,12,12,0.96) 100%);
    --def-chart-text: #d4d4d8;
    --def-chart-muted: #94949e;
    --def-chart-border: rgba(255,255,255,0.08);
    --def-mesh-1: rgba(255,255,255,0.035);
    --def-mesh-2: rgba(236,72,153,0.06);
    --def-mesh-3: rgba(168,85,247,0.05);
    --def-accordion-bg: rgba(255,255,255,0.03);
    --def-live-badge-bg: rgba(255,255,255,0.06);
    --def-live-badge-border: rgba(255,255,255,0.1);
    --def-live-badge-text: #94949e;
    --def-progress-track: rgba(255,255,255,0.1);
    --def-card-stat-bg: rgba(255,255,255,0.04);
    --def-table-head-bg: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
    --def-table-row-hover: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
  }

  .def-app.def-theme-dark .def-hero-premium {
    background: linear-gradient(135deg, #000000 0%, #0a0a0a 45%, #111111 100%);
    border-color: rgba(255,255,255,0.1);
  }
  .def-app.def-theme-dark .def-hero-premium::before {
    background: radial-gradient(circle, rgba(236,72,153,0.05), transparent 70%);
  }
  .def-app.def-theme-dark .def-topbar::after {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  }
  .def-app.def-theme-dark .def-theme-toggle:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.16);
    box-shadow: none;
  }
  .def-app.def-theme-dark .def-sidebar-toggle:hover,
  .def-app.def-theme-dark .def-sidebar-toggle.open {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.12);
  }
  .def-app.def-theme-dark .def-sidebar-link.active {
    border-color: rgba(255,255,255,0.12);
    box-shadow: inset 3px 0 0 #818cf8, 0 2px 10px rgba(0,0,0,0.25);
  }
  .def-app.def-theme-dark .def-chart-tooltip {
    background: rgba(0,0,0,0.96);
    box-shadow: 0 12px 32px rgba(0,0,0,0.55);
  }
  .def-app.def-theme-dark .def-stock-tooltip {
    background: linear-gradient(145deg, rgba(0,0,0,0.98), rgba(10,10,10,0.98));
    border-color: rgba(255,255,255,0.1);
  }
  .def-app.def-theme-dark .def-chart-stat:hover,
  .def-app.def-theme-dark .def-kpi-item:hover,
  .def-app.def-theme-dark .def-card-clickable:hover,
  .def-app.def-theme-dark .def-hover-lift:hover {
    border-color: rgba(255,255,255,0.14);
  }
  .def-app.def-theme-dark .def-candle-down {
    background: rgba(0,0,0,0.95) !important;
  }
  .def-app.def-theme-dark .def-panel:hover {
    border-color: rgba(255,255,255,0.12);
  }
  .def-app.def-theme-dark .def-project-stat {
    background: rgba(255,255,255,0.04);
    border-color: var(--def-border);
  }
  .def-app.def-theme-dark .def-project-stat:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.12);
  }
  .def-app.def-theme-dark .def-kpi-num {
    color: var(--def-text);
  }
  .def-app.def-theme-dark .def-section-title {
    color: var(--def-heading);
  }
  .def-app.def-theme-dark .def-table td {
    color: var(--def-text);
  }
  .def-app.def-theme-dark .def-dev-top strong {
    color: var(--def-text);
  }

  @keyframes defMeshDrift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -20px) scale(1.05); }
    66% { transform: translate(-20px, 15px) scale(0.95); }
  }
  @keyframes defGradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes defFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes defPageEnter {
    from { opacity: 0; transform: translateY(12px) scale(0.995); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes defProgressGrow {
    from { width: 0; }
    to { width: var(--def-progress); }
  }
  @keyframes defShimmer {
    0% { transform: translateX(-120%); }
    100% { transform: translateX(220%); }
  }
  @keyframes defPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.35); }
    50% { box-shadow: 0 0 0 6px rgba(234, 88, 12, 0); }
  }
  @keyframes defLivePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.55; transform: scale(0.85); }
  }
  @keyframes defTopbarGlow {
    0%, 100% { opacity: 0.45; }
    50% { opacity: 0.85; }
  }

  html, body, #root {
    height: 100%;
    overflow: hidden;
  }
  html {
    -webkit-text-size-adjust: 100%;
  }
  body {
    margin: 0;
    overscroll-behavior: none;
  }

  .def-app {
    position: relative;
    height: 100%;
    max-height: 100dvh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--def-bg-app);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: var(--def-text);
    -webkit-font-smoothing: antialiased;
    transition: background 0.35s ease, color 0.35s ease;
  }
  .def-app *, .def-app *::before, .def-app *::after { box-sizing: border-box; }
  .def-layer {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }
  .def-main > .def-layer:not(.def-cockpit) {
    max-width: 1440px;
    margin-inline: auto;
  }
  .def-mesh {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    animation: defMeshDrift 18s ease-in-out infinite;
  }
  .def-mesh-1 {
    width: 520px; height: 520px;
    top: -180px; left: -120px;
    background: radial-gradient(circle, var(--def-mesh-1), transparent 70%);
  }
  .def-mesh-2 {
    width: 480px; height: 480px;
    top: 20%; right: -140px;
    background: radial-gradient(circle, var(--def-mesh-2), transparent 70%);
    animation-delay: -6s;
  }
  .def-mesh-3 {
    width: 400px; height: 400px;
    bottom: -100px; left: 35%;
    background: radial-gradient(circle, var(--def-mesh-3), transparent 70%);
    animation-delay: -12s;
  }
  .def-topbar, .def-layout { position: relative; z-index: 1; }

  .def-topbar {
    position: relative;
    flex-shrink: 0;
    z-index: 100;
    background: var(--def-topbar-bg);
    color: var(--def-topbar-text);
    padding: 0 14px;
    height: var(--def-topbar-h);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--def-topbar-border);
    box-shadow: var(--def-shadow);
    backdrop-filter: blur(20px) saturate(180%);
    transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease;
  }
  .def-topbar-left, .def-topbar-right { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .def-menu-toggle {
    display: none;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid var(--def-topbar-pill-border);
    background: var(--def-topbar-pill-bg);
    color: var(--def-topbar-text);
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
  }
  .def-topbar-brand {
    font-weight: 700;
    font-size: 0.95rem;
    letter-spacing: 0.02em;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .def-sidebar-backdrop {
    display: none;
  }
  .def-topbar-mark {
    width: 38px; height: 38px;
    border-radius: 12px;
    background: var(--def-gradient);
    background-size: 200% 200%;
    animation: defGradientShift 6s ease infinite;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 900; letter-spacing: 0.04em;
    box-shadow: 0 8px 24px rgba(99,102,241,0.45);
  }
  .def-topbar-divider { width: 1px; height: 22px; background: rgba(255,255,255,0.15); }
  .def-topbar-sub { font-size: 0.78rem; opacity: 0.72; font-weight: 500; }
  .def-topbar-period {
    font-size: 0.72rem;
    padding: 5px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    color: #cbd5e1;
  }
  .def-topbar::after {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(96,165,250,0.6), transparent);
    animation: defTopbarGlow 3s ease-in-out infinite;
  }
  .def-topbar-layer {
    font-size: 0.78rem;
    padding: 7px 16px;
    border-radius: 999px;
    background: var(--def-topbar-pill-bg);
    border: 1px solid var(--def-topbar-pill-border);
    backdrop-filter: blur(8px);
    transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .def-theme-toggle {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid var(--def-topbar-pill-border);
    background: var(--def-topbar-pill-bg);
    color: var(--def-topbar-text);
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.22s ease;
  }
  .def-theme-toggle:hover {
    background: rgba(99,102,241,0.15);
    border-color: rgba(167,139,250,0.4);
    transform: translateY(-1px);
  }
  .def-topbar-layer:hover {
    background: rgba(99,102,241,0.2);
    border-color: rgba(167,139,250,0.5);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(99,102,241,0.25);
  }

  .def-layout {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: var(--def-sidebar-w) minmax(0, 1fr);
    align-items: stretch;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  .def-content-wrap {
    min-width: 0;
    min-height: 0;
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }

  .def-sidebar {
    width: 100%;
    height: 100%;
    min-height: 0;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
    background: var(--def-sidebar-bg);
    backdrop-filter: blur(24px) saturate(160%);
    color: var(--def-sidebar-text);
    border-right: 1px solid var(--def-sidebar-border);
    padding: var(--space-3) var(--space-2);
    min-height: 0;
    box-shadow: var(--def-sidebar-shadow);
    transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease;
  }
  .def-sidebar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px 18px;
    border-bottom: 1px solid var(--def-sidebar-border);
    margin-bottom: 14px;
  }
  .def-sidebar-brand-compact {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 10px 12px 16px;
  }
  .def-sidebar-period {
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--def-sidebar-text);
    letter-spacing: 0.02em;
  }
  .def-sidebar-period-hint {
    font-size: 0.62rem;
    color: var(--def-sidebar-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
  }
  .def-sidebar-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.11em;
    color: var(--def-sidebar-muted);
    font-weight: 700;
    padding: var(--space-2) var(--space-2) var(--space-1);
    margin: 0;
  }
  .def-sidebar-label-section {
    margin-top: var(--space-2);
    padding-top: var(--space-3);
    border-top: 1px solid var(--def-sidebar-border);
  }
  .def-sidebar-sublabel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    margin: 0 0 var(--space-1);
    padding: 0 var(--space-1) var(--space-1);
    font-size: 0.58rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--def-sidebar-muted);
  }
  .def-sidebar-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--def-topbar-pill-bg);
    border: 1px solid var(--def-sidebar-border);
    font-size: 0.56rem;
    font-weight: 800;
    letter-spacing: 0;
    color: var(--def-sidebar-muted);
  }
  .def-sidebar-tier {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    font-size: 0.56rem;
    font-weight: 900;
    letter-spacing: 0.02em;
    flex-shrink: 0;
  }
  .def-sidebar-tier-ceo {
    background: var(--def-gradient);
    color: #fff;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
  }
  .def-sidebar-tier-mgr {
    background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(168,85,247,0.12));
    border: 1px solid rgba(99,102,241,0.25);
    color: var(--def-sidebar-text);
  }
  .def-sidebar-tier-tl {
    width: 26px;
    height: 26px;
    border-radius: 7px;
    font-size: 0.5rem;
    background: rgba(99,102,241,0.06);
    border: 1px solid var(--def-sidebar-border);
    color: var(--def-sidebar-muted);
  }
  .def-sidebar-role {
    color: var(--def-violet);
    font-weight: 700;
  }
  .def-app.def-theme-dark .def-sidebar-role { color: #a1a1aa; }
  .def-app.def-theme-dark .def-hero-premium.def-layer-header h1,
  .def-app.def-theme-dark .def-layer-header.def-hero-premium h1 {
    background: none;
    -webkit-text-fill-color: var(--def-hero-title);
    color: var(--def-hero-title);
  }
  .def-app.def-theme-dark .def-hero-premium .def-eyebrow,
  .def-app.def-theme-dark .def-hero-premium .def-subtitle {
    color: var(--def-hero-muted);
  }
  .def-app.def-theme-dark .def-hero-premium .def-live-badge {
    color: var(--def-hero-muted);
  }
  .def-app.def-theme-dark .def-chart-tooltip-row strong,
  .def-app.def-theme-dark .def-health-tooltip-grid strong {
    color: var(--def-text);
  }
  .def-app.def-theme-dark .def-chart-tooltip-title {
    color: var(--def-muted);
  }
  .def-sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-height: 0;
    padding-bottom: var(--space-2);
  }
  .def-sidebar-group {
    margin-bottom: var(--space-1);
    border-radius: 8px;
  }
  .def-sidebar-group.active > .def-sidebar-row .def-sidebar-link:not(.active) {
    background: rgba(99,102,241,0.04);
    border-color: rgba(99,102,241,0.1);
  }
  .def-sidebar-row {
    display: flex;
    align-items: stretch;
    gap: 2px;
  }
  .def-sidebar-row .def-sidebar-link { flex: 1; min-width: 0; }
  .def-sidebar-toggle {
    flex-shrink: 0;
    width: 28px;
    border: 1px solid var(--def-sidebar-border);
    border-radius: 8px;
    background: var(--def-topbar-pill-bg);
    color: var(--def-sidebar-muted);
    cursor: pointer;
    font-size: 0.7rem;
    line-height: 1;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .def-sidebar-toggle:hover,
  .def-sidebar-toggle.open {
    background: rgba(99,102,241,0.12);
    border-color: rgba(99,102,241,0.25);
    color: var(--def-sidebar-text);
  }
  .def-sidebar-link {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    width: 100%;
    padding: 7px var(--space-2);
    border: 1px solid transparent;
    border-radius: 8px;
    background: transparent;
    color: inherit;
    cursor: pointer;
    text-align: left;
    font: inherit;
    min-height: 46px;
    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .def-sidebar-link:hover { background: var(--def-sidebar-hover); }
  .def-sidebar-link.active {
    background: var(--def-sidebar-active);
    border-color: rgba(99,102,241,0.22);
    box-shadow: inset 3px 0 0 #6366f1, 0 2px 10px rgba(99,102,241,0.08);
  }
  .def-sidebar-link-ceo {
    margin-bottom: var(--space-1);
    background: linear-gradient(135deg, rgba(99,102,241,0.07), rgba(168,85,247,0.04));
    border-color: rgba(99,102,241,0.14);
  }
  .def-sidebar-link-ceo:hover {
    background: linear-gradient(135deg, rgba(99,102,241,0.11), rgba(168,85,247,0.07));
    border-color: rgba(99,102,241,0.2);
  }
  .def-sidebar-link-ceo.active {
    background: var(--def-sidebar-active);
    border-color: rgba(99,102,241,0.28);
    box-shadow: inset 3px 0 0 #6366f1, 0 4px 14px rgba(99,102,241,0.12);
  }
  .def-app.def-theme-dark .def-sidebar-link-ceo {
    background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.06));
    border-color: rgba(255,255,255,0.08);
  }
  .def-sidebar-link-icon { opacity: 0.7; font-size: 0.7rem; }
  .def-sidebar-link .def-avatar { width: 30px; height: 30px; font-size: 0.6rem; border-radius: 8px; }
  .def-sidebar-link-text { flex: 1; min-width: 0; }
  .def-sidebar-link-text strong {
    display: block;
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--def-sidebar-text);
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .def-sidebar-link-text small {
    display: block;
    font-size: 0.62rem;
    color: var(--def-sidebar-muted);
    line-height: 1.3;
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .def-sidebar-score {
    flex-shrink: 0;
    align-self: center;
    font-size: 0.72rem;
    font-weight: 800;
    padding: 2px 7px;
    border-radius: 6px;
    background: rgba(255,255,255,0.72);
    border: 1px solid var(--def-sidebar-border);
    min-width: 36px;
    text-align: center;
    line-height: 1.35;
    margin-left: auto;
  }
  .def-sidebar-status-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px 6px;
    margin-top: 3px;
  }
  .def-sidebar-status-line {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: var(--text-min);
    font-weight: 700;
    line-height: 1.15;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }
  .def-sidebar-status-line i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
    font-style: normal;
  }
  .def-sidebar-status-line.ok { color: #15803d; }
  .def-sidebar-status-line.risk { color: #b45309; }
  .def-sidebar-status-line.late { color: #b91c1c; }
  .def-app.def-theme-dark .def-sidebar-score {
    background: rgba(255,255,255,0.05);
  }
  .def-sidebar-nested {
    margin: 2px 0 var(--space-1) 10px;
    padding: var(--space-1) 0 var(--space-1) 11px;
    border-left: 2px solid rgba(99,102,241,0.18);
    animation: defFadeUp 0.25s ease both;
  }
  .def-sidebar-nested-link {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--space-2);
    width: 100%;
    padding: 6px var(--space-2);
    border: 1px solid transparent;
    border-radius: 7px;
    background: transparent;
    color: var(--def-sidebar-text);
    cursor: pointer;
    font: inherit;
    text-align: left;
    min-height: 38px;
    transition: background 0.2s ease, border-color 0.2s ease;
  }
  .def-sidebar-nested-text {
    flex: 1;
    min-width: 0;
  }
  .def-sidebar-nested-text strong {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--def-sidebar-text);
    line-height: 1.25;
    white-space: normal;
  }
  .def-sidebar-nested-text small {
    display: block;
    font-size: 0.6rem;
    color: var(--def-sidebar-muted);
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .def-sidebar-nested-link:hover { background: var(--def-sidebar-hover); }
  .def-sidebar-nested-link.active {
    background: var(--def-sidebar-active);
    border-color: rgba(99,102,241,0.2);
    box-shadow: inset 2px 0 0 #6366f1;
  }
  .def-app.def-theme-dark .def-sidebar-nested-link.active {
    border-color: rgba(255,255,255,0.1);
    box-shadow: inset 2px 0 0 #818cf8;
  }
  .def-sidebar-nested-link .def-pill {
    transform: scale(0.78);
    flex-shrink: 0;
    font-size: 0.56rem;
    padding: 2px 6px;
    letter-spacing: 0.02em;
  }
  .def-sidebar-nested-link .def-pill:hover { transform: scale(0.78); }

  .def-main {
    flex: 1;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    margin: 0;
    overflow-x: hidden;
    padding: var(--content-pad-y) var(--content-pad-x) var(--space-6);
  }

  .def-footer {
    width: 100%;
    padding: var(--space-2) var(--content-pad-x);
    border-top: 1px solid var(--def-border-soft);
    background: var(--def-footer-bg);
    backdrop-filter: blur(12px);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--space-2);
    font-size: 0.72rem;
    color: var(--def-muted);
    flex-shrink: 0;
  }
  .def-footer-compact {
    padding: 6px var(--content-pad-x);
    font-size: 0.68rem;
  }

  @media (max-width: 960px) {
    :root {
      --def-topbar-h: 56px;
    }
    .def-layout {
      grid-template-columns: 1fr;
    }
    .def-menu-toggle {
      display: inline-flex;
    }
    .def-sidebar-backdrop {
      display: block;
      position: fixed;
      inset: var(--def-topbar-h) 0 0 0;
      z-index: 150;
      border: none;
      padding: 0;
      margin: 0;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(2px);
      cursor: pointer;
    }
    .def-sidebar {
      position: fixed;
      top: var(--def-topbar-h);
      left: 0;
      bottom: 0;
      width: min(var(--def-sidebar-w), 88vw);
      z-index: 160;
      min-height: 0;
      max-height: none;
      align-self: auto;
      transform: translateX(-105%);
      transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
      border-right: 1px solid var(--def-sidebar-border);
      border-bottom: none;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
    }
    .def-sidebar.def-sidebar-open {
      transform: translateX(0);
    }
    .def-main { padding: var(--space-4) var(--space-3) var(--space-5); }
    .def-main:has(.def-cockpit) { padding: var(--space-2) var(--space-3) var(--space-3); }
    .def-topbar { height: var(--def-topbar-h); padding: 0 14px; }
    .def-card-clickable:hover,
    .def-panel:hover,
    .def-table-row:hover,
    .def-hero-panel:hover,
    .def-hover-lift:hover,
    .def-project-stat:hover {
      transform: none;
    }
    .def-sidebar-nested {
      margin-left: 8px;
      padding-left: 10px;
    }
    .def-sidebar-link { min-height: 46px; padding: 8px var(--space-2); }
    .def-sidebar-status-line { font-size: var(--text-min); }
    .def-sidebar-nested-link { min-height: 40px; }
    .def-sidebar-toggle { min-height: 44px; min-width: 32px; }
  }

  @media (max-width: 1024px) {
    .def-initiative-progress { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }

  @media (max-width: 768px) {
    .def-hero-panel {
      padding: 18px 16px;
      border-radius: 16px;
      margin-bottom: 18px;
    }
    .def-layer-header {
      flex-direction: column;
      align-items: stretch;
      gap: 14px;
    }
    .def-hero-stats {
      align-items: flex-start;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 8px;
    }
    .def-hero-premium.def-layer-header h1,
    .def-layer-header.def-hero-premium h1 {
      font-size: 1.5rem;
      word-break: break-word;
    }
    .def-layer-header h1 {
      font-size: 1.45rem;
      word-break: break-word;
    }
    .def-header-with-avatar {
      flex-wrap: wrap;
      gap: 12px;
    }
    .def-subtitle {
      font-size: 0.86rem;
    }
    .def-panel {
      padding: 18px 16px;
      border-radius: 16px;
      margin-bottom: 18px;
    }
    .def-initiative-header { padding: var(--space-3); }
    .def-initiative-header-aside { align-items: flex-start; flex-direction: row; flex-wrap: wrap; }
    .def-initiative-progress { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .def-initiative-quick-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .def-scorecard-targets-row { grid-template-columns: 1fr; }
    .def-scorecard-table { min-width: min(640px, 100%); font-size: var(--text-xs); }
    .def-kpi-item {
      padding: 12px;
      gap: 10px;
    }
    .def-kpi-num {
      font-size: 1.2rem;
    }
    .def-card {
      padding: 18px 16px;
      border-radius: 16px;
    }
    .def-card-top {
      flex-wrap: wrap;
      gap: 12px;
    }
    .def-card-identity {
      min-width: 0;
      flex: 1;
    }
    .def-card h3 {
      word-break: break-word;
    }
    .def-card-stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .def-card-grid {
      grid-template-columns: 1fr;
    }
    .def-table th,
    .def-table td {
      padding: 10px 11px;
      font-size: var(--text-xs);
    }
    .def-table-wrap .def-table th:first-child,
    .def-table-wrap .def-table td:first-child {
      position: sticky;
      left: 0;
      z-index: 2;
      background: var(--def-glass);
      box-shadow: 2px 0 8px rgba(15,23,42,0.05);
    }
    .def-table-wrap .def-table thead th:first-child {
      z-index: 3;
      background: var(--def-table-head-bg);
    }
    .def-table-initiatives th:nth-child(2),
    .def-table-initiatives td:nth-child(2),
    .def-table-initiatives th:nth-child(5),
    .def-table-initiatives td:nth-child(5),
    .def-table-initiatives th:nth-child(6),
    .def-table-initiatives td:nth-child(6) {
      display: none;
    }
    .def-project-table th:nth-child(2),
    .def-project-table td:nth-child(2),
    .def-project-table th:nth-child(5),
    .def-project-table td:nth-child(5),
    .def-project-table td:nth-child(6),
    .def-project-table th:nth-child(6) {
      display: none;
    }
    .def-table-pro .def-table,
    .def-project-table {
      min-width: min(100%, 520px);
    }
    .def-linked-chip {
      font-size: var(--text-xs);
      padding: 4px 8px;
    }
    .def-table-name {
      flex-wrap: wrap;
    }
    .def-table-wrap {
      -webkit-overflow-scrolling: touch;
    }
    .def-health-chart-card {
      padding: 12px 8px 10px;
      border-radius: 16px;
    }
    .def-health-chart-card .recharts-responsive-container {
      min-width: 0 !important;
    }
    .def-section-title {
      font-size: 1rem;
    }
    .def-section-desc {
      font-size: 0.8rem;
      margin-bottom: 14px;
    }
    .def-stepper {
      border-radius: 16px;
      padding: 8px 10px;
    }
    .def-breadcrumb {
      flex-wrap: wrap;
      gap: 6px;
    }
    .def-project-badges {
      width: 100%;
    }
    .def-dev-module {
      padding-left: 0;
    }
    .def-project-card {
      padding: 16px;
      border-radius: 16px;
    }
    .def-project-head h3 {
      word-break: break-word;
    }
    .def-dev-top {
      flex-wrap: wrap;
      gap: 10px;
    }
  }

  @media (max-width: 640px) {
    .def-main { padding: var(--space-3) var(--space-3) var(--space-5); }
    .def-main:has(.def-cockpit) { padding: var(--space-2) var(--space-3); }
    .def-topbar-left { gap: 8px; }
    .def-topbar-mark {
      width: 34px;
      height: 34px;
      font-size: 0.66rem;
    }
    .def-topbar-brand {
      font-size: 0.82rem;
      max-width: calc(100vw - 130px);
    }
    .def-chart-head {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
    .def-chart-controls {
      width: 100%;
      gap: 8px;
    }
    .def-chart-chip-group {
      flex: 1;
      justify-content: center;
    }
    .def-health-chart-divider {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      padding: 8px 10px;
    }
    .def-health-chart-divider-hint {
      display: none;
    }
    .def-health-legend {
      gap: 8px 12px;
      padding: 10px 8px 4px;
    }
    .def-health-tooltip {
      min-width: 0;
      max-width: calc(100vw - 32px);
    }
    .def-health-tooltip-head {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .def-live-badge {
      white-space: normal;
      font-size: 0.72rem;
    }
    .def-footer {
      flex-direction: column;
      align-items: flex-start;
      padding: 12px;
    }
    .def-card-stats strong {
      font-size: 1rem;
    }
    .def-card-stats span {
      font-size: 0.6rem;
    }
    .def-inline-progress {
      min-width: 88px;
    }
    .def-project-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .def-timeline-bar-labels {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }

  @media (max-width: 480px) {
    .def-sidebar-tier {
      width: 26px;
      height: 26px;
      font-size: 0.5rem;
    }
    .def-sidebar-link {
      padding: 8px var(--space-2);
      gap: var(--space-2);
    }
    .def-sidebar-score {
      font-size: 0.66rem;
      min-width: 32px;
      padding: 2px 5px;
    }
    .def-sidebar-status-row { gap: 2px 4px; }
    .def-sidebar-status-line { font-size: var(--text-min); }
    .def-sidebar-nested-link .def-pill {
      transform: scale(0.72);
    }
    .def-hero-premium.def-layer-header h1,
    .def-layer-header.def-hero-premium h1 {
      font-size: 1.3rem;
    }
    .def-layer-header h1 {
      font-size: 1.25rem;
    }
    .def-card-arrow {
      opacity: 1;
      transform: none;
    }
    .def-btn-sm {
      padding: 8px 12px;
      font-size: 0.72rem;
    }
    .def-mesh-1,
    .def-mesh-2,
    .def-mesh-3 {
      opacity: 0.45;
    }
  }

  .def-accordion {
    border-top: 1px solid var(--def-border-soft);
    background: var(--def-accordion-bg);
  }
  .def-accordion-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border: none;
    background: transparent;
    color: var(--def-text);
    cursor: pointer;
    text-align: left;
    font: inherit;
    transition: background 0.2s;
  }
  .def-accordion-trigger:hover { background: rgba(255,255,255,0.04); }
  .def-accordion-trigger-text strong { display: block; font-size: 0.82rem; }
  .def-accordion-trigger-text small { display: block; font-size: 0.68rem; color: #64748b; margin-top: 2px; }
  .def-accordion-chevron {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background: rgba(255,255,255,0.08);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  .def-accordion-panel { padding: 0 16px 14px; animation: defFadeUp 0.25s ease both; }
  .def-chart-accordion { border-radius: 0 0 18px 18px; }
  .def-chart-accordion .def-stock-legend-pro {
    padding: 0;
    background: transparent;
    border: none;
    grid-template-columns: 1fr 1fr;
  }

  .def-page-enter { animation: defPageEnter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .def-stagger-in {
    opacity: 0;
    animation: defFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-delay: var(--stagger, 0ms);
  }

  .def-stepper-item { display: inline-flex; align-items: center; }
  .def-stepper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    margin-bottom: 24px;
    padding: 10px 14px;
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    border-radius: 999px;
    box-shadow: var(--def-shadow);
    backdrop-filter: blur(16px) saturate(160%);
  }
  .def-stepper-line {
    width: 24px;
    height: 2px;
    background: linear-gradient(90deg, rgba(99,102,241,0.3), rgba(168,85,247,0.5));
    margin: 0 6px;
    border-radius: 999px;
  }
  .def-stepper-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: var(--def-blue);
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 999px;
    transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .def-stepper-btn:hover { background: rgba(99,102,241,0.1); transform: translateY(-1px); }
  .def-stepper-current {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
    font-weight: 700;
    color: #fff;
    padding: 6px 14px;
    background: var(--def-gradient);
    border-radius: 999px;
    box-shadow: 0 8px 20px rgba(99,102,241,0.35);
  }
  .def-stepper-index {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    color: inherit;
    font-size: 0.68rem;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .def-stepper-index.active { background: rgba(255,255,255,0.25); color: #fff; }

  .def-panel {
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    border-radius: 20px;
    padding: var(--space-5);
    margin-bottom: var(--section-gap);
    box-shadow: var(--def-shadow);
    backdrop-filter: blur(20px) saturate(160%);
    transition: box-shadow 0.35s, transform 0.35s, border-color 0.35s;
  }
  .def-panel:hover {
    box-shadow: var(--def-shadow-lg);
    border-color: rgba(167,139,250,0.35);
    transform: translateY(-2px);
  }
  .def-panel-flush { padding-top: 16px; }
  .def-panel-head { margin-bottom: 16px; }

  .def-exec-banner {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 20px;
    margin-bottom: 22px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(251,146,60,0.15), rgba(244,63,94,0.1));
    border: 1px solid rgba(251,146,60,0.35);
    box-shadow: 0 12px 32px rgba(234,88,12,0.12);
    backdrop-filter: blur(12px);
  }
  .def-exec-banner-icon {
    width: 36px; height: 36px;
    border-radius: 12px;
    background: linear-gradient(135deg, #f97316, #ef4444);
    color: #fff;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 8px 20px rgba(239,68,68,0.35);
    animation: defPulse 2.5s ease-in-out infinite;
  }
  .def-exec-banner strong { display: block; color: #9a3412; font-size: 0.88rem; margin-bottom: 2px; }
  .def-exec-banner p { margin: 0; font-size: 0.8rem; color: #c2410c; }

  .def-card-avatar-wrap {
    position: relative;
    width: 52px;
    height: 52px;
    flex-shrink: 0;
  }
  .def-card-avatar-wrap .def-health-ring { position: absolute; inset: 0; }
  .def-health-ring-progress { transition: stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1); }
  .def-card-avatar-wrap .def-avatar {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 34px; height: 34px;
    font-size: 0.62rem;
    border-radius: 9px;
  }

  .def-card-status-at-risk { border-top: 3px solid #ea580c; }
  .def-card-status-blocked { border-top: 3px solid #dc2626; }
  .def-card-status-on-track { border-top: 3px solid #059669; }

  .def-table-pro {
    border-radius: 12px;
    overflow: visible;
    box-shadow: inset 0 0 0 1px var(--def-border);
  }
  .def-table-wrap.def-table-pro {
    overflow-x: auto;
    overflow-y: visible;
  }
  .def-table-scroll-wrap {
    position: relative;
  }
  .def-table-scroll-wrap::after {
    content: 'Scroll →';
    position: sticky;
    right: 0;
    bottom: 0;
    float: right;
    margin: -28px 8px 8px 0;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: var(--text-min);
    font-weight: 700;
    color: var(--def-muted);
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    pointer-events: none;
    opacity: 0.85;
  }
  @media (min-width: 769px) {
    .def-table-scroll-wrap::after { display: none; }
  }

  .def-timeline-visual { padding: 4px 0; }
  .def-timeline-bar-track {
    position: relative;
    height: 10px;
    background: #e2e8f0;
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .def-timeline-bar-elapsed {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    background: linear-gradient(90deg, #bfdbfe, #93c5fd);
    border-radius: 999px;
    opacity: 0.55;
  }
  .def-timeline-bar-progress {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    background: linear-gradient(90deg, var(--def-blue), #6366f1);
    border-radius: 999px;
    box-shadow: 0 0 12px rgba(37,99,235,0.35);
  }
  .def-timeline-bar-labels {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 0.72rem;
    color: var(--def-muted);
    font-weight: 600;
  }

  .def-breadcrumb {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-bottom: 18px;
    font-size: 0.82rem;
    padding: 10px 14px;
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    border-radius: 12px;
    backdrop-filter: blur(8px);
    box-shadow: var(--def-shadow);
  }
  .def-bc-item { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 4px; }
  .def-bc-sep { color: var(--def-subtle); margin: 0 4px; font-weight: 300; }
  .def-bc-tier {
    display: inline-block;
    font-size: 0.58rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--def-subtle);
    margin-right: 4px;
  }
  .def-bc-link {
    background: none;
    border: none;
    color: var(--def-blue);
    cursor: pointer;
    padding: 4px 8px;
    font-size: inherit;
    font-weight: 600;
    border-radius: 6px;
    transition: background 0.2s, color 0.2s;
  }
  .def-bc-link:hover {
    background: var(--def-sidebar-hover);
    color: var(--def-violet);
  }
  .def-bc-current {
    color: var(--def-text);
    font-weight: 600;
    padding: 4px 10px;
    background: var(--def-card-stat-bg);
    border: 1px solid var(--def-border-soft);
    border-radius: 6px;
  }

  .def-linked-projects {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 6px;
  }
  .def-linked-chip {
    border: 1px solid var(--def-border);
    background: var(--def-card-stat-bg);
    color: var(--def-muted);
    font-size: 0.65rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .def-linked-chip:hover {
    background: var(--def-sidebar-active);
    color: var(--def-text);
    border-color: rgba(99,102,241,0.3);
  }

  /* Initiative detail page */
  .def-initiative-page { gap: var(--space-3); }
  .def-initiative-header {
    display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-3);
    flex-wrap: wrap; padding: var(--space-3) var(--space-4);
    background: #fff; border: 1px solid var(--def-border); border-radius: 12px;
    box-shadow: var(--def-shadow-sm);
  }
  .def-initiative-header-main { min-width: 0; flex: 1 1 280px; }
  .def-initiative-meta {
    display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 6px;
  }
  .def-initiative-pillar {
    display: inline-block; padding: 2px 8px; border-radius: 6px;
    font-size: 0.62rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
    background: rgba(99,102,241,0.1); color: #4f46e5;
  }
  .def-initiative-parent {
    font-size: 0.68rem; font-weight: 600; color: var(--def-muted); line-height: 1.35;
  }
  .def-initiative-title {
    margin: 0 0 6px; font-size: clamp(1.1rem, 2.4vw, 1.45rem); font-weight: 800;
    letter-spacing: -0.02em; color: var(--def-heading); line-height: 1.25;
  }
  .def-initiative-sub { margin: 0; font-size: 0.78rem; color: var(--def-muted); line-height: 1.45; }
  .def-initiative-sub strong { color: var(--def-text); font-weight: 700; }
  .def-initiative-header-aside {
    display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0;
  }
  .def-initiative-source {
    font-size: 0.62rem; font-weight: 700; padding: 3px 8px; border-radius: 6px;
  }
  .def-initiative-source.adp { background: rgba(37,99,235,0.1); color: #1d4ed8; }
  .def-initiative-source.sample { background: rgba(148,163,184,0.18); color: #64748b; }
  .def-initiative-progress {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--space-2);
  }
  .def-initiative-progress-card {
    display: flex; flex-direction: column; gap: 6px; min-width: 0;
    padding: var(--space-3); background: #fff; border: 1px solid var(--def-border);
    border-radius: 10px; box-shadow: var(--def-shadow-sm);
  }
  .def-initiative-progress-label {
    font-size: 0.62rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.05em; color: var(--def-muted);
  }
  .def-initiative-progress-value {
    font-size: 0.78rem; font-weight: 700; color: var(--def-heading); line-height: 1.35;
  }
  .def-initiative-progress-card .def-progress-track { height: 6px; }
  .def-initiative-trend-row {
    display: flex; align-items: center; gap: 8px; margin-top: 2px;
  }
  .def-initiative-trend-row .def-tracker-spark { width: 64px; height: 32px; }
  .def-initiative-trend-note { font-size: 0.62rem; font-weight: 700; }
  .def-initiative-trend-note.up { color: #15803d; }
  .def-initiative-trend-note.down { color: #b91c1c; }
  .def-initiative-risk-row {
    display: flex; align-items: center; gap: 8px;
  }
  .def-initiative-risk-row strong { font-size: 0.82rem; color: var(--def-heading); }
  .def-initiative-risk-hint { font-size: 0.64rem; color: var(--def-muted); line-height: 1.35; }
  .def-initiative-quick-stats {
    display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--space-2);
  }
  .def-initiative-stat {
    padding: var(--space-2) var(--space-3); background: #f8fafc;
    border: 1px solid var(--def-border); border-radius: 10px; text-align: center;
  }
  .def-initiative-stat-num {
    display: block; font-size: 1.15rem; font-weight: 800; color: var(--def-heading); line-height: 1.2;
  }
  .def-initiative-stat-lbl {
    display: block; margin-top: 2px; font-size: 0.62rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.04em; color: var(--def-muted);
  }
  .def-initiative-actions { margin-top: var(--space-3); }
  .def-initiative-project-table { min-width: 640px; }
  .def-btn-ghost {
    background: transparent; border: 1px solid var(--def-border); color: var(--def-text);
  }
  .def-btn-ghost:hover { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.25); }

  /* Executive scorecard tables (Focus / Accelerate / Scale / Transform) */
  .def-scorecard-targets { margin-bottom: var(--space-3); }
  .def-scorecard-targets-label {
    margin: 0 0 8px; font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.06em; color: var(--def-muted);
  }
  .def-scorecard-targets-row {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-2);
  }
  .def-scorecard-target-card {
    padding: var(--space-3); border: 1px solid rgba(37,99,235,0.22); border-radius: 10px;
    background: #fff; box-shadow: var(--def-shadow-sm); min-width: 0;
  }
  .def-scorecard-target-card span {
    display: block; font-size: 0.62rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.05em; color: #1d4ed8; margin-bottom: 4px;
  }
  .def-scorecard-target-card strong {
    display: block; font-size: 0.82rem; font-weight: 700; color: var(--def-heading); line-height: 1.35;
  }
  .def-scorecard-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .def-scorecard-table {
    width: 100%; min-width: 720px; border-collapse: collapse; font-size: 0.72rem;
  }
  .def-scorecard-table thead th {
    background: linear-gradient(180deg, #1e3a8a 0%, #1d4ed8 100%);
    color: #fff; font-weight: 700; text-align: left; padding: 8px 10px;
    border: 1px solid rgba(255,255,255,0.08); white-space: nowrap; font-size: 0.66rem;
  }
  .def-scorecard-table tbody td {
    padding: 8px 10px; border: 1px solid rgba(226,232,240,0.95);
    vertical-align: middle; line-height: 1.35; background: #fff;
  }
  .def-scorecard-table tbody tr:nth-child(even) td { background: #f8fafc; }
  .def-scorecard-row-click { cursor: pointer; transition: background 0.18s ease; }
  .def-scorecard-row-click:hover td { background: rgba(99,102,241,0.06) !important; }
  .def-scorecard-imperative {
    font-weight: 800; color: var(--def-heading); vertical-align: top;
    background: #f1f5f9 !important; text-transform: capitalize; min-width: 88px;
  }
  .def-scorecard-kpi strong { font-weight: 700; color: var(--def-heading); }
  .def-scorecard-status {
    display: inline-flex; align-items: center; gap: 6px; font-weight: 700; white-space: nowrap;
  }
  .def-scorecard-dot {
    width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; font-style: normal;
  }
  .def-scorecard-dot-track { background: #22c55e; }
  .def-scorecard-dot-watch { background: #f59e0b; }
  .def-scorecard-dot-risk { background: #ef4444; }

  .def-hero-panel {
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    border-radius: 22px;
    padding: 24px 28px;
    box-shadow: var(--def-shadow);
    margin-bottom: 24px;
    backdrop-filter: blur(20px) saturate(160%);
    transition: box-shadow 0.35s, transform 0.35s;
  }
  .def-hero-panel:hover { box-shadow: var(--def-shadow-lg); }
  .def-hero-premium {
    background: linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(49,46,129,0.92) 45%, rgba(88,28,135,0.88) 100%);
    border: 1px solid rgba(167,139,250,0.25);
    color: var(--def-hero-title);
    overflow: hidden;
    position: relative;
  }
  .def-hero-premium::before {
    content: '';
    position: absolute;
    top: -50%; right: -20%;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(236,72,153,0.25), transparent 70%);
    pointer-events: none;
  }
  .def-hero-premium .def-eyebrow { color: var(--def-hero-muted); }
  .def-hero-premium .def-subtitle { color: var(--def-hero-muted); max-width: none; }
  .def-hero-content { position: relative; z-index: 1; }
  .def-hero-stats { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; position: relative; z-index: 1; }
  .def-hero-stat-pill {
    padding: 10px 16px;
    border-radius: 14px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(8px);
    text-align: right;
  }
  .def-hero-stat-pill span { display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--def-hero-muted); margin-bottom: 2px; }
  .def-hero-stat-pill strong { font-size: 1.4rem; font-weight: 800; }
  .def-hero-premium .def-live-badge {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.12);
    color: var(--def-hero-muted);
  }
  .def-hero-premium .def-hero-stats .def-pill {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
  }
  .def-hero-premium .def-hero-stats .def-risk {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
  }
  .def-hero-premium .def-header-with-avatar .def-avatar {
    box-shadow: 0 8px 24px rgba(0,0,0,0.25), 0 0 0 3px rgba(255,255,255,0.12);
  }

  .def-layer-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap; width: 100%; }
  .def-header-with-avatar { display: flex; align-items: flex-start; gap: 16px; }
  .def-eyebrow {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--def-subtle);
    margin: 0 0 6px;
    font-weight: 700;
  }
  .def-layer-header h1 {
    margin: 0 0 8px;
    font-size: 1.85rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--def-heading);
    background: var(--def-gradient);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: defGradientShift 8s ease infinite;
  }
  .def-hero-premium.def-layer-header h1,
  .def-layer-header.def-hero-premium h1 {
    background: none;
    -webkit-text-fill-color: var(--def-hero-title);
    color: var(--def-hero-title);
    background-size: auto;
    background-clip: border-box;
    animation: none;
    font-size: 2rem;
  }
  .def-subtitle { margin: 0; color: var(--def-muted); font-size: 0.93rem; line-height: 1.55; }
  .def-updated { font-size: 0.8rem; color: var(--def-muted); white-space: nowrap; }
  .def-live-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: var(--def-live-badge-bg);
    border: 1px solid var(--def-live-badge-border);
    border-radius: 999px;
    color: var(--def-live-badge-text);
    font-weight: 500;
  }
  .def-live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #059669;
    box-shadow: 0 0 0 3px rgba(5,150,105,0.2);
    animation: defLivePulse 2s ease-in-out infinite;
  }

  .def-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    flex-shrink: 0;
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s;
  }
  .def-avatar-blue { background: linear-gradient(135deg, #dbeafe, #bfdbfe); color: #1d4ed8; box-shadow: 0 4px 12px rgba(37,99,235,0.15); }
  .def-avatar-green { background: linear-gradient(135deg, #d1fae5, #a7f3d0); color: #047857; box-shadow: 0 4px 12px rgba(5,150,105,0.15); }
  .def-avatar-amber { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #b45309; box-shadow: 0 4px 12px rgba(217,119,6,0.15); }
  .def-avatar-red { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #b91c1c; box-shadow: 0 4px 12px rgba(220,38,38,0.15); }
  .def-avatar-indigo { background: linear-gradient(135deg, #e0e7ff, #c7d2fe); color: #4338ca; box-shadow: 0 4px 12px rgba(99,102,241,0.15); }
  .def-avatar-slate { background: linear-gradient(135deg, #f1f5f9, #e2e8f0); color: #475569; box-shadow: 0 4px 12px rgba(71,85,105,0.12); }

  .def-kpi-strip {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 152px), 1fr));
    gap: 14px;
    margin-bottom: 24px;
    width: 100%;
  }
  .def-kpi-strip-quad {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: 1280px) {
    .def-kpi-strip:not(.def-kpi-strip-quad) { grid-template-columns: repeat(6, minmax(0, 1fr)); }
    .def-kpi-strip-quad { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }
  @media (max-width: 900px) {
    .def-kpi-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  }
  @media (max-width: 480px) {
    .def-kpi-strip { grid-template-columns: 1fr; }
  }
  .def-kpi-item {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    border-radius: 16px;
    padding: 16px 18px;
    box-shadow: var(--def-shadow);
    backdrop-filter: blur(16px) saturate(160%);
    transition: transform 0.28s ease, box-shadow 0.28s, border-color 0.28s;
  }
  .def-kpi-item:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: var(--def-shadow-glow);
    border-color: rgba(167,139,250,0.4);
  }
  .def-kpi-icon-wrap {
    width: 44px; height: 44px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, color-mix(in srgb, var(--kpi-color) 18%, transparent), color-mix(in srgb, var(--kpi-color) 8%, transparent));
    border: 1px solid color-mix(in srgb, var(--kpi-color) 25%, transparent);
    flex-shrink: 0;
    box-shadow: 0 8px 20px color-mix(in srgb, var(--kpi-color) 20%, transparent);
  }
  .def-kpi-icon { font-size: 1rem; color: var(--kpi-color); filter: saturate(1.2); }
  .def-kpi-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .def-kpi-num {
    display: block;
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: var(--kpi-color, var(--def-text));
  }
  .def-kpi-lbl {
    display: block;
    font-size: 0.65rem;
    color: var(--def-muted);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1.3;
  }
  .def-kpi-glow {
    position: absolute;
    bottom: -20px; right: -20px;
    width: 80px; height: 80px;
    border-radius: 50%;
    background: var(--kpi-color);
    opacity: 0.08;
    filter: blur(20px);
    pointer-events: none;
  }

  .def-section { margin-bottom: 28px; width: 100%; min-width: 0; }
  .def-section-title {
    margin: 0 0 6px;
    font-size: 1.08rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--def-heading);
    position: relative;
    display: inline-block;
  }
  .def-section-title::after {
    content: '';
    display: block;
    height: 3px;
    width: 48px;
    margin-top: 8px;
    border-radius: 999px;
    background: var(--def-gradient);
  }
  .def-section-desc { margin: 0 0 18px; font-size: 0.86rem; color: var(--def-muted); }

  .def-chart-section { width: 100%; }
  .def-health-chart { width: 100%; min-width: 0; margin-bottom: 28px; }

  .def-health-chart-stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }
  @media (max-width: 900px) {
    .def-health-chart-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  .def-health-stat {
    padding: 14px 16px;
    border-radius: 16px;
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    box-shadow: var(--def-shadow);
    backdrop-filter: blur(12px);
  }
  .def-health-stat-primary {
    border-color: rgba(99,102,241,0.35);
    box-shadow: var(--def-shadow-glow);
  }
  .def-health-stat span {
    display: block;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--def-muted);
    font-weight: 700;
    margin-bottom: 4px;
  }
  .def-health-stat strong { display: block; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; }
  .def-health-stat small { display: block; font-size: 0.72rem; color: var(--def-muted); margin-top: 4px; }
  .def-health-stat small.up { color: #059669; font-weight: 600; }
  .def-health-stat small.down { color: #dc2626; font-weight: 600; }

  .def-health-chart-card {
    background: var(--def-chart-wrap-bg);
    border: 1px solid var(--def-chart-border);
    border-radius: 20px;
    padding: 16px 12px 12px;
    box-shadow: var(--def-shadow-glow);
    overflow: visible;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    touch-action: auto;
    transition: background 0.35s ease;
  }
  .def-health-chart-card .recharts-responsive-container,
  .def-health-chart-card .recharts-wrapper {
    touch-action: auto;
  }
  .def-health-chart-divider {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
    padding: 10px 14px;
    margin: 4px 0;
    border-top: 1px solid var(--def-border-soft);
    border-bottom: 1px solid var(--def-border-soft);
    background: var(--def-accordion-bg);
  }
  .def-health-chart-divider span:first-child {
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--def-muted);
  }
  .def-health-chart-divider-hint { font-size: 0.68rem; color: var(--def-muted); opacity: 0.85; }

  .def-health-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 18px;
    padding: 12px 14px 4px;
    font-size: 0.72rem;
    color: var(--def-muted);
  }
  .def-health-legend span { display: inline-flex; align-items: center; gap: 6px; }
  .def-health-legend i {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 3px;
    font-style: normal;
  }
  .def-lg-area { background: linear-gradient(135deg, #6366f1, #ec4899); }
  .def-lg-high { background: linear-gradient(90deg, #4ade80 50%, #f87171 50%); }
  .def-lg-target { background: transparent; border: 2px dashed #34d399; width: 14px !important; height: 0 !important; border-radius: 0 !important; }
  .def-lg-ma { background: linear-gradient(90deg, #fbbf24, #c4b5fd); }
  .def-lg-ontrack { background: #4ade80; }
  .def-lg-atrisk { background: #fbbf24; }
  .def-lg-delayed { background: #f87171; }
  .def-lg-util { background: #a855f7; border-radius: 50%; }
  .def-lg-vol { background: #6366f1; }

  .def-health-tooltip {
    background: var(--def-surface);
    border: 1px solid var(--def-border);
    border-radius: 14px;
    padding: 14px 16px;
    box-shadow: var(--def-shadow-lg);
    backdrop-filter: blur(16px);
    min-width: 220px;
  }
  .def-health-tooltip-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--def-border-soft);
  }
  .def-health-tooltip-period { margin: 0 0 4px; font-size: 0.72rem; color: var(--def-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
  .def-health-tooltip-score { display: block; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; }
  .def-health-tooltip-delta {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 999px;
    white-space: nowrap;
  }
  .def-health-tooltip-delta.up { color: #059669; background: rgba(5,150,105,0.1); }
  .def-health-tooltip-delta.down { color: #dc2626; background: rgba(220,38,38,0.1); }
  .def-health-tooltip-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 14px;
    font-size: 0.78rem;
  }
  .def-health-tooltip-grid span { color: var(--def-muted); font-weight: 600; }
  .def-health-tooltip-grid strong { color: var(--def-text); font-size: 0.85rem; }

  .def-stock-terminal { width: 100%; }
  .def-stock-chart-wrap { width: 100%; }
  .def-chart-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 16px;
    width: 100%;
    min-width: 0;
  }
  .def-chart-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }
  .def-chart-chip-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    background: var(--def-glass);
    padding: 5px;
    border-radius: 999px;
    border: 1px solid var(--def-border);
    backdrop-filter: blur(12px);
  }
  .def-chart-chip {
    border: none;
    background: transparent;
    color: var(--def-muted);
    font-size: 0.72rem;
    font-weight: 700;
    padding: 7px 14px;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.22s, color 0.22s, transform 0.22s, box-shadow 0.22s;
    white-space: nowrap;
  }
  .def-chart-chip:hover { background: rgba(99,102,241,0.1); color: var(--def-blue); transform: translateY(-1px); }
  .def-chart-chip.active {
    background: var(--def-gradient);
    color: #fff;
    box-shadow: 0 8px 20px rgba(99,102,241,0.35);
  }
  .def-chart-status-group {
    border-radius: 14px;
  }
  .def-chart-status-chip.active.def-chart-status-onTrack {
    background: linear-gradient(135deg, #059669, #34d399);
    box-shadow: 0 6px 16px rgba(5,150,105,0.35);
    color: #fff;
  }
  .def-chart-status-chip.active.def-chart-status-atRisk {
    background: linear-gradient(135deg, #d97706, #fbbf24);
    box-shadow: 0 6px 16px rgba(217,119,6,0.35);
    color: #fff;
  }
  .def-chart-status-chip.active.def-chart-status-delayed {
    background: linear-gradient(135deg, #dc2626, #f87171);
    box-shadow: 0 6px 16px rgba(220,38,38,0.35);
    color: #fff;
  }
  .def-chart-status-chip.active.def-chart-status-utilization {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    box-shadow: 0 6px 16px rgba(124,58,237,0.35);
    color: #fff;
  }
  .def-chart-status-chip:not(.active) {
    opacity: 0.72;
  }

  .def-chart-summary-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }
  .def-chart-stat {
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    border-radius: 16px;
    padding: 14px 16px;
    backdrop-filter: blur(12px);
    transition: transform 0.28s, box-shadow 0.28s, border-color 0.28s;
  }
  .def-chart-stat:hover {
    transform: translateY(-4px);
    box-shadow: var(--def-shadow-glow);
    border-color: rgba(167,139,250,0.35);
  }
  .def-chart-stat span { display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--def-muted); font-weight: 700; margin-bottom: 4px; }
  .def-chart-stat strong { display: block; font-size: 1.35rem; font-weight: 800; letter-spacing: -0.02em; color: var(--def-text); }
  .def-chart-stat small { display: block; font-size: 0.72rem; color: var(--def-subtle); margin-top: 4px; }

  .def-chart-card {
    background: rgba(255,255,255,0.94);
    border: 1px solid rgba(226,232,240,0.95);
    border-radius: 16px;
    padding: 16px 12px 12px;
    box-shadow: 0 4px 24px rgba(15,39,68,0.06);
    transition: box-shadow 0.3s;
  }
  .def-chart-card:hover { box-shadow: 0 8px 32px rgba(15,39,68,0.09); }

  .def-chart-tooltip {
    background: var(--def-surface);
    border: 1px solid var(--def-border);
    border-radius: 12px;
    padding: 12px 14px;
    box-shadow: var(--def-shadow-lg);
    min-width: 180px;
    backdrop-filter: blur(8px);
  }
  .def-chart-tooltip-title {
    margin: 0 0 10px;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--def-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .def-chart-tooltip-grid { display: flex; flex-direction: column; gap: 6px; }
  .def-chart-tooltip-row {
    display: grid;
    grid-template-columns: 8px 1fr auto;
    gap: 8px;
    align-items: center;
    font-size: 0.78rem;
    color: var(--def-muted);
  }
  .def-chart-tooltip-dot { width: 8px; height: 8px; border-radius: 50%; }
  .def-chart-tooltip-row strong { color: var(--def-text); font-size: 0.82rem; }

  .def-chart-legend-note {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 8px 4px;
    font-size: 0.72rem;
    color: #94a3b8;
  }
  .def-chart-legend-note span { display: inline-flex; align-items: center; gap: 6px; }
  .def-chart-legend-note i { display: inline-block; width: 14px; height: 3px; border-radius: 999px; font-style: normal; }

  @media (max-width: 640px) {
    .def-chart-head { flex-direction: column; }
    .def-chart-controls { width: 100%; }
    .def-chart-chip-group { flex: 1; justify-content: center; }
    .def-stock-ticker { flex-direction: column; align-items: flex-start; gap: 10px; }
    .def-stock-ticker-right { flex-wrap: wrap; gap: 10px; }
  }

  .def-stock-ticker {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    background: var(--def-chart-ticker-bg);
    color: var(--def-chart-text);
    border-radius: 18px;
    padding: 16px 20px;
    margin-bottom: 12px;
    border: 1px solid var(--def-chart-border);
    box-shadow: var(--def-shadow-glow);
    transition: background 0.35s ease, color 0.35s ease;
  }
  .def-stock-symbol {
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    color: var(--def-chart-muted);
    background: var(--def-topbar-pill-bg);
    padding: 4px 8px;
    border-radius: 6px;
  }
  .def-stock-price { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.03em; }
  .def-stock-change { font-size: 0.85rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; }
  .def-stock-change.up { color: #4ade80; background: rgba(74,222,128,0.12); }
  .def-stock-change.down { color: #f87171; background: rgba(248,113,113,0.12); }
  .def-stock-ticker-left { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
  .def-stock-ticker-right { display: flex; gap: 16px; font-size: 0.78rem; color: var(--def-chart-muted); }
  .def-stock-ticker-right strong { color: var(--def-chart-text); margin-left: 4px; }

  .def-stock-chart-wrap {
    background: var(--def-chart-wrap-bg);
    border: 1px solid var(--def-chart-border);
    border-radius: 18px;
    padding: 14px 10px 10px;
    box-shadow: var(--def-shadow-glow);
    transition: background 0.35s ease;
  }
  .def-stock-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    padding: 10px 12px 6px;
    font-size: 0.72rem;
    color: var(--def-chart-muted);
    border-top: 1px solid var(--def-border-soft);
    margin-top: 6px;
  }
  .def-stock-legend span { display: inline-flex; align-items: center; gap: 6px; }
  .def-stock-legend i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; font-style: normal; }
  .def-stock-terminal .def-chart-summary-row { margin-bottom: 16px; }

  .def-stock-data-guide {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
    margin-bottom: 18px;
  }
  .def-stock-guide-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    box-shadow: var(--def-shadow);
  }
  .def-stock-guide-icon { font-size: 1.2rem; line-height: 1; flex-shrink: 0; }
  .def-stock-guide-item strong { display: block; font-size: 0.82rem; margin-bottom: 4px; color: var(--def-text); }
  .def-stock-guide-item p { margin: 0; font-size: 0.74rem; color: var(--def-muted); line-height: 1.45; }

  .def-stock-ticker-pro { margin-bottom: 0; border-radius: 18px 18px 0 0; border-bottom: none; }
  .def-stock-ticker-main { display: flex; flex-direction: column; gap: 2px; }
  .def-stock-price-label { font-size: 0.68rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
  .def-stock-price small { font-size: 1rem; opacity: 0.6; margin-left: 2px; }
  .def-stock-ticker-metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .def-stock-ticker-metric {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 12px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    min-width: 72px;
  }
  .def-stock-ticker-metric span { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 700; }
  .def-stock-ticker-metric strong { font-size: 0.95rem; color: #f1f5f9; }
  .def-stock-ticker-metric small { font-size: 0.62rem; color: #64748b; }
  .def-stock-ticker-metric.target { border-color: rgba(52,211,153,0.25); background: rgba(52,211,153,0.08); }

  .def-stock-chart-terminal {
    border-radius: 0 0 18px 18px;
    padding: 0;
    overflow: hidden;
  }
  .def-stock-pane { padding: 16px 12px 8px; }
  .def-stock-pane-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    flex-wrap: wrap;
    padding: 0 8px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 8px;
  }
  .def-stock-pane-tag {
    display: inline-block;
    font-size: 0.62rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #a78bfa;
    background: rgba(167,139,250,0.12);
    border: 1px solid rgba(167,139,250,0.25);
    padding: 3px 8px;
    border-radius: 999px;
    margin-bottom: 6px;
  }
  .def-stock-pane-title h3 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 800;
    color: #e2e8f0;
    letter-spacing: -0.01em;
  }
  .def-stock-pane-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }
  .def-stock-pane-scale { font-size: 0.68rem; color: #64748b; font-weight: 600; }
  .def-stock-pane-live {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.68rem;
    color: #94a3b8;
    font-weight: 600;
  }
  .def-stock-pane-split {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    padding: 10px 20px;
    background: var(--def-accordion-bg);
    border-top: 1px solid var(--def-border-soft);
    border-bottom: 1px solid var(--def-border-soft);
  }
  .def-stock-pane-split-label {
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--def-muted);
  }
  .def-stock-pane-split-hint { font-size: 0.68rem; color: #64748b; }
  .def-stock-pane-volume { padding-top: 8px; }

  .def-stock-legend-pro {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    padding: 16px 20px 18px;
    background: rgba(0,0,0,0.2);
    border-top: 1px solid rgba(255,255,255,0.06);
    margin-top: 0;
  }
  .def-stock-legend-group { min-width: 0; }
  .def-stock-legend-title {
    margin: 0 0 8px;
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
  }
  .def-stock-legend-items { display: flex; flex-direction: column; gap: 6px; }
  .def-stock-legend-items span { font-size: 0.72rem; color: var(--def-muted); }
  .def-zone-healthy { background: rgba(52,211,153,0.35) !important; border-radius: 3px !important; width: 14px !important; height: 10px !important; }
  .def-zone-warn { background: rgba(251,191,36,0.35) !important; border-radius: 3px !important; width: 14px !important; height: 10px !important; }
  .def-zone-risk { background: rgba(248,113,113,0.35) !important; border-radius: 3px !important; width: 14px !important; height: 10px !important; }
  .def-line-target { background: transparent !important; border: 2px dashed #34d399 !important; width: 14px !important; height: 0 !important; border-radius: 0 !important; }

  .def-candle-up { background: linear-gradient(180deg, #4ade80, #16a34a); box-shadow: 0 0 8px rgba(74,222,128,0.4); }
  .def-candle-down { background: rgba(15,23,42,0.9) !important; border: 2px solid #f87171 !important; width: 10px !important; height: 10px !important; box-shadow: 0 0 8px rgba(248,113,113,0.3); }

  .def-stock-tooltip {
    background: linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,27,75,0.98));
    border: 1px solid rgba(167,139,250,0.35);
    border-radius: 14px;
    padding: 0;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);
    min-width: 280px;
    max-width: 320px;
    overflow: hidden;
  }
  .def-stock-tooltip-pro .def-stock-tooltip-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    padding: 14px 16px 10px;
    background: rgba(255,255,255,0.04);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .def-stock-tooltip-date {
    margin: 0;
    font-size: 0.82rem;
    color: #f1f5f9;
    text-transform: none;
    letter-spacing: -0.01em;
    font-weight: 800;
  }
  .def-stock-tooltip-sub { margin: 2px 0 0; font-size: 0.68rem; color: #64748b; font-weight: 500; }
  .def-stock-tooltip-badge {
    font-size: 0.68rem;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 999px;
    white-space: nowrap;
  }
  .def-stock-tooltip-badge.up { color: #4ade80; background: rgba(74,222,128,0.12); border: 1px solid rgba(74,222,128,0.25); }
  .def-stock-tooltip-badge.down { color: #f87171; background: rgba(248,113,113,0.12); border: 1px solid rgba(248,113,113,0.25); }
  .def-stock-tooltip-hint {
    margin: 0;
    padding: 10px 16px;
    font-size: 0.72rem;
    color: #94a3b8;
    line-height: 1.45;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .def-stock-ohlc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 12px 16px;
  }
  .def-stock-metric-row {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 8px 10px;
    background: rgba(255,255,255,0.04);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .def-stock-metric-row.highlight {
    background: rgba(167,139,250,0.1);
    border-color: rgba(167,139,250,0.25);
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .def-stock-metric-key {
    font-size: 0.68rem;
    color: #94a3b8;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .def-stock-metric-key em {
    display: block;
    font-style: normal;
    font-size: 0.62rem;
    color: #64748b;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0;
    margin-top: 1px;
  }
  .def-stock-metric-row strong { font-size: 1rem; color: #f8fafc; }
  .def-stock-tooltip-context {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 0 16px 12px;
  }
  .def-stock-tooltip-context div {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 0.72rem;
  }
  .def-stock-tooltip-context span { color: #64748b; font-weight: 600; }
  .def-stock-tooltip-context strong { color: #e2e8f0; font-size: 0.82rem; }
  .def-stock-tooltip-ma {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    padding: 10px 16px 14px;
    border-top: 1px solid rgba(255,255,255,0.08);
    font-size: 0.72rem;
    color: #94a3b8;
  }
  .def-stock-tooltip-ma span { display: inline-flex; align-items: center; gap: 6px; }
  .def-stock-tooltip-ma i { display: inline-block; width: 12px; height: 3px; border-radius: 999px; font-style: normal; }
  .def-stock-tooltip-ma strong { color: #f1f5f9; }

  @media (max-width: 640px) {
    .def-stock-data-guide { grid-template-columns: 1fr; }
    .def-stock-ticker-metrics { width: 100%; }
    .def-stock-ticker-metric { flex: 1; min-width: calc(33% - 8px); }
    .def-stock-legend-pro { grid-template-columns: 1fr; }
    .def-stock-tooltip { min-width: 240px; }
  }

  .def-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); gap: 16px; }
  .def-card {
    position: relative;
    overflow: hidden;
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    border-radius: 20px;
    padding: 22px;
    text-align: left;
    box-shadow: var(--def-shadow);
    backdrop-filter: blur(16px) saturate(160%);
  }
  .def-card-clickable {
    cursor: pointer;
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s, border-color 0.35s;
    width: 100%;
    font: inherit;
    color: inherit;
  }
  .def-card-clickable:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: var(--def-shadow-glow);
    border-color: rgba(167,139,250,0.45);
  }
  .def-card-clickable:hover .def-avatar { transform: scale(1.08); }
  .def-card-clickable:hover .def-card-arrow { opacity: 1; transform: translateX(0); color: var(--def-violet); }
  .def-card-shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.45) 50%, transparent 58%);
    transform: translateX(-130%);
    transition: transform 0.65s ease;
    pointer-events: none;
  }
  .def-card-clickable:hover .def-card-shine { transform: translateX(130%); }
  .def-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 16px; }
  .def-card-identity { display: flex; align-items: flex-start; gap: 12px; }
  .def-card h3 { margin: 0 0 3px; font-size: 1.02rem; font-weight: 700; }
  .def-card-meta { margin: 0; font-size: 0.78rem; color: var(--def-muted); line-height: 1.4; }
  .def-card-arrow {
    display: block;
    margin-top: 14px;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--def-subtle);
    opacity: 0;
    transform: translateX(-8px);
    transition: opacity 0.28s, transform 0.28s, color 0.28s;
  }

  .def-card-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-bottom: 16px; }
  .def-card-stats div {
    text-align: center;
    background: var(--def-card-stat-bg);
    border-radius: 12px;
    padding: 10px 4px;
    border: 1px solid var(--def-border-soft);
    backdrop-filter: blur(8px);
    transition: background 0.25s, transform 0.25s, border-color 0.25s;
  }
  .def-card-clickable:hover .def-card-stats div {
    background: rgba(255,255,255,0.75);
    border-color: rgba(167,139,250,0.25);
  }
  .def-card-stats div:hover { transform: scale(1.04); }
  .def-card-stats strong { display: block; font-size: 1.12rem; font-weight: 800; }
  .def-card-stats span { font-size: 0.65rem; color: var(--def-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
  .def-card-stats strong { color: var(--def-text); }

  .def-health-row { display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 8px; font-weight: 600; }
  .def-alert-line {
    margin: 14px 0 0;
    font-size: 0.78rem;
    color: #c2410c;
    background: linear-gradient(135deg, #fff7ed, #ffedd5);
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #fed7aa;
    animation: defPulse 2.5s ease-in-out infinite;
  }

  .def-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 11px;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 700;
    border: 1px solid transparent;
    white-space: nowrap;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .def-pill:hover { transform: scale(1.05); }
  .def-pill-pulse { animation: defPulse 2.5s ease-in-out infinite; }
  .def-pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .def-pill-sm { font-size: 0.65rem; padding: 3px 9px; }
  .def-risk {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: transform 0.2s;
  }
  .def-risk:hover { transform: scale(1.04); }

  .def-progress-track {
    height: 7px;
    background: var(--def-progress-track);
    border-radius: 999px;
    overflow: hidden;
    position: relative;
  }
  .def-progress-fill {
    height: 100%;
    border-radius: 999px;
    width: var(--def-progress);
    position: relative;
    overflow: hidden;
  }
  .def-progress-animate { animation: defProgressGrow 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  .def-progress-fill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
    animation: defShimmer 2.2s ease-in-out infinite;
  }

  .def-table-wrap {
    overflow-x: auto;
    overflow-y: visible;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    border-radius: 18px;
    box-shadow: var(--def-shadow);
    backdrop-filter: blur(16px) saturate(160%);
    transition: box-shadow 0.35s, border-color 0.35s;
  }
  .def-table-wrap:hover {
    box-shadow: var(--def-shadow-lg);
    border-color: rgba(167,139,250,0.3);
  }
  .def-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  .def-table th {
    text-align: left;
    padding: 14px 16px;
    background: var(--def-table-head-bg);
    color: var(--def-muted);
    font-weight: 700;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid var(--def-border-soft);
  }
  .def-table td { padding: 14px 16px; border-bottom: 1px solid rgba(148,163,184,0.12); vertical-align: middle; transition: background 0.2s; }
  .def-table-row { transition: background 0.22s, transform 0.22s; }
  .def-table-row:hover td { background: var(--def-table-row-hover); }
  .def-table-row:hover { transform: scale(1.002); }
  .def-table tr:last-child td { border-bottom: none; }
  .def-table-name { display: flex; align-items: center; gap: 10px; }
  .def-table-name .def-avatar { width: 34px; height: 34px; font-size: 0.68rem; border-radius: 10px; }

  .def-inline-progress { display: flex; align-items: center; gap: 10px; min-width: 110px; }
  .def-inline-progress .def-progress-track { flex: 1; }

  .def-btn-sm {
    background: var(--def-gradient);
    background-size: 200% auto;
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: 8px 16px;
    font-size: 0.76rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    box-shadow: 0 8px 24px rgba(99,102,241,0.35);
    transition: transform 0.22s, box-shadow 0.22s, background-position 0.35s;
  }
  .def-btn-sm:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(168,85,247,0.4);
    background-position: 100% center;
  }
  .def-btn-sm:active { transform: translateY(0); }
  .def-btn-full { width: 100%; margin-top: 14px; padding: 11px; }

  .def-back-btn {
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    color: var(--def-muted);
    border-radius: 999px;
    padding: 11px 20px;
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 12px;
    backdrop-filter: blur(12px);
    transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: var(--def-shadow);
  }
  .def-back-btn:hover {
    background: color-mix(in srgb, var(--def-glass) 88%, var(--def-blue) 12%);
    border-color: rgba(167,139,250,0.45);
    color: var(--def-blue);
    transform: translateX(-4px);
    box-shadow: var(--def-shadow-glow);
  }
  .def-app.def-theme-dark .def-back-btn:hover {
    background: rgba(255,255,255,0.08);
    color: var(--def-text);
  }

  .def-hover-lift { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s; }
  .def-hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 32px rgba(15,39,68,0.1);
  }

  .def-project-list { display: flex; flex-direction: column; gap: 18px; }
  .def-project-card {
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    border-radius: 20px;
    padding: 22px;
    border-left: 4px solid #059669;
    box-shadow: var(--def-shadow);
    backdrop-filter: blur(16px) saturate(160%);
  }
  .def-project-delayed, .def-project-blocked { border-left-color: #dc2626; }
  .def-project-at-risk { border-left-color: #ea580c; }
  .def-project-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; margin-bottom: 16px; flex-wrap: wrap; }
  .def-project-head h3 { margin: 0 0 4px; font-size: 1.05rem; font-weight: 700; }
  .def-project-badges { display: flex; gap: 8px; flex-wrap: wrap; }

  .def-project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(145px, 1fr)); gap: 12px; margin-bottom: 14px; }
  .def-project-stat {
    background: linear-gradient(180deg, #f8fafc, #fff);
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 14px;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .def-project-stat:hover {
    border-color: #93c5fd;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(37,99,235,0.08);
  }
  .def-project-stat span { display: block; font-size: 0.7rem; color: var(--def-muted); margin-bottom: 5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
  .def-project-stat strong { font-size: 0.92rem; font-weight: 700; color: var(--def-text); }
  .def-project-stat .def-progress-track { margin-top: 8px; }

  .def-delay-reason {
    margin: 0 0 12px;
    font-size: 0.81rem;
    color: #c2410c;
    background: linear-gradient(135deg, #fff7ed, #ffedd5);
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #fed7aa;
  }
  .def-module-summary { display: flex; gap: 8px; flex-wrap: wrap; }
  .def-module-chip {
    font-size: 0.73rem;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 999px;
    transition: transform 0.2s;
  }
  .def-module-chip:hover { transform: scale(1.06); }
  .def-module-chip.done { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
  .def-module-chip.progress { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
  .def-module-chip.pending { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }

  .def-blocker-box {
    background: linear-gradient(135deg, #fef2f2, #fff1f2);
    border: 1px solid #fecaca;
    border-radius: 14px;
    padding: 16px 18px;
    margin-bottom: 22px;
    font-size: 0.85rem;
    box-shadow: 0 4px 16px rgba(220,38,38,0.08);
    animation: defPulse 3s ease-in-out infinite;
  }
  .def-blocker-box ul { margin: 10px 0 0 18px; padding: 0; }
  .def-blocker-box li { margin-bottom: 5px; color: #991b1b; font-weight: 500; }

  .def-two-col { display: grid; grid-template-columns: 1.2fr 1fr; gap: 22px; }
  @media (max-width: 900px) { .def-two-col { grid-template-columns: 1fr; } }

  .def-project-table .def-project-name { display: block; font-size: 0.88rem; }
  .def-project-row-hint {
    display: block;
    margin-top: 4px;
    font-size: 0.72rem;
    color: #c2410c;
    font-weight: 500;
    max-width: 280px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .def-project-row-badges { display: flex; flex-wrap: wrap; gap: 6px; }
  .def-project-row-action { text-align: right; white-space: nowrap; }
  .def-project-row-active { background: rgba(99,102,241,0.06); }
  .def-inline-progress-wide { min-width: 120px; }

  .def-drawer-root {
    position: fixed;
    inset: var(--def-topbar-h) 0 0 0;
    z-index: 200;
    pointer-events: none;
  }
  .def-drawer-root.open { pointer-events: auto; }
  .def-drawer-backdrop {
    position: absolute;
    inset: 0;
    border: none;
    padding: 0;
    margin: 0;
    background: rgba(15,23,42,0.32);
    backdrop-filter: blur(4px);
    cursor: pointer;
    animation: defDrawerFadeIn 0.28s ease both;
  }
  .def-app.def-theme-dark .def-drawer-backdrop {
    background: rgba(0,0,0,0.62);
  }
  .def-drawer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(580px, 100%);
    display: flex;
    flex-direction: column;
    background: var(--def-surface);
    border-left: 1px solid var(--def-border);
    box-shadow: -20px 0 60px rgba(15,23,42,0.18);
    transform: translateX(100%);
    animation: defDrawerSlideIn 0.34s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    overflow: hidden;
  }
  .def-drawer-pro {
    background: linear-gradient(180deg, var(--def-surface) 0%, color-mix(in srgb, var(--def-surface) 92%, #eef2ff) 100%);
  }
  @keyframes defDrawerFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes defDrawerSlideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  .def-drawer-head-pro {
    position: relative;
    flex-shrink: 0;
    padding: 0;
    border-bottom: 1px solid var(--def-border-soft);
    background: var(--def-glass);
    backdrop-filter: blur(20px) saturate(160%);
    overflow: hidden;
  }
  .def-drawer-head-clean {
    flex-shrink: 0;
    padding: 18px 20px 16px;
    border-bottom: 1px solid var(--def-border);
    background: #fff;
  }
  .def-drawer-head-clean h2 {
    margin: 0 0 6px;
    font-size: clamp(1.05rem, 2.2vw, 1.28rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--def-heading);
    line-height: 1.25;
    word-break: break-word;
  }
  .def-drawer-head-clean .def-drawer-subtitle {
    margin: 0 0 10px;
    font-size: 0.78rem;
    line-height: 1.45;
  }
  .def-drawer-head-clean .def-drawer-subtitle strong {
    color: var(--def-text);
    font-weight: 700;
  }
  .def-drawer-schedule-chip {
    font-size: 0.64rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid var(--def-border);
    background: #f8fafc;
    color: var(--def-muted);
  }
  .def-drawer-schedule-chip.ok {
    background: rgba(34,197,94,0.1);
    border-color: rgba(34,197,94,0.25);
    color: #15803d;
  }
  .def-drawer-schedule-chip.late {
    background: rgba(239,68,68,0.08);
    border-color: rgba(239,68,68,0.22);
    color: #b91c1c;
  }
  .def-drawer-head-accent {
    position: absolute;
    inset: 0 0 auto 0;
    height: 120px;
    pointer-events: none;
  }
  .def-drawer-head-inner {
    position: relative;
    padding: 20px 22px 18px;
  }
  .def-drawer-head-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
  }
  .def-drawer-tier {
    font-size: 0.62rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--def-muted);
  }
  .def-drawer-head-pro h2 {
    margin: 0 0 6px;
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--def-heading);
    line-height: 1.2;
    word-break: break-word;
  }
  .def-drawer-subtitle {
    margin: 0 0 12px;
    font-size: 0.84rem;
    color: var(--def-muted);
    font-weight: 500;
  }
  .def-drawer-head-badges {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }
  .def-drawer-head-chip {
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--def-muted);
    padding: 5px 10px;
    border-radius: 999px;
    background: var(--def-glass);
    border: 1px solid var(--def-border-soft);
  }
  .def-drawer-close {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid var(--def-border);
    background: var(--def-glass);
    color: var(--def-muted);
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
  }
  .def-drawer-close:hover {
    background: rgba(99,102,241,0.12);
    border-color: rgba(99,102,241,0.35);
    color: var(--def-blue);
    transform: scale(1.04);
  }
  .def-drawer-body-pro {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px 18px 28px;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
  .def-drawer-summary {
    display: grid;
    grid-template-columns: minmax(96px, 112px) minmax(0, 1fr);
    gap: 14px;
    align-items: center;
    padding: 14px 16px;
    margin-bottom: 14px;
    border-radius: 16px;
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    min-width: 0;
  }
  .def-drawer-gauge {
    position: relative;
    width: 100%;
    max-width: 112px;
    aspect-ratio: 1;
    min-height: 96px;
    flex-shrink: 0;
    overflow: visible;
  }
  .def-drawer-gauge .recharts-responsive-container {
    min-width: 0 !important;
  }
  .def-drawer-gauge-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  .def-drawer-gauge-center strong {
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--def-heading);
    line-height: 1;
  }
  .def-drawer-gauge-center span {
    margin-top: 3px;
    font-size: 0.58rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--def-muted);
  }
  .def-drawer-summary-stats {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
  }
  .def-drawer-summary-stat span {
    display: block;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--def-muted);
    margin-bottom: 3px;
  }
  .def-drawer-summary-stat strong {
    display: block;
    font-size: 0.86rem;
    color: var(--def-text);
    line-height: 1.3;
  }
  .def-drawer-summary-stat small {
    display: block;
    margin-top: 2px;
    font-size: 0.72rem;
    color: var(--def-muted);
    font-weight: 500;
  }
  .def-drawer-alert {
    margin-bottom: 14px;
    padding: 12px 14px;
    border-radius: 14px;
    font-size: 0.82rem;
  }
  .def-drawer-alert strong {
    display: block;
    margin-bottom: 6px;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .def-drawer-alert ul {
    margin: 0;
    padding-left: 18px;
  }
  .def-drawer-alert p { margin: 0; line-height: 1.45; }
  .def-drawer-alert-danger {
    background: linear-gradient(135deg, rgba(254,226,226,0.9), rgba(255,241,242,0.85));
    border: 1px solid #fecaca;
    color: #991b1b;
  }
  .def-drawer-alert-warn {
    background: linear-gradient(135deg, rgba(255,247,237,0.95), rgba(255,237,213,0.85));
    border: 1px solid #fed7aa;
    color: #9a3412;
  }
  .def-app.def-theme-dark .def-drawer-alert-danger {
    background: rgba(127,29,29,0.25);
    border-color: rgba(248,113,113,0.35);
    color: #fca5a5;
  }
  .def-app.def-theme-dark .def-drawer-alert-warn {
    background: rgba(124,45,18,0.25);
    border-color: rgba(251,146,60,0.35);
    color: #fdba74;
  }
  .def-drawer-charts {
    display: grid;
  }
  .def-drawer-charts-compact {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 14px;
  }
  .def-drawer-charts-compact .def-drawer-chart-card {
    padding: 12px;
    border-radius: 14px;
    min-width: 0;
    overflow: hidden;
  }
  .def-drawer-chart-wrap {
    width: 100%;
    min-width: 0;
    overflow: hidden;
  }
  .def-drawer-chart-wrap .recharts-responsive-container {
    min-width: 0 !important;
  }
  .def-drawer-donut-legend-inline {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px 12px;
    margin-top: 2px;
  }
  .def-drawer-donut-legend-inline span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.66rem;
    color: var(--def-muted);
    font-weight: 600;
  }
  .def-drawer-chart-card {
    padding: 14px;
    border-radius: 16px;
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    box-shadow: var(--def-shadow);
    min-width: 0;
  }
  .def-drawer-chart-card-wide {
    grid-column: 1 / -1;
  }
  .def-drawer-chart-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }
  .def-drawer-chart-head h3 {
    margin: 0;
    font-size: 0.82rem;
    font-weight: 800;
    color: var(--def-heading);
    letter-spacing: -0.01em;
  }
  .def-drawer-chart-head span {
    font-size: 0.68rem;
    color: var(--def-muted);
    font-weight: 600;
  }
  .def-drawer-donut-wrap { position: relative; }
  .def-drawer-donut-legend {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 4px;
  }
  .def-drawer-donut-legend span {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.68rem;
    color: var(--def-muted);
    font-weight: 600;
  }
  .def-drawer-donut-legend i {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
    font-style: normal;
  }
  .def-drawer-chart-tooltip {
    background: var(--def-surface);
    border: 1px solid var(--def-border);
    border-radius: 10px;
    padding: 8px 10px;
    box-shadow: var(--def-shadow-lg);
    font-size: 0.72rem;
    color: var(--def-muted);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .def-drawer-chart-tooltip strong { color: var(--def-text); }
  .def-drawer-block {
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    box-shadow: var(--def-shadow);
  }
  .def-drawer-block-compact {
    margin-bottom: 12px;
    padding: 14px;
    border-radius: 14px;
  }
  .def-drawer-block-compact .def-drawer-block-head {
    margin-bottom: 10px;
  }
  .def-drawer-block-compact .def-drawer-block-head h3 {
    font-size: 0.82rem;
  }
  .def-drawer-block-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }
  .def-drawer-block-head h3 {
    margin: 0;
    font-size: 0.88rem;
    font-weight: 800;
    color: var(--def-heading);
  }
  .def-drawer-block-head span {
    font-size: 0.72rem;
    color: var(--def-muted);
    font-weight: 600;
  }
  .def-drawer-module-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .def-drawer-module-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .def-drawer-module {
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid var(--def-border-soft);
    background: color-mix(in srgb, var(--def-glass) 85%, transparent);
    border-left-width: 3px;
  }
  .def-drawer-module-done { border-left-color: #34d399; }
  .def-drawer-module-in-progress { border-left-color: #6366f1; }
  .def-drawer-module-pending { border-left-color: #94a3b8; }
  .def-drawer-module-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 6px;
  }
  .def-drawer-module-top strong {
    font-size: 0.84rem;
    color: var(--def-text);
  }
  .def-drawer-module-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    font-size: 0.72rem;
    color: var(--def-muted);
    font-weight: 600;
  }
  .def-drawer-team-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .def-drawer-team-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid var(--def-border-soft);
  }
  .def-drawer-team-row:last-child { border-bottom: none; padding-bottom: 0; }
  .def-drawer-team-info {
    flex: 1;
    min-width: 0;
  }
  .def-drawer-team-info strong {
    display: block;
    font-size: 0.82rem;
    color: var(--def-text);
  }
  .def-drawer-team-info span {
    display: block;
    font-size: 0.72rem;
    color: var(--def-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .def-drawer-team-util {
    font-size: 0.82rem;
    font-weight: 800;
    flex-shrink: 0;
  }
  @media (max-width: 768px) {
    .def-drawer-charts-compact { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .def-drawer { width: 100%; }
    .def-drawer-summary {
      grid-template-columns: 1fr;
      text-align: center;
      justify-items: center;
    }
    .def-drawer-summary-stats {
      width: 100%;
      text-align: left;
    }
    .def-drawer-gauge {
      max-width: 120px;
      margin: 0 auto;
    }
    .def-project-row-hint {
      max-width: none;
      white-space: normal;
      line-height: 1.35;
    }
    .def-drawer-team-info span {
      white-space: normal;
      overflow: visible;
      text-overflow: unset;
    }
  }

  .def-dev-list { display: flex; flex-direction: column; gap: 12px; }
  .def-dev-card {
    background: var(--def-glass);
    border: 1px solid var(--def-border);
    border-radius: 16px;
    padding: 16px 18px;
    box-shadow: var(--def-shadow);
    backdrop-filter: blur(12px);
  }
  .def-dev-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
  .def-dev-identity { display: flex; align-items: center; gap: 10px; }
  .def-dev-identity .def-avatar { width: 36px; height: 36px; font-size: 0.7rem; border-radius: 10px; }
  .def-dev-top strong { display: block; font-size: 0.9rem; font-weight: 700; }
  .def-dev-util { font-weight: 800; font-size: 0.92rem; }
  .def-dev-module { margin: 0 0 10px; font-size: 0.78rem; color: var(--def-muted); padding-left: 46px; }

  .def-timeline-box {
    background: rgba(255,255,255,0.94);
    border: 1px solid rgba(226,232,240,0.95);
    border-radius: 16px;
    padding: 18px 20px;
    box-shadow: 0 4px 20px rgba(15,39,68,0.05);
    transition: box-shadow 0.3s, transform 0.3s;
  }
  .def-timeline-box:hover {
    box-shadow: 0 8px 28px rgba(15,39,68,0.08);
    transform: translateY(-2px);
  }
  .def-timeline-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(165px, 1fr)); gap: 18px; }
  .def-timeline-row > div {
    padding: 12px 14px;
    background: #f8fafc;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    transition: border-color 0.25s, background 0.25s;
  }
  .def-timeline-row > div:hover { background: #fff; border-color: #93c5fd; }
  .def-timeline-row span { display: block; font-size: 0.72rem; color: #64748b; margin-bottom: 5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
  .def-timeline-row strong { font-size: 0.96rem; font-weight: 700; }

  .def-main:has(.def-cockpit) {
    padding: var(--space-2) var(--space-3) var(--space-3);
  }

  @keyframes cockpitPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.35); }
    50% { box-shadow: 0 0 0 4px rgba(34,197,94,0); }
  }

  /* Command Center Cockpit */
  .def-cockpit {
    --cockpit-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --cockpit-shadow-sm: 0 1px 4px rgba(15,39,68,0.05);
    --cockpit-shadow-md: 0 10px 28px rgba(15,39,68,0.09);
    --cockpit-shadow-lg: 0 18px 42px rgba(99,102,241,0.14);
    display: flex; flex-direction: column; gap: var(--cockpit-gap); padding-bottom: 0;
  }
  .def-cockpit-interactive {
    position: relative; overflow: hidden;
    transition: transform 0.32s var(--cockpit-ease), box-shadow 0.32s var(--cockpit-ease), border-color 0.28s ease;
  }
  .def-cockpit-interactive::before {
    content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
    background: linear-gradient(135deg, rgba(99,102,241,0.07) 0%, transparent 52%);
    opacity: 0; transition: opacity 0.32s ease;
  }
  .def-cockpit-interactive:focus-visible {
    outline: 2px solid #6366f1; outline-offset: 2px;
  }
  @media (hover: hover) and (pointer: fine) {
    .def-cockpit-interactive:hover {
      transform: translateY(-3px);
      box-shadow: var(--cockpit-shadow-md);
      border-color: rgba(99,102,241,0.24);
    }
    .def-cockpit-interactive:hover::before { opacity: 1; }
    .def-cockpit-metric-card:hover .def-cockpit-metric-icon {
      transform: scale(1.1) rotate(-3deg);
      background: rgba(99,102,241,0.16);
    }
    .def-cockpit-metric-card:hover .def-cockpit-metric-spark { opacity: 1; transform: scale(1.04); }
    .def-cockpit-fast-health:hover .def-cockpit-fast-icon {
      transform: scale(1.08);
      background: rgba(99,102,241,0.18);
    }
    .def-cockpit-fast-health:hover::after { opacity: 1; }
    .def-cockpit-move-stat:hover { transform: translateY(-2px); background: #fff; }
    .def-cockpit-risk-list li:hover { background: rgba(99,102,241,0.04); padding-left: 4px; }
    .def-cockpit-risk-list li:hover .def-cockpit-risk-score { transform: scale(1.1); }
    .def-cockpit-table tbody tr:hover { background: rgba(99,102,241,0.06); }
    .def-cockpit-top:hover { box-shadow: var(--cockpit-shadow-sm); }
    .def-cockpit-user-chip:hover { border-color: rgba(99,102,241,0.3); }
    .def-cockpit-filter select:hover { border-color: rgba(99,102,241,0.35); }
  }
  .def-cockpit-top {
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px;
    padding: 7px 9px; margin: 0;
    background: linear-gradient(180deg, #fff 0%, #fafbff 100%);
    border: 1px solid rgba(226,232,240,0.95); border-radius: 12px;
    box-shadow: var(--cockpit-shadow-sm);
    transition: box-shadow 0.28s var(--cockpit-ease);
  }
  .def-cockpit-top-copy { flex: 1 1 180px; min-width: 0; }
  .def-cockpit-eyebrow {
    margin: 0 0 2px; font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; color: #6366f1;
  }
  .def-cockpit-title {
    margin: 0; font-size: clamp(1.15rem, 2.2vw, 1.35rem); font-weight: 800; color: var(--def-heading);
    letter-spacing: -0.02em; line-height: 1.15;
  }
  .def-cockpit-top-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .def-cockpit-filter {
    display: flex; flex-direction: column; gap: 2px; font-size: 0.6rem; font-weight: 700;
    color: var(--def-muted); text-transform: uppercase;
  }
  .def-cockpit-filter select {
    min-width: 0; width: clamp(120px, 14vw, 148px); padding: 6px 10px; border-radius: 8px;
    border: 1px solid var(--def-border); background: #fff;
    font-size: 0.76rem; font-weight: 600; cursor: pointer;
    transition: border-color 0.22s ease, box-shadow 0.22s ease;
  }
  .def-cockpit-filter select:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,0.15); }
  .def-cockpit-live {
    padding: 5px 10px; border-radius: 999px; font-size: 0.7rem; font-weight: 700; color: #15803d;
    background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.18);
    animation: cockpitPulse 2.4s ease-in-out infinite;
  }
  .def-cockpit-user-chip {
    display: flex; align-items: center; gap: 6px; padding: 3px 10px 3px 3px;
    border-radius: 999px; border: 1px solid var(--def-border); background: #fff;
    transition: border-color 0.22s ease, box-shadow 0.22s ease;
  }
  .def-cockpit-user-chip strong { font-size: 0.74rem; color: var(--def-heading); }
  .def-cockpit-user-chip small { font-size: 0.64rem; color: var(--def-muted); }
  .def-cockpit-metrics-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--cockpit-gap);
  }
  .def-cockpit-metric-card {
    display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 2px var(--space-2);
    padding: var(--cockpit-pad) var(--space-3); min-height: 62px;
    background: #fff; border: 1px solid rgba(226,232,240,0.95); border-radius: 10px;
    box-shadow: var(--cockpit-shadow-sm);
  }
  .def-cockpit-metric-card.def-accent-emerald { border-color: rgba(5,150,105,0.2); }
  .def-cockpit-metric-card.def-accent-emerald:hover { border-color: rgba(5,150,105,0.38); box-shadow: 0 10px 28px rgba(5,150,105,0.12); }
  .def-cockpit-metric-card.def-accent-amber { border-color: rgba(217,119,6,0.2); }
  .def-cockpit-metric-card.def-accent-amber:hover { border-color: rgba(217,119,6,0.38); box-shadow: 0 10px 28px rgba(217,119,6,0.12); }
  .def-cockpit-metric-card.def-accent-rose { border-color: rgba(220,38,38,0.2); }
  .def-cockpit-metric-card.def-accent-rose:hover { border-color: rgba(220,38,38,0.38); box-shadow: 0 10px 28px rgba(220,38,38,0.12); }
  .def-cockpit-metric-card.def-accent-indigo { border-color: rgba(99,102,241,0.2); }
  .def-cockpit-metric-card.def-accent-indigo:hover { border-color: rgba(99,102,241,0.38); box-shadow: var(--cockpit-shadow-lg); }
  .def-cockpit-metric-icon {
    grid-row: 1 / span 2; width: 28px; height: 28px; display: grid; place-items: center;
    border-radius: 7px; background: rgba(99,102,241,0.08); font-size: 0.82rem;
    transition: transform 0.32s var(--cockpit-ease), background 0.32s ease;
  }
  .def-cockpit-metric-copy { min-width: 0; }
  .def-cockpit-metric-label {
    display: block; font-size: 0.62rem; font-weight: 700; color: var(--def-muted);
    text-transform: uppercase; letter-spacing: 0.04em;
  }
  .def-cockpit-metric-value {
    display: block; font-size: clamp(1rem, 1.8vw, 1.15rem); font-weight: 800;
    color: var(--def-heading); line-height: 1.05; margin-top: 1px;
  }
  .def-cockpit-metric-sub { display: block; font-size: 0.62rem; color: var(--def-subtle); }
  .def-cockpit-metric-spark {
    width: clamp(52px, 8vw, 64px); height: 34px; grid-row: 1 / span 2; align-self: center;
    opacity: 0.88; transition: opacity 0.28s ease, transform 0.28s var(--cockpit-ease);
  }
  .def-cockpit-section {
    background: #fff; border: 1px solid rgba(226,232,240,0.95); border-radius: 10px;
    padding: var(--cockpit-pad) var(--space-3); box-shadow: var(--cockpit-shadow-sm);
  }
  .def-cockpit-section-title {
    margin: 0 0 5px; font-size: 0.78rem; font-weight: 800; color: var(--def-heading);
  }
  .def-cockpit-section-head-row {
    display: flex; align-items: baseline; justify-content: space-between; gap: 6px; margin-bottom: 5px;
  }
  .def-cockpit-section-meta { font-size: 0.68rem; color: var(--def-muted); font-weight: 600; white-space: nowrap; }

  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
  }

  /* Initiative tracker (Command Center reference) */
  .def-cockpit-tracker { padding: var(--space-3) var(--space-3) var(--space-2); }
  .def-tracker-head {
    display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-3);
    flex-wrap: wrap; margin-bottom: var(--space-2);
  }
  .def-tracker-head-main { min-width: 0; }
  .def-tracker-updated { margin: 0; font-size: 0.64rem; color: var(--def-muted); font-weight: 600; }
  .def-tracker-legend {
    display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center;
  }
  .def-tracker-legend-item {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.62rem; font-weight: 700; color: var(--def-muted); white-space: nowrap;
  }
  .def-tracker-legend-item i {
    width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; font-style: normal;
  }
  .def-tracker-legend-item.adp i { background: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.2); }
  .def-tracker-legend-item.sample i { background: #94a3b8; box-shadow: 0 0 0 2px rgba(148,163,184,0.25); }
  .def-tracker-toolbar {
    display: flex; align-items: center; justify-content: space-between; gap: var(--space-2);
    margin-bottom: var(--space-2); flex-wrap: wrap;
  }
  .def-tracker-search { flex: 1 1 180px; max-width: 280px; }
  .def-tracker-search input {
    width: 100%; padding: 6px 10px; border: 1px solid rgba(226,232,240,0.95);
    border-radius: 8px; font-size: 0.72rem; background: #fff; color: var(--def-text);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .def-tracker-search input:focus {
    outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
  .def-tracker-count { font-size: 0.64rem; font-weight: 700; color: var(--def-muted); white-space: nowrap; }
  .def-tracker-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .def-tracker-table {
    width: 100%; min-width: 980px; border-collapse: collapse; font-size: 0.68rem;
  }
  .def-tracker-table thead th {
    background: linear-gradient(180deg, #1e3a8a 0%, #1d4ed8 100%);
    color: #fff; font-weight: 700; text-align: left; padding: 8px 10px;
    border: 1px solid rgba(255,255,255,0.08); white-space: nowrap;
    font-size: 0.64rem; letter-spacing: 0.01em;
  }
  .def-tracker-table tbody td {
    padding: 6px 10px; border: 1px solid rgba(226,232,240,0.95);
    vertical-align: middle; line-height: 1.35; background: #fff;
  }
  .def-tracker-table tbody tr:nth-child(even) td { background: #f8fafc; }
  .def-tracker-row-click { cursor: pointer; transition: background 0.18s ease; }
  .def-tracker-row-click:hover td { background: rgba(99,102,241,0.06) !important; }
  .def-tracker-row-click:focus-visible { outline: 2px solid #6366f1; outline-offset: -2px; }
  .def-tracker-imperative {
    font-weight: 800; color: var(--def-heading); vertical-align: top;
    background: #f1f5f9 !important; min-width: 72px; text-transform: capitalize;
  }
  .def-tracker-initiative {
    font-weight: 700; color: var(--def-heading); vertical-align: top;
    min-width: 120px; max-width: 160px; line-height: 1.3;
  }
  .def-tracker-sub { min-width: 140px; }
  .def-tracker-sub strong { display: block; font-weight: 700; color: var(--def-heading); }
  .def-tracker-tag {
    display: inline-block; margin-top: 2px; padding: 1px 5px; border-radius: 4px;
    font-size: 0.56rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
  }
  .def-tracker-tag.sample { background: rgba(148,163,184,0.18); color: #64748b; }
  .def-tracker-metric { display: flex; flex-direction: column; gap: 4px; min-width: 108px; }
  .def-tracker-metric span { font-weight: 600; color: var(--def-text); white-space: nowrap; }
  .def-tracker-metric .def-progress-track { height: 6px; border-radius: 999px; }
  .def-tracker-spark { width: 72px; min-width: 64px; height: 36px; }
  .def-tracker-risk-cell { text-align: center; width: 44px; }
  .def-tracker-risk {
    display: inline-block; width: 14px; height: 14px; border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(15,23,42,0.08);
  }
  .def-tracker-risk-low { background: #22c55e; }
  .def-tracker-risk-medium { background: #f59e0b; }
  .def-tracker-risk-high { background: #ef4444; }

  .def-cockpit-fast-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--cockpit-gap);
  }
  .def-cockpit-fast-health {
    display: flex; flex-direction: column; gap: var(--cockpit-gap); padding: var(--cockpit-pad) var(--space-3);
    background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
    border: 1px solid rgba(226,232,240,0.95); border-radius: 10px;
    cursor: pointer; text-align: left; min-width: 0;
  }
  .def-cockpit-fast-health::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #6366f1, #22c55e);
    opacity: 0; transition: opacity 0.28s ease;
  }
  .def-cockpit-fast-head { display: flex; align-items: flex-start; gap: 8px; }
  .def-cockpit-fast-icon {
    width: 30px; height: 30px; flex-shrink: 0; display: grid; place-items: center;
    border-radius: 8px; background: rgba(99,102,241,0.1); color: #6366f1; font-size: 0.9rem;
    transition: transform 0.32s var(--cockpit-ease), background 0.32s ease;
  }
  .def-cockpit-fast-titles { min-width: 0; flex: 1; }
  .def-cockpit-fast-kicker {
    margin: 0 0 1px; font-size: 0.6rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.06em; color: #6366f1;
  }
  .def-cockpit-fast-health h3 {
    margin: 0; font-size: clamp(0.68rem, 1.2vw, 0.72rem); font-weight: 700; color: var(--def-heading); line-height: 1.25;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .def-cockpit-fast-body { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .def-cockpit-fast-chart { position: relative; width: clamp(72px, 10vw, 88px); height: clamp(72px, 10vw, 88px); flex-shrink: 0; }
  .def-cockpit-fast-donut-center {
    position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
    pointer-events: none; text-align: center;
  }
  .def-cockpit-fast-donut-center strong { font-size: 0.95rem; font-weight: 800; color: var(--def-heading); line-height: 1; }
  .def-cockpit-fast-donut-center span { font-size: 0.52rem; font-weight: 700; color: var(--def-muted); text-transform: uppercase; }
  .def-cockpit-fast-legend { list-style: none; margin: 0; padding: 0; flex: 1; min-width: 88px; display: flex; flex-direction: column; gap: 4px; }
  .def-cockpit-fast-legend li { display: flex; align-items: center; gap: 5px; font-size: 0.64rem; color: var(--def-muted); font-weight: 600; }
  .def-cockpit-fast-legend li i { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; font-style: normal; }
  .def-cockpit-fast-legend li strong { margin-left: auto; font-size: 0.72rem; color: var(--def-heading); font-weight: 800; }
  .def-cockpit-fast-foot {
    display: flex; justify-content: space-between; align-items: center; gap: 4px;
    padding-top: 6px; border-top: 1px solid rgba(226,232,240,0.9); font-size: 0.62rem;
  }
  .def-cockpit-fast-team { color: var(--def-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
  .def-cockpit-fast-trend { font-weight: 800; padding: 1px 6px; border-radius: 999px; font-size: 0.58rem; flex-shrink: 0; }
  .def-cockpit-fast-trend.up { background: rgba(34,197,94,0.12); color: #15803d; }
  .def-cockpit-fast-trend.down { background: rgba(239,68,68,0.12); color: #b91c1c; }
  .def-cockpit-workspace {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.35fr) minmax(200px, 260px);
    gap: var(--cockpit-gap);
    align-items: start;
    min-width: 0;
  }
  .def-cockpit-ws-charts {
    display: flex;
    flex-direction: column;
    gap: var(--cockpit-gap);
    min-width: 0;
    min-height: 0;
  }
  .def-cockpit-ws-charts > .def-cockpit-chart-card {
    flex: 0 0 auto;
  }
  .def-cockpit-ws-recovery {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    max-height: var(--cockpit-ws-h, auto);
    overflow: hidden;
  }
  .def-cockpit-ws-recovery .def-cockpit-table-scroll-recovery {
    flex: 1 1 auto;
    min-height: 0;
    max-height: none;
    overflow: auto;
  }
  .def-cockpit-workspace > .def-cockpit-rail {
    align-self: start;
    max-height: var(--cockpit-ws-h, auto);
    overflow-y: auto;
    min-height: 0;
  }
  .def-cockpit-chart-card, .def-cockpit-table-card, .def-cockpit-rail-card {
    background: #fff; border: 1px solid rgba(226,232,240,0.95); border-radius: 10px;
    padding: var(--cockpit-pad) var(--space-3); min-width: 0; min-height: 0; box-shadow: var(--cockpit-shadow-sm);
  }
  .def-cockpit-card-title, .def-cockpit-chart-head .def-cockpit-card-title {
    margin: 0 0 4px; font-size: 0.74rem; font-weight: 800; color: var(--def-heading);
  }
  .def-cockpit-chart-head { margin-bottom: 4px; }
  .def-cockpit-movement-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 6px; }
  .def-cockpit-move-stat {
    padding: 6px 8px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0;
    transition: transform 0.25s var(--cockpit-ease), background 0.25s ease;
  }
  .def-cockpit-move-stat span { display: block; font-size: 0.6rem; font-weight: 700; color: var(--def-muted); text-transform: uppercase; }
  .def-cockpit-move-stat strong { display: block; margin-top: 1px; font-size: 0.95rem; font-weight: 800; }
  .def-cockpit-move-stat.improved strong { color: #15803d; }
  .def-cockpit-move-stat.deteriorated strong { color: #b91c1c; }
  .def-cockpit-move-stat.net.positive strong { color: #15803d; }
  .def-cockpit-move-stat.net.negative strong { color: #b91c1c; }
  .def-cockpit-table-scroll {
    overflow: auto;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    max-height: 100%;
  }
  .def-cockpit-table-scroll-recovery {
    max-height: min(280px, calc(var(--cockpit-chart-h, 210px) + 76px));
  }
  .def-cockpit-ws-recovery .def-cockpit-table-scroll-recovery {
    max-height: none;
  }
  .def-cockpit-table-scroll.wide { max-height: min(280px, 42vh); }
  .def-cockpit-table { width: 100%; border-collapse: collapse; font-size: 0.7rem; }
  .def-cockpit-table-recovery { min-width: min(480px, 100%); }
  .def-cockpit-table-teams { min-width: min(640px, 100%); }
  .def-cockpit-table th, .def-cockpit-table td {
    padding: 4px 6px; border-bottom: 1px solid rgba(226,232,240,0.9); text-align: left; vertical-align: middle;
    transition: background 0.2s ease;
  }
  .def-cockpit-table th {
    font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.04em;
    color: var(--def-muted); font-weight: 700; background: #f8fafc; position: sticky; top: 0; z-index: 1;
  }
  .def-cockpit-table.zebra tbody tr:nth-child(even) { background: rgba(248,250,252,0.85); }
  .def-cockpit-empty { text-align: center; color: var(--def-muted); font-style: italic; padding: 8px !important; }
  .def-cockpit-rail { display: flex; flex-direction: column; gap: var(--cockpit-gap); min-width: 0; min-height: 0; }
  .def-cockpit-rail-label {
    margin: 0 0 6px; font-size: 0.6rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.06em; color: var(--def-muted);
  }
  .def-cockpit-rail-card.subtle { background: linear-gradient(180deg, #f8fafc 0%, #fff 100%); }
  .def-cockpit-bullets { margin: 0; padding-left: 14px; font-size: 0.68rem; color: var(--def-text); line-height: 1.4; }
  .def-cockpit-bullets.tight { font-size: 0.66rem; color: var(--def-muted); }
  .def-cockpit-bullets li { margin-bottom: 4px; }
  .def-cockpit-risk-list { list-style: none; margin: 0; padding: 0; }
  .def-cockpit-risk-list li {
    display: flex; align-items: center; justify-content: space-between; gap: 6px;
    padding: 5px 2px; border-bottom: 1px solid rgba(226,232,240,0.9);
    border-radius: 6px; transition: background 0.22s ease, padding-left 0.22s ease;
  }
  .def-cockpit-risk-list li:last-child { border-bottom: none; padding-bottom: 0; }
  .def-cockpit-risk-copy { flex: 1; min-width: 0; }
  .def-cockpit-risk-list strong { display: block; font-size: 0.68rem; color: var(--def-heading); line-height: 1.25; }
  .def-cockpit-risk-list span { display: block; font-size: 0.58rem; font-weight: 700; color: #ea580c; margin-top: 1px; }
  .def-cockpit-risk-score {
    flex-shrink: 0; width: 28px; height: 28px; display: grid; place-items: center;
    border-radius: 50%; font-size: 0.66rem; font-weight: 800; color: #b45309;
    background: rgba(251,191,36,0.15); border: 2px solid rgba(251,191,36,0.35);
    transition: transform 0.28s var(--cockpit-ease);
  }
  .def-cockpit-risk-score.high { color: #b91c1c; background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.35); }
  .def-cockpit-dl { margin: 0; display: flex; flex-direction: column; gap: 4px; }
  .def-cockpit-dl div { display: flex; justify-content: space-between; gap: 6px; font-size: 0.68rem; padding: 4px 0; }
  .def-cockpit-dl dt { color: var(--def-muted); font-weight: 600; }
  .def-cockpit-dl dd { margin: 0; font-weight: 800; color: var(--def-heading); }
  .def-cockpit-mini-actions { margin-top: 8px; }

  @media (max-width: 1400px) {
    .def-cockpit-workspace {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
      grid-template-rows: auto auto;
    }
    .def-cockpit-ws-charts { grid-column: 1; grid-row: 1 / span 2; }
    .def-cockpit-ws-recovery { grid-column: 2; grid-row: 1 / span 2; }
    .def-cockpit-workspace > .def-cockpit-rail {
      grid-column: 1 / -1;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .def-cockpit-rail-card { flex: 1 1 min(100%, 220px); }
  }
  @media (max-width: 1024px) {
    .def-cockpit-metrics-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .def-cockpit-fast-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 768px) {
    .def-cockpit-top { flex-direction: column; align-items: stretch; }
    .def-cockpit-top-controls { width: 100%; justify-content: flex-start; }
    .def-cockpit-filter { flex: 1 1 140px; }
    .def-cockpit-filter select { width: 100%; max-width: none; }
    .def-cockpit-workspace {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }
    .def-cockpit-ws-charts,
    .def-cockpit-ws-recovery,
    .def-cockpit-workspace > .def-cockpit-rail {
      grid-column: auto;
      grid-row: auto;
    }
    .def-cockpit-ws-recovery,
    .def-cockpit-workspace > .def-cockpit-rail {
      max-height: none;
    }
    .def-cockpit-ws-recovery .def-cockpit-table-scroll-recovery {
      max-height: min(240px, calc(var(--cockpit-chart-h, 195px) + 72px));
    }
    .def-cockpit-rail { flex-direction: column; }
    .def-cockpit-rail-card { flex: 1 1 auto; }
    .def-cockpit-table-recovery,
    .def-cockpit-table-teams { min-width: min(520px, 100%); }
    .def-tracker-table { min-width: min(720px, 100%); font-size: var(--text-xs); }
    .def-tracker-head { flex-direction: column; }
    .def-tracker-search { max-width: none; }
    .def-tracker-legend { width: 100%; }
    .def-cockpit-interactive:hover { transform: none; }
  }
  @media (max-width: 640px) {
    .def-cockpit { --cockpit-pad: var(--space-3); }
    .def-cockpit-metrics-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .def-cockpit-fast-grid { grid-template-columns: 1fr; }
    .def-cockpit-movement-stats { grid-template-columns: 1fr; }
    .def-cockpit-top-controls { flex-direction: column; align-items: stretch; }
    .def-cockpit-user-chip { justify-content: center; }
    .def-cockpit-metric-label { font-size: var(--text-min); }
    .def-cockpit-table { font-size: var(--text-xs); }
    .def-cockpit-card-title { font-size: var(--text-xs); }
  }
  @media (max-width: 480px) {
    .def-cockpit-metrics-row,
    .def-cockpit-fast-grid { grid-template-columns: 1fr; }
    .def-cockpit-metric-spark { display: none; }
    .def-cockpit-metric-card { grid-template-columns: auto 1fr; min-height: 56px; }
    .def-cockpit-user-chip small { display: none; }
    .def-cockpit-table-recovery,
    .def-cockpit-table-teams { min-width: min(100%, 480px); }
    .def-cockpit-fast-health h3 { -webkit-line-clamp: 3; }
  }

  /* Dark theme — layer surfaces */
  .def-app.def-theme-dark .def-alert-line,
  .def-app.def-theme-dark .def-delay-reason {
    background: rgba(234,88,12,0.12);
    border-color: rgba(234,88,12,0.28);
    color: #fdba74;
  }
  .def-app.def-theme-dark .def-blocker-box {
    background: rgba(220,38,38,0.1);
    border-color: rgba(220,38,38,0.28);
  }
  .def-app.def-theme-dark .def-blocker-box li { color: #fca5a5; }
  .def-app.def-theme-dark .def-module-chip {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.1);
    color: var(--def-text);
  }
  .def-app.def-theme-dark .def-timeline-box {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.08);
  }
  .def-app.def-theme-dark .def-timeline-row > div {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.08);
  }
  .def-app.def-theme-dark .def-timeline-row > div:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(99,102,241,0.35);
  }
  .def-app.def-theme-dark .def-timeline-row span { color: var(--def-muted); }
  .def-app.def-theme-dark .def-drawer-head-clean {
    background: rgba(30,41,59,0.95);
    border-color: rgba(255,255,255,0.08);
  }
  .def-app.def-theme-dark .def-drawer-schedule-chip {
    background: rgba(15,23,42,0.5);
    border-color: rgba(255,255,255,0.08);
  }
  .def-app.def-theme-dark .def-drawer-pro {
    background: linear-gradient(180deg, var(--def-surface) 0%, rgba(15,23,42,0.95) 100%);
  }
  .def-app.def-theme-dark .def-project-row-active {
    background: rgba(99,102,241,0.14);
    box-shadow: inset 3px 0 0 #818cf8;
  }
  .def-app.def-theme-dark .def-accordion-trigger-text small { color: var(--def-muted); }

  .def-cockpit-theme-dark .def-cockpit-top,
  .def-cockpit-theme-dark .def-cockpit-metric-card,
  .def-cockpit-theme-dark .def-cockpit-section,
  .def-cockpit-theme-dark .def-cockpit-fast-health,
  .def-cockpit-theme-dark .def-cockpit-chart-card,
  .def-cockpit-theme-dark .def-cockpit-table-card,
  .def-cockpit-theme-dark .def-cockpit-rail-card {
    background: rgba(30,41,59,0.88); border-color: rgba(255,255,255,0.08);
  }
  .def-cockpit-theme-dark .def-cockpit-fast-health { background: linear-gradient(180deg, rgba(30,41,59,0.95), rgba(15,23,42,0.9)); }
  .def-cockpit-theme-dark .def-cockpit-filter select,
  .def-cockpit-theme-dark .def-cockpit-user-chip { background: rgba(15,23,42,0.6); }
  .def-cockpit-theme-dark .def-cockpit-table th { background: rgba(15,23,42,0.5); }
  .def-cockpit-theme-dark .def-cockpit-move-stat { background: rgba(15,23,42,0.5); border-color: rgba(255,255,255,0.08); }
  .def-cockpit-theme-dark .def-cockpit-rail-card.subtle { background: rgba(15,23,42,0.45); }
  .def-cockpit-theme-dark .def-cockpit-interactive::before {
    background: linear-gradient(135deg, rgba(129,140,248,0.12) 0%, transparent 52%);
  }
  .def-app.def-theme-dark .def-initiative-header,
  .def-app.def-theme-dark .def-initiative-progress-card {
    background: rgba(30,41,59,0.88); border-color: rgba(255,255,255,0.08);
  }
  .def-app.def-theme-dark .def-initiative-stat {
    background: rgba(15,23,42,0.5); border-color: rgba(255,255,255,0.08);
  }
  .def-app.def-theme-dark .def-scorecard-target-card,
  .def-app.def-theme-dark .def-scorecard-table tbody td {
    background: rgba(30,41,59,0.88); border-color: rgba(255,255,255,0.08);
  }
  .def-app.def-theme-dark .def-scorecard-table tbody tr:nth-child(even) td {
    background: rgba(15,23,42,0.45);
  }
  .def-app.def-theme-dark .def-scorecard-imperative { background: rgba(15,23,42,0.65) !important; }
  .def-app.def-theme-dark .def-scorecard-row-click:hover td { background: rgba(99,102,241,0.14) !important; }

  .def-cockpit-theme-dark .def-tracker-search input {
    background: rgba(15,23,42,0.6); border-color: rgba(255,255,255,0.1); color: var(--def-text);
  }
  .def-cockpit-theme-dark .def-tracker-table tbody td { background: rgba(30,41,59,0.5); border-color: rgba(255,255,255,0.06); }
  .def-cockpit-theme-dark .def-tracker-table tbody tr:nth-child(even) td { background: rgba(15,23,42,0.45); }
  .def-cockpit-theme-dark .def-tracker-imperative { background: rgba(15,23,42,0.65) !important; }
  .def-cockpit-theme-dark .def-tracker-row-click:hover td { background: rgba(99,102,241,0.14) !important; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

/* ─────────────────────────────────────────────────────────────
   ROOT APP — layer navigation
───────────────────────────────────────────────────────────── */

const DEF = () => {
  const [layer, setLayer] = useState('ceo');
  const [fastId, setFastId] = useState(null);
  const [initiativeId, setInitiativeId] = useState(null);
  const [drawerProjectId, setDrawerProjectId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const fastCategory = useMemo(() => findFastCategory(fastId), [fastId]);
  const initiative = useMemo(() => findInitiative(fastCategory, initiativeId), [fastCategory, initiativeId]);
  const drawerProject = useMemo(
    () => findProject(initiative, drawerProjectId),
    [initiative, drawerProjectId],
  );

  const navigateTo = (target) => {
    if (target === 'ceo') {
      setLayer('ceo');
      setFastId(null);
      setInitiativeId(null);
      setDrawerProjectId(null);
    } else if (target === 'fast') {
      setLayer('fast');
      setInitiativeId(null);
      setDrawerProjectId(null);
    } else if (target === 'initiative') {
      setLayer('initiative');
      setDrawerProjectId(null);
    } else if (target === 'team') {
      setLayer('team');
      setDrawerProjectId(null);
    }
  };

  const goFast = (id) => {
    setFastId(id);
    setInitiativeId(null);
    setDrawerProjectId(null);
    setLayer('fast');
  };

  const goInitiative = (categoryId, initId) => {
    setFastId(categoryId);
    setInitiativeId(initId);
    setDrawerProjectId(null);
    setLayer('initiative');
  };

  const goTeam = (categoryId, initId) => {
    setFastId(categoryId);
    setInitiativeId(initId);
    setDrawerProjectId(null);
    setLayer('team');
  };

  const openProjectDrawer = (categoryId, initId, prjId) => {
    setFastId(categoryId);
    setInitiativeId(initId);
    setLayer('team');
    setDrawerProjectId(prjId);
  };

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    setSidebarOpen(false);
  }, [layer]);

  useEffect(() => {
    if (layer !== 'team') setDrawerProjectId(null);
  }, [layer]);

  useEffect(() => {
    const lockScroll = (sidebarOpen && window.innerWidth <= 960) || Boolean(drawerProjectId);
    const content = contentRef.current;
    if (content) {
      content.style.overflow = lockScroll ? 'hidden' : '';
    }
    return () => {
      if (content) content.style.overflow = '';
    };
  }, [sidebarOpen, drawerProjectId]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 960) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <div className={`def-app def-theme-${theme}`}>
        <div className="def-mesh def-mesh-1" aria-hidden="true" />
        <div className="def-mesh def-mesh-2" aria-hidden="true" />
        <div className="def-mesh def-mesh-3" aria-hidden="true" />
        <header className="def-topbar">
          <div className="def-topbar-left">
            <button
              type="button"
              className="def-menu-toggle"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-expanded={sidebarOpen}
              aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
            <span className="def-topbar-mark">AD</span>
            <span className="def-topbar-brand">{ORG_DATA.organization.name}</span>
          </div>
          <div className="def-topbar-right">
            <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} />
          </div>
        </header>

        {sidebarOpen && (
          <button
            type="button"
            className="def-sidebar-backdrop"
            aria-label="Close navigation menu"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="def-layout">
          <AppSidebar
            layer={layer}
            fastCategory={fastCategory}
            initiative={initiative}
            open={sidebarOpen}
            onNavigate={() => setSidebarOpen(false)}
            onGoCeo={() => navigateTo('ceo')}
            onSelectFast={goFast}
            onSelectInitiative={goInitiative}
          />

          <div className="def-content-wrap" ref={contentRef}>
            <main className="def-main" key={layer}>
          {layer === 'ceo' && (
            <CeoView theme={theme} onSelectFast={goFast} onOpenInitiative={goInitiative} />
          )}

          {layer === 'fast' && fastCategory && (
            <FastCategoryView
              fastCategory={fastCategory}
              onGoCeo={() => navigateTo('ceo')}
              onSelectInitiative={(initId) => goInitiative(fastCategory.id, initId)}
              onSelectProject={(initId, prjId) => openProjectDrawer(fastCategory.id, initId, prjId)}
              onBack={() => navigateTo('ceo')}
            />
          )}

          {layer === 'initiative' && fastCategory && initiative && (
            <InitiativeView
              fastCategory={fastCategory}
              initiative={initiative}
              onGoCeo={() => navigateTo('ceo')}
              onGoFast={() => navigateTo('fast')}
              onGoTeam={() => goTeam(fastCategory.id, initiative.id)}
              onSelectProject={(prjId) => openProjectDrawer(fastCategory.id, initiative.id, prjId)}
            />
          )}

          {layer === 'team' && fastCategory && initiative && initiative.team && (
            <TeamView
              fastCategory={fastCategory}
              initiative={initiative}
              team={initiative.team}
              activeProjectId={drawerProjectId}
              onOpenProject={setDrawerProjectId}
              onGoCeo={() => navigateTo('ceo')}
              onGoFast={() => navigateTo('fast')}
              onGoInitiative={() => navigateTo('initiative')}
            />
          )}
            </main>
            <AppFooter compact={layer === 'ceo'} />

            {layer === 'team' && fastCategory && initiative && drawerProject && (
              <ProjectDetailDrawer
                project={drawerProject}
                team={initiative.team}
                theme={theme}
                open={Boolean(drawerProjectId)}
                onClose={() => setDrawerProjectId(null)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DEF />
  </React.StrictMode>,
);

export default DEF;
