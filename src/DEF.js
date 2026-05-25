import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const getChartViewportWidth = () => (typeof window !== 'undefined' ? window.innerWidth : 1200);

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

const ORG_DATA = {
  organization: {
    name: 'ADP Demo',
    reportingPeriod: 'Q2 2026',
    lastUpdated: '2026-05-25T09:30:00+05:30',
  },

  ceoSummary: {
    totalManagers: 4,
    totalTeamLeads: 9,
    totalProjects: 14,
    activeProjects: 10,
    delayedProjects: 3,
    atRiskProjects: 4,
    onTrackProjects: 6,
    completedProjects: 4,
    overallHealth: 72,
    totalDevelopers: 38,
  },

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

  managers: [
    {
      id: 'mgr-01',
      name: 'Priya Sharma',
      department: 'Engineering — Platform',
      status: 'at-risk',
      healthScore: 68,
      summary: {
        teamLeads: 3,
        activeProjects: 4,
        delayedProjects: 2,
        completedProjects: 1,
        developers: 12,
        avgUtilization: 87,
      },
      teamLeads: [
        {
          id: 'tl-01',
          name: 'Rahul Mehta',
          team: 'Core Platform',
          status: 'at-risk',
          summary: {
            activeProjects: 2,
            developers: 5,
            delayedProjects: 1,
            pendingModules: 4,
            avgUtilization: 92,
          },
          projects: [
            {
              id: 'prj-01',
              name: 'Identity Gateway v2',
              status: 'delayed',
              risk: 'high',
              client: 'Internal',
              progress: 58,
              duration: { plannedDays: 90, elapsedDays: 78, remainingDays: 28 },
              timeline: {
                startDate: '2026-02-10',
                expectedEndDate: '2026-05-10',
                projectedEndDate: '2026-06-07',
              },
              teamSize: 5,
              delayDays: 28,
              delayReason: 'OAuth module integration blocked on vendor SDK',
              blockers: ['Vendor SDK v3.2 not released', 'Security audit pending'],
              modules: [
                { id: 'm1', name: 'Auth Service', status: 'done', estimatedDays: 14, actualDays: 16, assignee: 'Dev A' },
                { id: 'm2', name: 'OAuth Integration', status: 'in-progress', estimatedDays: 21, actualDays: 28, assignee: 'Dev B' },
                { id: 'm3', name: 'Session Management', status: 'pending', estimatedDays: 12, actualDays: 0, assignee: 'Dev C' },
                { id: 'm4', name: 'Admin Console', status: 'pending', estimatedDays: 18, actualDays: 0, assignee: 'Dev D' },
              ],
              developers: [
                { id: 'd1', name: 'Amit Kumar', role: 'Senior Dev', utilization: 95, currentModule: 'OAuth Integration' },
                { id: 'd2', name: 'Sneha Patel', role: 'Backend Dev', utilization: 88, currentModule: 'Auth Service (wrap-up)' },
                { id: 'd3', name: 'Vikram Singh', role: 'Full Stack', utilization: 90, currentModule: 'OAuth Integration' },
                { id: 'd4', name: 'Neha Gupta', role: 'Frontend Dev', utilization: 82, currentModule: 'Admin Console (planning)' },
                { id: 'd5', name: 'Rohan Das', role: 'QA Engineer', utilization: 75, currentModule: 'Auth Service testing' },
              ],
            },
            {
              id: 'prj-02',
              name: 'API Rate Limiter',
              status: 'on-track',
              risk: 'low',
              client: 'Internal',
              progress: 82,
              duration: { plannedDays: 45, elapsedDays: 34, remainingDays: 11 },
              timeline: {
                startDate: '2026-04-01',
                expectedEndDate: '2026-05-15',
                projectedEndDate: '2026-05-12',
              },
              teamSize: 3,
              delayDays: 0,
              delayReason: null,
              blockers: [],
              modules: [
                { id: 'm5', name: 'Rate Engine', status: 'done', estimatedDays: 10, actualDays: 9, assignee: 'Dev E' },
                { id: 'm6', name: 'Redis Cache Layer', status: 'in-progress', estimatedDays: 8, actualDays: 6, assignee: 'Dev F' },
                { id: 'm7', name: 'Monitoring Hooks', status: 'pending', estimatedDays: 5, actualDays: 0, assignee: 'Dev G' },
              ],
              developers: [
                { id: 'd6', name: 'Karan Joshi', role: 'Backend Dev', utilization: 85, currentModule: 'Redis Cache Layer' },
                { id: 'd7', name: 'Pooja Reddy', role: 'DevOps', utilization: 70, currentModule: 'Monitoring Hooks' },
                { id: 'd8', name: 'Arjun Nair', role: 'Junior Dev', utilization: 78, currentModule: 'Rate Engine (docs)' },
              ],
            },
          ],
        },
        {
          id: 'tl-02',
          name: 'Ananya Iyer',
          team: 'Data Pipeline',
          status: 'on-track',
          summary: {
            activeProjects: 1,
            developers: 4,
            delayedProjects: 0,
            pendingModules: 2,
            avgUtilization: 80,
          },
          projects: [
            {
              id: 'prj-03',
              name: 'Real-time ETL Pipeline',
              status: 'on-track',
              risk: 'medium',
              client: 'RetailCo',
              progress: 71,
              duration: { plannedDays: 60, elapsedDays: 40, remainingDays: 20 },
              timeline: {
                startDate: '2026-03-15',
                expectedEndDate: '2026-05-14',
                projectedEndDate: '2026-05-18',
              },
              teamSize: 4,
              delayDays: 4,
              delayReason: 'Minor schema changes from client',
              blockers: [],
              modules: [
                { id: 'm8', name: 'Ingestion Layer', status: 'done', estimatedDays: 12, actualDays: 11, assignee: 'Dev H' },
                { id: 'm9', name: 'Transform Engine', status: 'in-progress', estimatedDays: 15, actualDays: 12, assignee: 'Dev I' },
                { id: 'm10', name: 'Output Connectors', status: 'pending', estimatedDays: 10, actualDays: 0, assignee: 'Dev J' },
                { id: 'm11', name: 'Dashboard Integration', status: 'pending', estimatedDays: 8, actualDays: 0, assignee: 'Dev K' },
              ],
              developers: [
                { id: 'd9', name: 'Manish Rao', role: 'Data Engineer', utilization: 88, currentModule: 'Transform Engine' },
                { id: 'd10', name: 'Divya Shah', role: 'Backend Dev', utilization: 82, currentModule: 'Ingestion Layer (support)' },
                { id: 'd11', name: 'Ishaan Verma', role: 'Junior Dev', utilization: 76, currentModule: 'Output Connectors (prep)' },
                { id: 'd12', name: 'Lakshmi N', role: 'QA', utilization: 65, currentModule: 'Ingestion testing' },
              ],
            },
          ],
        },
        {
          id: 'tl-03',
          name: 'Suresh Kulkarni',
          team: 'Infrastructure',
          status: 'blocked',
          summary: {
            activeProjects: 1,
            developers: 3,
            delayedProjects: 1,
            pendingModules: 3,
            avgUtilization: 91,
          },
          projects: [
            {
              id: 'prj-04',
              name: 'K8s Migration Phase 2',
              status: 'blocked',
              risk: 'high',
              client: 'Internal',
              progress: 35,
              duration: { plannedDays: 75, elapsedDays: 52, remainingDays: 38 },
              timeline: {
                startDate: '2026-01-20',
                expectedEndDate: '2026-04-05',
                projectedEndDate: '2026-06-20',
              },
              teamSize: 3,
              delayDays: 76,
              delayReason: 'Cloud provider quota approval stuck with finance',
              blockers: ['Finance approval pending 3 weeks', 'Staging cluster unavailable'],
              modules: [
                { id: 'm12', name: 'Cluster Setup', status: 'done', estimatedDays: 10, actualDays: 14, assignee: 'Dev L' },
                { id: 'm13', name: 'Service Migration', status: 'in-progress', estimatedDays: 25, actualDays: 30, assignee: 'Dev M' },
                { id: 'm14', name: 'CI/CD Pipeline', status: 'pending', estimatedDays: 12, actualDays: 0, assignee: 'Dev N' },
                { id: 'm15', name: 'Rollback Strategy', status: 'pending', estimatedDays: 8, actualDays: 0, assignee: 'Dev L' },
              ],
              developers: [
                { id: 'd13', name: 'Rajesh Pillai', role: 'DevOps Lead', utilization: 98, currentModule: 'Service Migration' },
                { id: 'd14', name: 'Meera Thomas', role: 'SRE', utilization: 92, currentModule: 'Cluster Setup (support)' },
                { id: 'd15', name: 'Farhan Ali', role: 'DevOps', utilization: 85, currentModule: 'CI/CD Pipeline (blocked)' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'mgr-02',
      name: 'Arun Desai',
      department: 'Engineering — Products',
      status: 'on-track',
      healthScore: 84,
      summary: {
        teamLeads: 2,
        activeProjects: 3,
        delayedProjects: 0,
        completedProjects: 2,
        developers: 10,
        avgUtilization: 79,
      },
      teamLeads: [
        {
          id: 'tl-04',
          name: 'Kavita Menon',
          team: 'Mobile Apps',
          status: 'on-track',
          summary: {
            activeProjects: 2,
            developers: 6,
            delayedProjects: 0,
            pendingModules: 3,
            avgUtilization: 81,
          },
          projects: [
            {
              id: 'prj-05',
              name: 'Customer App v4.0',
              status: 'on-track',
              risk: 'low',
              client: 'FinServe Ltd',
              progress: 88,
              duration: { plannedDays: 120, elapsedDays: 98, remainingDays: 22 },
              timeline: {
                startDate: '2025-12-01',
                expectedEndDate: '2026-05-30',
                projectedEndDate: '2026-05-25',
              },
              teamSize: 4,
              delayDays: 0,
              delayReason: null,
              blockers: [],
              modules: [
                { id: 'm16', name: 'UI Redesign', status: 'done', estimatedDays: 30, actualDays: 28, assignee: 'Dev O' },
                { id: 'm17', name: 'Payment Flow', status: 'in-progress', estimatedDays: 20, actualDays: 15, assignee: 'Dev P' },
                { id: 'm18', name: 'Push Notifications', status: 'pending', estimatedDays: 10, actualDays: 0, assignee: 'Dev Q' },
              ],
              developers: [
                { id: 'd16', name: 'Tarun Bhatia', role: 'Mobile Lead', utilization: 90, currentModule: 'Payment Flow' },
                { id: 'd17', name: 'Anjali Roy', role: 'iOS Dev', utilization: 85, currentModule: 'Payment Flow' },
                { id: 'd18', name: 'Mohit Saxena', role: 'Android Dev', utilization: 88, currentModule: 'Push Notifications (prep)' },
                { id: 'd19', name: 'Ritu Malhotra', role: 'UI/UX Dev', utilization: 72, currentModule: 'UI Redesign (polish)' },
              ],
            },
            {
              id: 'prj-06',
              name: 'Partner SDK',
              status: 'on-track',
              risk: 'medium',
              client: 'External Partners',
              progress: 64,
              duration: { plannedDays: 50, elapsedDays: 30, remainingDays: 20 },
              timeline: {
                startDate: '2026-04-01',
                expectedEndDate: '2026-05-20',
                projectedEndDate: '2026-05-22',
              },
              teamSize: 2,
              delayDays: 2,
              delayReason: null,
              blockers: [],
              modules: [
                { id: 'm19', name: 'Core SDK', status: 'in-progress', estimatedDays: 18, actualDays: 14, assignee: 'Dev R' },
                { id: 'm20', name: 'Documentation', status: 'pending', estimatedDays: 8, actualDays: 0, assignee: 'Dev S' },
              ],
              developers: [
                { id: 'd20', name: 'Gaurav Mishra', role: 'SDK Engineer', utilization: 86, currentModule: 'Core SDK' },
                { id: 'd21', name: 'Shweta Kulkarni', role: 'Technical Writer', utilization: 60, currentModule: 'Documentation (outline)' },
              ],
            },
          ],
        },
        {
          id: 'tl-05',
          name: 'Deepak Choudhary',
          team: 'Web Products',
          status: 'on-track',
          summary: {
            activeProjects: 1,
            developers: 4,
            delayedProjects: 0,
            pendingModules: 1,
            avgUtilization: 77,
          },
          projects: [
            {
              id: 'prj-07',
              name: 'Admin Portal Rewrite',
              status: 'on-track',
              risk: 'low',
              client: 'Internal',
              progress: 76,
              duration: { plannedDays: 80, elapsedDays: 55, remainingDays: 25 },
              timeline: {
                startDate: '2026-02-20',
                expectedEndDate: '2026-05-10',
                projectedEndDate: '2026-05-08',
              },
              teamSize: 4,
              delayDays: 0,
              delayReason: null,
              blockers: [],
              modules: [
                { id: 'm21', name: 'User Management', status: 'done', estimatedDays: 15, actualDays: 14, assignee: 'Dev T' },
                { id: 'm22', name: 'Reporting Module', status: 'in-progress', estimatedDays: 20, actualDays: 16, assignee: 'Dev U' },
                { id: 'm23', name: 'Settings & Config', status: 'pending', estimatedDays: 12, actualDays: 0, assignee: 'Dev V' },
              ],
              developers: [
                { id: 'd22', name: 'Nitin Agarwal', role: 'Frontend Lead', utilization: 84, currentModule: 'Reporting Module' },
                { id: 'd23', name: 'Preeti Sinha', role: 'React Dev', utilization: 80, currentModule: 'Reporting Module' },
                { id: 'd24', name: 'Harsh Vardhan', role: 'Backend Dev', utilization: 75, currentModule: 'Settings & Config (API design)' },
                { id: 'd25', name: 'Yash Malhotra', role: 'QA', utilization: 68, currentModule: 'User Management testing' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'mgr-03',
      name: 'Meena Krishnan',
      department: 'Engineering — Analytics',
      status: 'on-track',
      healthScore: 79,
      summary: {
        teamLeads: 2,
        activeProjects: 2,
        delayedProjects: 1,
        completedProjects: 1,
        developers: 9,
        avgUtilization: 83,
      },
      teamLeads: [
        {
          id: 'tl-06',
          name: 'Sanjay Bhatt',
          team: 'BI & Reporting',
          status: 'at-risk',
          summary: {
            activeProjects: 1,
            developers: 5,
            delayedProjects: 1,
            pendingModules: 2,
            avgUtilization: 86,
          },
          projects: [
            {
              id: 'prj-08',
              name: 'Executive Dashboard Suite',
              status: 'delayed',
              risk: 'medium',
              client: 'C-Suite',
              progress: 52,
              duration: { plannedDays: 70, elapsedDays: 60, remainingDays: 22 },
              timeline: {
                startDate: '2026-02-25',
                expectedEndDate: '2026-05-05',
                projectedEndDate: '2026-05-28',
              },
              teamSize: 5,
              delayDays: 23,
              delayReason: 'Scope creep — 3 new KPI widgets added mid-sprint',
              blockers: ['Data source API unstable'],
              modules: [
                { id: 'm24', name: 'KPI Widgets', status: 'in-progress', estimatedDays: 18, actualDays: 22, assignee: 'Dev W' },
                { id: 'm25', name: 'Drill-down Views', status: 'pending', estimatedDays: 14, actualDays: 0, assignee: 'Dev X' },
                { id: 'm26', name: 'Export & Scheduling', status: 'pending', estimatedDays: 10, actualDays: 0, assignee: 'Dev Y' },
              ],
              developers: [
                { id: 'd26', name: 'Abhishek Nanda', role: 'Analytics Lead', utilization: 92, currentModule: 'KPI Widgets' },
                { id: 'd27', name: 'Chitra Deshmukh', role: 'Data Viz Dev', utilization: 88, currentModule: 'KPI Widgets' },
                { id: 'd28', name: 'Varun Kapoor', role: 'Backend Dev', utilization: 85, currentModule: 'Data source fixes' },
                { id: 'd29', name: 'Komal Jain', role: 'Frontend Dev', utilization: 80, currentModule: 'Drill-down (wireframes)' },
                { id: 'd30', name: 'Aditya Bose', role: 'QA', utilization: 70, currentModule: 'KPI Widgets testing' },
              ],
            },
          ],
        },
        {
          id: 'tl-07',
          name: 'Rekha Sundaram',
          team: 'ML Engineering',
          status: 'on-track',
          summary: {
            activeProjects: 1,
            developers: 4,
            delayedProjects: 0,
            pendingModules: 1,
            avgUtilization: 78,
          },
          projects: [
            {
              id: 'prj-09',
              name: 'Churn Prediction Model',
              status: 'on-track',
              risk: 'low',
              client: 'Sales Team',
              progress: 90,
              duration: { plannedDays: 55, elapsedDays: 48, remainingDays: 7 },
              timeline: {
                startDate: '2026-03-01',
                expectedEndDate: '2026-04-25',
                projectedEndDate: '2026-04-22',
              },
              teamSize: 4,
              delayDays: 0,
              delayReason: null,
              blockers: [],
              modules: [
                { id: 'm27', name: 'Feature Engineering', status: 'done', estimatedDays: 12, actualDays: 11, assignee: 'Dev Z' },
                { id: 'm28', name: 'Model Training', status: 'done', estimatedDays: 15, actualDays: 14, assignee: 'Dev AA' },
                { id: 'm29', name: 'API Deployment', status: 'in-progress', estimatedDays: 8, actualDays: 5, assignee: 'Dev AB' },
              ],
              developers: [
                { id: 'd31', name: 'Pranav Iyer', role: 'ML Engineer', utilization: 90, currentModule: 'API Deployment' },
                { id: 'd32', name: 'Nandini Rao', role: 'Data Scientist', utilization: 85, currentModule: 'Model tuning' },
                { id: 'd33', name: 'Sameer Khan', role: 'MLOps', utilization: 82, currentModule: 'API Deployment' },
                { id: 'd34', name: 'Olivia Fernandes', role: 'Junior DS', utilization: 65, currentModule: 'Documentation' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'mgr-04',
      name: 'Vikash Malhotra',
      department: 'Engineering — Integrations',
      status: 'on-track',
      healthScore: 81,
      summary: {
        teamLeads: 2,
        activeProjects: 2,
        delayedProjects: 0,
        completedProjects: 0,
        developers: 7,
        avgUtilization: 74,
      },
      teamLeads: [
        {
          id: 'tl-08',
          name: 'Nisha Agarwal',
          team: 'Third-party Integrations',
          status: 'on-track',
          summary: {
            activeProjects: 1,
            developers: 4,
            delayedProjects: 0,
            pendingModules: 2,
            avgUtilization: 76,
          },
          projects: [
            {
              id: 'prj-10',
              name: 'Salesforce Connector',
              status: 'on-track',
              risk: 'medium',
              client: 'Enterprise Sales',
              progress: 67,
              duration: { plannedDays: 65, elapsedDays: 42, remainingDays: 23 },
              timeline: {
                startDate: '2026-03-10',
                expectedEndDate: '2026-05-14',
                projectedEndDate: '2026-05-16',
              },
              teamSize: 4,
              delayDays: 2,
              delayReason: null,
              blockers: [],
              modules: [
                { id: 'm30', name: 'OAuth & Auth', status: 'done', estimatedDays: 10, actualDays: 9, assignee: 'Dev AC' },
                { id: 'm31', name: 'Sync Engine', status: 'in-progress', estimatedDays: 18, actualDays: 14, assignee: 'Dev AD' },
                { id: 'm32', name: 'Error Handling', status: 'pending', estimatedDays: 8, actualDays: 0, assignee: 'Dev AE' },
              ],
              developers: [
                { id: 'd35', name: 'Rahul Verma', role: 'Integration Lead', utilization: 84, currentModule: 'Sync Engine' },
                { id: 'd36', name: 'Sonia Mehta', role: 'Backend Dev', utilization: 78, currentModule: 'Sync Engine' },
                { id: 'd37', name: 'Kunal Shah', role: 'Junior Dev', utilization: 72, currentModule: 'Error Handling (research)' },
                { id: 'd38', name: 'Pallavi Nair', role: 'QA', utilization: 68, currentModule: 'OAuth testing' },
              ],
            },
          ],
        },
        {
          id: 'tl-09',
          name: 'Harish Pillai',
          team: 'Legacy Modernization',
          status: 'on-track',
          summary: {
            activeProjects: 1,
            developers: 3,
            delayedProjects: 0,
            pendingModules: 4,
            avgUtilization: 71,
          },
          projects: [
            {
              id: 'prj-11',
              name: 'Mainframe API Wrapper',
              status: 'on-track',
              risk: 'high',
              client: 'Banking Client',
              progress: 44,
              duration: { plannedDays: 100, elapsedDays: 38, remainingDays: 62 },
              timeline: {
                startDate: '2026-03-20',
                expectedEndDate: '2026-06-28',
                projectedEndDate: '2026-06-28',
              },
              teamSize: 3,
              delayDays: 0,
              delayReason: null,
              blockers: ['Legacy documentation incomplete'],
              modules: [
                { id: 'm33', name: 'COBOL Parser', status: 'in-progress', estimatedDays: 25, actualDays: 18, assignee: 'Dev AF' },
                { id: 'm34', name: 'REST API Layer', status: 'pending', estimatedDays: 20, actualDays: 0, assignee: 'Dev AG' },
                { id: 'm35', name: 'Security Layer', status: 'pending', estimatedDays: 15, actualDays: 0, assignee: 'Dev AH' },
                { id: 'm36', name: 'Load Testing', status: 'pending', estimatedDays: 10, actualDays: 0, assignee: 'Dev AF' },
              ],
              developers: [
                { id: 'd39', name: 'George Mathew', role: 'Legacy Specialist', utilization: 88, currentModule: 'COBOL Parser' },
                { id: 'd40', name: 'Bhavna Joshi', role: 'Backend Dev', utilization: 70, currentModule: 'REST API (design)' },
                { id: 'd41', name: 'Chetan Rao', role: 'Security Engineer', utilization: 55, currentModule: 'Security Layer (planning)' },
              ],
            },
          ],
        },
      ],
    },
  ],
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

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function healthColor(score) {
  if (score >= 80) return '#059669';
  if (score >= 65) return '#d97706';
  return '#dc2626';
}

function movingAverage(values, window) {
  return values.map((_, i) => {
    if (i < window - 1) return null;
    const slice = values.slice(i - window + 1, i + 1);
    return Math.round((slice.reduce((a, b) => a + b, 0) / slice.length) * 10) / 10;
  });
}

function buildHealthSeries(points, fastWindow, slowWindow) {
  const closes = points.map((p) => p.close);
  const maFast = movingAverage(closes, fastWindow);
  const maSlow = movingAverage(closes, slowWindow);

  return points.map((p, i) => {
    const prevClose = i > 0 ? points[i - 1].close : p.open;
    const change = +(p.close - prevClose).toFixed(1);
    const changePct = prevClose ? +((change / prevClose) * 100).toFixed(2) : 0;
    return {
      ...p,
      health: p.close,
      maFast: maFast[i],
      maSlow: maSlow[i],
      change,
      changePct,
      isUp: p.close >= p.open,
    };
  });
}

function HealthChartDot({ cx, cy, payload }) {
  if (cx == null || cy == null || !payload) return null;
  const color = healthColor(payload.close);
  return <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={2} />;
}

function HealthChartActiveDot({ cx, cy, payload }) {
  if (cx == null || cy == null || !payload) return null;
  const color = healthColor(payload.close);
  return (
    <g>
      <circle cx={cx} cy={cy} r={12} fill={color} opacity={0.18} />
      <circle cx={cx} cy={cy} r={6} fill={color} stroke="#fff" strokeWidth={2.5} />
    </g>
  );
}

function formatVolume(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return `${value}`;
}

function HealthChartTooltip({ active, payload, label, statusFilters, showProjects, showTrend }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  const rows = [];
  if (showTrend) {
    rows.push({ label: 'Health Index', value: `${d.close}%`, color: healthColor(d.close) });
    rows.push({ label: 'Range', value: `${d.low}% – ${d.high}%` });
  }
  if (showProjects) {
    if (statusFilters.onTrack) rows.push({ label: 'On Track', value: d.onTrack, color: '#059669' });
    if (statusFilters.atRisk) rows.push({ label: 'At Risk', value: d.atRisk, color: '#d97706' });
    if (statusFilters.delayed) rows.push({ label: 'Delayed', value: d.delayed, color: '#dc2626' });
    if (statusFilters.utilization) rows.push({ label: 'Utilization', value: `${d.utilization}%`, color: '#7c3aed' });
  }
  if (!showProjects) {
    rows.push({ label: 'Volume', value: formatVolume(d.volume) });
  }

  return (
    <div className="def-health-tooltip">
      <div className="def-health-tooltip-head">
        <div>
          <p className="def-health-tooltip-period">{label}</p>
          {showTrend && (
            <strong className="def-health-tooltip-score" style={{ color: healthColor(d.close) }}>{d.close}%</strong>
          )}
        </div>
        {showTrend && (
          <span className={`def-health-tooltip-delta${d.change >= 0 ? ' up' : ' down'}`}>
            {d.change >= 0 ? '▲' : '▼'} {Math.abs(d.change)} ({d.changePct >= 0 ? '+' : ''}{d.changePct}%)
          </span>
        )}
      </div>
      {rows.length > 0 && (
        <div className="def-health-tooltip-grid">
          {rows.map((row) => (
            <div key={row.label}>
              <span>{row.label}</span>
              <strong style={row.color ? { color: row.color } : undefined}>{row.value}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function findManager(id) {
  return ORG_DATA.managers.find((m) => m.id === id);
}

function findTeamLead(manager, id) {
  return manager?.teamLeads.find((tl) => tl.id === id);
}

function findProject(teamLead, id) {
  return teamLead?.projects.find((p) => p.id === id);
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
    <div className="def-kpi-strip">
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
  manager,
  teamLead,
  onGoCeo,
  onSelectManager,
  onSelectTeamLead,
  open,
  onNavigate,
}) {
  const { organization } = ORG_DATA;
  const [expandedMgr, setExpandedMgr] = useState(manager?.id ?? null);

  useEffect(() => {
    if (manager?.id) setExpandedMgr(manager.id);
  }, [manager?.id]);

  const toggleManager = (mgrId) => {
    setExpandedMgr((prev) => (prev === mgrId ? null : mgrId));
  };

  const goCeo = () => {
    onGoCeo();
    onNavigate?.();
  };

  const selectManager = (mgrId) => {
    onSelectManager(mgrId);
    onNavigate?.();
  };

  const selectTeamLead = (mgrId, tlId) => {
    onSelectTeamLead(mgrId, tlId);
    setExpandedMgr(mgrId);
    onNavigate?.();
  };

  return (
    <aside className={`def-sidebar${open ? ' def-sidebar-open' : ''}`}>
      <div className="def-sidebar-brand def-sidebar-brand-compact">
        <span className="def-sidebar-period">{organization.reportingPeriod}</span>
        <span className="def-sidebar-period-hint">Reporting period</span>
      </div>

      <nav className="def-sidebar-nav">
        <p className="def-sidebar-label">Organization</p>
        <button
          type="button"
          className={`def-sidebar-link def-sidebar-link-ceo${layer === 'ceo' ? ' active' : ''}`}
          onClick={goCeo}
        >
          <span className="def-sidebar-tier def-sidebar-tier-ceo">CEO</span>
          <span className="def-sidebar-link-text">
            <strong>CEO Overview</strong>
            <small>Executive dashboard</small>
          </span>
        </button>

        <p className="def-sidebar-label def-sidebar-label-section">
          Managers
          <span className="def-sidebar-count">{ORG_DATA.managers.length}</span>
        </p>

        {ORG_DATA.managers.map((mgr) => {
          const isExpanded = expandedMgr === mgr.id;
          const isActive = manager?.id === mgr.id;
          return (
            <div key={mgr.id} className={`def-sidebar-group${isActive ? ' active' : ''}`}>
              <div className="def-sidebar-row">
                <button
                  type="button"
                  className={`def-sidebar-link${isActive ? ' active' : ''}`}
                  onClick={() => selectManager(mgr.id)}
                >
                  <span className="def-sidebar-tier def-sidebar-tier-mgr">M</span>
                  <span className="def-sidebar-link-text">
                    <strong>{mgr.name}</strong>
                    <small>
                      <span className="def-sidebar-role">Manager</span>
                      · {mgr.department}
                    </small>
                  </span>
                  <span className="def-sidebar-score" style={{ color: healthColor(mgr.healthScore) }}>{mgr.healthScore}%</span>
                </button>
                <button
                  type="button"
                  className={`def-sidebar-toggle${isExpanded ? ' open' : ''}`}
                  onClick={() => toggleManager(mgr.id)}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? 'Hide' : 'Show'} team leads under ${mgr.name}`}
                  title={`${isExpanded ? 'Hide' : 'Show'} team leads`}
                >
                  {isExpanded ? '▾' : '▸'}
                </button>
              </div>
              {isExpanded && (
                <div className="def-sidebar-nested">
                  <p className="def-sidebar-sublabel">
                    Team Leads
                    <span className="def-sidebar-count">{mgr.teamLeads.length}</span>
                  </p>
                  {mgr.teamLeads.map((tl) => {
                    const isTlActive = teamLead?.id === tl.id;
                    return (
                      <button
                        key={tl.id}
                        type="button"
                        className={`def-sidebar-nested-link${isTlActive ? ' active' : ''}`}
                        onClick={() => selectTeamLead(mgr.id, tl.id)}
                      >
                        <span className="def-sidebar-tier def-sidebar-tier-tl">TL</span>
                        <span className="def-sidebar-nested-text">
                          <strong>{tl.name}</strong>
                          <small>Team Lead · {tl.team}</small>
                        </span>
                        <StatusPill status={tl.status} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function AppFooter() {
  return (
    <footer className="def-footer">
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

const CEO_CHART_RANGES = ['8W', '6M'];

const CEO_STATUS_FILTERS = [
  { key: 'onTrack', label: 'On Track', legendClass: 'def-lg-ontrack' },
  { key: 'atRisk', label: 'At Risk', legendClass: 'def-lg-atrisk' },
  { key: 'delayed', label: 'Delayed', legendClass: 'def-lg-delayed' },
  { key: 'utilization', label: 'Utilization', legendClass: 'def-lg-util', line: true },
];

const DEFAULT_STATUS_FILTERS = {
  onTrack: true,
  atRisk: true,
  delayed: true,
  utilization: true,
};

/** Lets the page scroll when the wheel is used over Recharts SVG areas. */
function ScrollPass({ children, className, scrollRootRef }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const getScrollEl = () => scrollRootRef?.current
      || root.closest('.def-content-wrap')
      || document.scrollingElement
      || document.documentElement;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const inChart = e.target.closest('.recharts-wrapper, .recharts-surface, svg');
      if (!inChart || !root.contains(inChart)) return;
      e.preventDefault();
      getScrollEl().scrollBy({ top: e.deltaY, left: 0 });
    };

    root.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => root.removeEventListener('wheel', onWheel, { capture: true });
  }, [scrollRootRef]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function CeoExecutiveChart({ theme = 'light', scrollRootRef }) {
  const r = useResponsiveChart();
  const { ceoTrends } = ORG_DATA;
  const [range, setRange] = useState('8W');
  const [showTrend, setShowTrend] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [statusFilters, setStatusFilters] = useState(DEFAULT_STATUS_FILTERS);

  const toggleStatusFilter = (key) => {
    setStatusFilters((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const anyActive = Object.values(next).some(Boolean);
      return anyActive ? next : prev;
    });
  };

  const rawData = range === '8W' ? ceoTrends.weekly : ceoTrends.monthly;
  const maFastWindow = range === '8W' ? 3 : 2;
  const maSlowWindow = range === '8W' ? 5 : 3;
  const data = useMemo(
    () => buildHealthSeries(rawData, maFastWindow, maSlowWindow),
    [rawData, maFastWindow, maSlowWindow],
  );

  const hasBarFilters = statusFilters.onTrack || statusFilters.atRisk || statusFilters.delayed;
  const hasUtilFilter = statusFilters.utilization;
  const activeFilterLabels = CEO_STATUS_FILTERS.filter(({ key }) => statusFilters[key]).map(({ label }) => label);

  const projectsStackMax = useMemo(() => {
    if (!showProjects || !hasBarFilters) return 4;
    return Math.max(
      ...data.map((d) => {
        let sum = 0;
        if (statusFilters.onTrack) sum += d.onTrack;
        if (statusFilters.atRisk) sum += d.atRisk;
        if (statusFilters.delayed) sum += d.delayed;
        return sum;
      }),
      1,
    );
  }, [data, showProjects, hasBarFilters, statusFilters]);

  const countSeriesMax = useMemo(() => Math.max(
    ...data.flatMap((d) => [
      statusFilters.onTrack ? d.onTrack : 0,
      statusFilters.atRisk ? d.atRisk : 0,
      statusFilters.delayed ? d.delayed : 0,
    ]),
    1,
  ), [data, statusFilters]);

  const mainHeight = r.isMobile ? 220 : r.isTablet ? 280 : 340;
  const subHeight = showTrend ? (r.isMobile ? 130 : 130) : (r.isMobile ? 200 : 220);
  const margin = useMemo(
    () => (r.isMobile
      ? { top: 8, right: 2, left: -6, bottom: 0 }
      : r.isTablet
        ? { top: 12, right: 8, left: 0, bottom: 0 }
        : { top: 16, right: 12, left: 4, bottom: 0 }),
    [r.isMobile, r.isTablet],
  );

  const topMargin = useMemo(() => {
    if (!showProjects || (!hasBarFilters && !hasUtilFilter)) return margin;
    return { ...margin, right: r.isMobile ? 28 : 36 };
  }, [margin, showProjects, hasBarFilters, hasUtilFilter, r.isMobile]);

  const healthDomain = useMemo(() => {
    const lows = data.map((d) => d.low);
    const highs = data.map((d) => d.high);
    const pad = 4;
    return [Math.max(0, Math.floor(Math.min(...lows) - pad)), Math.min(100, Math.ceil(Math.max(...highs) + pad))];
  }, [data]);

  const isDark = theme === 'dark';
  const chartTick = isDark ? '#94949e' : '#64748b';
  const chartGrid = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.12)';
  const chartAxis = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.2)';
  const cursorColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.12)';
  const tooltipProps = { statusFilters, showProjects, showTrend };

  return (
    <section className="def-section def-health-chart def-stagger-in" style={{ '--stagger': '80ms' }}>
      <div className="def-chart-head">
        <div>
          <h2 className="def-section-title">Portfolio Health</h2>
          <p className="def-section-desc">
            {showProjects && activeFilterLabels.length
              ? `Filtered · ${activeFilterLabels.join(' · ')} · ${range === '8W' ? '8 weeks' : '6 months'}`
              : 'Org health trend · project mix · delivery volume'}
          </p>
        </div>
        <div className="def-chart-controls">
          <div className="def-chart-chip-group">
            <button type="button" className={`def-chart-chip${showTrend ? ' active' : ''}`} onClick={() => setShowTrend((v) => !v)} aria-pressed={showTrend}>
              Trend
            </button>
            <button type="button" className={`def-chart-chip${showProjects ? ' active' : ''}`} onClick={() => setShowProjects((v) => !v)} aria-pressed={showProjects}>
              Projects
            </button>
          </div>
          {showProjects && (
            <div className="def-chart-chip-group def-chart-status-group">
              {CEO_STATUS_FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  className={`def-chart-chip def-chart-status-chip def-chart-status-${key}${statusFilters[key] ? ' active' : ''}`}
                  onClick={() => toggleStatusFilter(key)}
                  aria-pressed={statusFilters[key]}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <div className="def-chart-chip-group">
            {CEO_CHART_RANGES.map((item) => (
              <button
                key={item}
                type="button"
                className={`def-chart-chip${range === item ? ' active' : ''}`}
                onClick={() => setRange(item)}
              >
                {item === '8W' ? '8W' : '6M'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ScrollPass className="def-health-chart-card" scrollRootRef={scrollRootRef}>
        {showTrend && (
          <ResponsiveContainer width="100%" height={mainHeight}>
            <ComposedChart data={data} margin={topMargin} syncId="healthExec">
              <defs>
                <linearGradient id="defHealthAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.42} />
                  <stop offset="55%" stopColor="#a855f7" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="defHealthLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 8" stroke={chartGrid} vertical={false} />
              <ReferenceArea yAxisId="health" y1={80} y2={100} fill="#34d399" fillOpacity={0.08} />
              <ReferenceArea yAxisId="health" y1={65} y2={80} fill="#fbbf24" fillOpacity={0.06} />
              <ReferenceArea yAxisId="health" y1={healthDomain[0]} y2={65} fill="#f87171" fillOpacity={0.05} />

              <XAxis dataKey="label" tick={false} axisLine={{ stroke: chartAxis }} tickLine={false} height={1} />
              <YAxis
                yAxisId="health"
                domain={healthDomain}
                tick={{ fontSize: r.tickSmall, fill: chartTick, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                width={r.isMobile ? 36 : 44}
                tickFormatter={(v) => `${v}%`}
              />
              {showProjects && hasBarFilters && (
                <YAxis
                  yAxisId="counts"
                  orientation="right"
                  domain={[0, countSeriesMax + 1]}
                  tick={{ fontSize: r.tickSmall, fill: chartTick, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  width={r.isMobile ? 28 : 34}
                  allowDecimals={false}
                />
              )}
              {showProjects && hasUtilFilter && (
                <YAxis
                  yAxisId="utilTop"
                  orientation="right"
                  domain={[70, 100]}
                  tick={{ fontSize: r.tickSmall, fill: chartTick, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  width={r.isMobile ? 28 : 34}
                  tickFormatter={(v) => `${v}%`}
                />
              )}
              <Tooltip
                content={<HealthChartTooltip {...tooltipProps} />}
                cursor={{ stroke: '#a855f7', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                isAnimationActive={false}
              />
              <ReferenceLine
                yAxisId="health"
                y={ceoTrends.targetHealth}
                stroke="#34d399"
                strokeDasharray="6 4"
                strokeWidth={2}
                label={r.isMobile ? undefined : {
                  value: `Target ${ceoTrends.targetHealth}%`,
                  position: 'insideTopRight',
                  fill: '#34d399',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />

              <Area
                yAxisId="health"
                type="monotone"
                dataKey="close"
                stroke="none"
                fill="url(#defHealthAreaFill)"
                isAnimationActive
                animationDuration={800}
              />
              <Line
                yAxisId="health"
                type="monotone"
                dataKey="high"
                stroke="#4ade80"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                opacity={0.45}
                name="High"
              />
              <Line
                yAxisId="health"
                type="monotone"
                dataKey="low"
                stroke="#f87171"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                opacity={0.45}
                name="Low"
              />
              <Line
                yAxisId="health"
                type="monotone"
                dataKey="close"
                stroke="url(#defHealthLine)"
                strokeWidth={3}
                dot={<HealthChartDot />}
                activeDot={<HealthChartActiveDot />}
                name="Health"
              />
              <Line yAxisId="health" type="monotone" dataKey="maFast" stroke="#fbbf24" strokeWidth={2} dot={false} connectNulls opacity={0.85} name="MA Fast" />
              <Line yAxisId="health" type="monotone" dataKey="maSlow" stroke="#c4b5fd" strokeWidth={2} dot={false} connectNulls strokeDasharray="6 4" opacity={0.85} name="MA Slow" />

              {showProjects && statusFilters.onTrack && (
                <Line yAxisId="counts" type="monotone" dataKey="onTrack" stroke="#4ade80" strokeWidth={2.5} dot={{ r: 3, fill: '#4ade80' }} name="On Track" />
              )}
              {showProjects && statusFilters.atRisk && (
                <Line yAxisId="counts" type="monotone" dataKey="atRisk" stroke="#fbbf24" strokeWidth={2.5} dot={{ r: 3, fill: '#fbbf24' }} name="At Risk" />
              )}
              {showProjects && statusFilters.delayed && (
                <Line yAxisId="counts" type="monotone" dataKey="delayed" stroke="#f87171" strokeWidth={2.5} dot={{ r: 3, fill: '#f87171' }} name="Delayed" />
              )}
              {showProjects && statusFilters.utilization && (
                <Line yAxisId="utilTop" type="monotone" dataKey="utilization" stroke="#a855f7" strokeWidth={2.5} strokeDasharray="5 3" dot={{ r: 3, fill: '#a855f7' }} name="Utilization" />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}

        <div className="def-health-chart-divider">
          <span>
            {showProjects
              ? (activeFilterLabels.length ? `Project Mix · ${activeFilterLabels.join(', ')}` : 'Project Status Mix')
              : 'Delivery Volume'}
          </span>
          <span className="def-health-chart-divider-hint">
            {showTrend && showProjects ? 'Top trend + bottom mix synced' : showTrend ? 'Health trend view' : 'Project mix view'}
          </span>
        </div>

        <ResponsiveContainer width="100%" height={subHeight}>
          <ComposedChart data={data} margin={{ ...margin, top: 4, bottom: r.isMobile ? 28 : 20, right: hasUtilFilter && showProjects ? (r.isMobile ? 28 : 36) : margin.right }} syncId="healthExec">
            <CartesianGrid strokeDasharray="3 8" stroke={chartGrid} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: r.tickSmall, fill: chartTick, fontWeight: 600 }}
              axisLine={{ stroke: chartAxis }}
              tickLine={false}
              interval={r.isMobile ? 1 : 0}
              angle={r.isMobile ? -25 : 0}
              textAnchor={r.isMobile ? 'end' : 'middle'}
              height={r.isMobile ? 40 : 28}
            />
            {showProjects ? (
              <>
                {hasBarFilters && (
                  <YAxis yAxisId="projects" hide domain={[0, projectsStackMax + 2]} />
                )}
                {hasUtilFilter && (
                  <YAxis yAxisId="util" orientation="right" domain={[70, 100]} tick={{ fontSize: r.tickSmall, fill: chartTick }} width={r.isMobile ? 28 : 36} tickFormatter={(v) => `${v}%`} />
                )}
                {showTrend ? (
                  <Tooltip cursor={{ fill: cursorColor }} content={() => null} wrapperStyle={{ display: 'none' }} />
                ) : (
                  <Tooltip cursor={{ fill: cursorColor }} content={<HealthChartTooltip {...tooltipProps} />} isAnimationActive={false} />
                )}
                {statusFilters.onTrack && (
                  <Bar yAxisId="projects" dataKey="onTrack" stackId="mix" fill="#4ade80" barSize={r.isMobile ? 14 : 20} radius={[0, 0, 0, 0]} name="On Track" />
                )}
                {statusFilters.atRisk && (
                  <Bar yAxisId="projects" dataKey="atRisk" stackId="mix" fill="#fbbf24" barSize={r.isMobile ? 14 : 20} name="At Risk" />
                )}
                {statusFilters.delayed && (
                  <Bar yAxisId="projects" dataKey="delayed" stackId="mix" fill="#f87171" barSize={r.isMobile ? 14 : 20} radius={[4, 4, 0, 0]} name="Delayed" />
                )}
                {statusFilters.utilization && (
                  <Line yAxisId="util" type="monotone" dataKey="utilization" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3, fill: '#a855f7' }} name="Utilization %" />
                )}
              </>
            ) : (
              <>
                <YAxis yAxisId="volume" hide domain={[0, 'dataMax * 1.15']} />
                {showTrend ? (
                  <Tooltip cursor={{ fill: cursorColor }} content={() => null} wrapperStyle={{ display: 'none' }} />
                ) : (
                  <Tooltip cursor={{ fill: cursorColor }} content={<HealthChartTooltip {...tooltipProps} />} isAnimationActive={false} />
                )}
                <Bar yAxisId="volume" dataKey="volume" barSize={r.isMobile ? 12 : 18} radius={[4, 4, 0, 0]} name="Volume">
                  {data.map((entry) => (
                    <Cell key={entry.label} fill={healthColor(entry.close) + '99'} />
                  ))}
                </Bar>
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>

        <div className="def-health-legend">
          {showTrend && (
            <>
              <span><i className="def-lg-area" /> Health index</span>
              <span><i className="def-lg-high" /> High / Low band</span>
              <span><i className="def-lg-target" /> Target {ceoTrends.targetHealth}%</span>
              <span><i className="def-lg-ma" /> Moving avg</span>
            </>
          )}
          {showProjects ? (
            CEO_STATUS_FILTERS.filter(({ key }) => statusFilters[key]).map(({ key, label, legendClass }) => (
              <span key={key}><i className={legendClass} /> {label}{showTrend ? ' (both charts)' : ''}</span>
            ))
          ) : (
            <span><i className="def-lg-vol" /> Delivery volume</span>
          )}
        </div>
      </ScrollPass>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   LAYER VIEWS
───────────────────────────────────────────────────────────── */

function CeoView({ theme, scrollRootRef }) {
  const { ceoSummary, organization } = ORG_DATA;

  return (
    <div className="def-layer def-page-enter">
      <header className="def-layer-header def-hero-panel def-hero-premium">
        <div className="def-hero-content">
          <p className="def-eyebrow">Executive Overview</p>
          <h1>CEO Dashboard</h1>
          <p className="def-subtitle">
            {ceoSummary.totalManagers} managers · {ceoSummary.totalProjects} projects
          </p>
        </div>
        <div className="def-hero-stats">
          <div className="def-updated def-live-badge">
            <span className="def-live-dot" />
            Live · {formatDate(organization.lastUpdated)}
          </div>
        </div>
      </header>

      <KpiStrip
        items={[
          { label: 'Overall Health', value: `${ceoSummary.overallHealth}%`, color: healthColor(ceoSummary.overallHealth) },
          { label: 'Active Projects', value: ceoSummary.activeProjects },
          { label: 'On Track', value: ceoSummary.onTrackProjects, color: '#059669' },
          { label: 'At Risk', value: ceoSummary.atRiskProjects, color: '#ea580c' },
          { label: 'Delayed / Blocked', value: ceoSummary.delayedProjects, color: '#dc2626' },
          { label: 'Completed', value: ceoSummary.completedProjects, color: '#2563eb' },
        ]}
      />

      <CeoExecutiveChart theme={theme} scrollRootRef={scrollRootRef} />
    </div>
  );
}

function ManagerView({ manager, onSelectTeamLead, onSelectProject, onGoCeo, onBack }) {
  return (
    <div className="def-layer def-page-enter">
      <HierarchyTrail
        items={[
          { key: 'ceo', tier: 'CEO', label: 'Overview', onClick: onGoCeo },
          { key: 'mgr', tier: 'Manager', label: manager.name },
        ]}
      />
      <header className="def-layer-header def-hero-panel def-hero-premium">
        <div className="def-header-with-avatar def-hero-content">
          <Avatar name={manager.name} tone="blue" />
          <div>
            <p className="def-eyebrow">Manager View</p>
            <h1>{manager.name}</h1>
            <p className="def-subtitle">{manager.department} · {manager.teamLeads.length} team leads · {manager.summary.activeProjects} active projects</p>
          </div>
        </div>
        <div className="def-hero-stats">
          <StatusPill status={manager.status} />
        </div>
      </header>

      <SectionCard title="Team Lead Performance">
        <div className="def-table-wrap def-table-pro">
          <table className="def-table">
            <thead>
              <tr>
                <th>Team Lead</th>
                <th>Team</th>
                <th>Status</th>
                <th>Projects</th>
                <th>Delayed</th>
                <th>Developers</th>
                <th>Pending Modules</th>
                <th>Utilization</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {manager.teamLeads.map((tl, index) => (
                <tr key={tl.id} className="def-table-row def-stagger-in" style={{ '--stagger': `${index * 60}ms` }}>
                  <td>
                    <div className="def-table-name">
                      <Avatar name={tl.name} tone="slate" />
                      <div>
                        <strong>{tl.name}</strong>
                        <div className="def-linked-projects">
                          {tl.projects.map((prj) => (
                            <button
                              key={prj.id}
                              type="button"
                              className="def-linked-chip"
                              onClick={() => onSelectProject(tl.id, prj.id)}
                              title={`Open ${prj.name}`}
                            >
                              {prj.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{tl.team}</td>
                  <td><StatusPill status={tl.status} /></td>
                  <td>{tl.summary.activeProjects}</td>
                  <td style={{ color: tl.summary.delayedProjects ? '#dc2626' : '#059669', fontWeight: 600 }}>
                    {tl.summary.delayedProjects}
                  </td>
                  <td>{tl.summary.developers}</td>
                  <td>{tl.summary.pendingModules}</td>
                  <td>
                    <div className="def-inline-progress">
                      <ProgressBar value={tl.summary.avgUtilization} />
                      <span>{tl.summary.avgUtilization}%</span>
                    </div>
                  </td>
                  <td>
                    <button type="button" className="def-btn-sm" onClick={() => onSelectTeamLead(tl.id)}>
                      View Projects →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <button type="button" className="def-back-btn" onClick={onBack}>← Back to CEO View</button>
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
      <ResponsiveContainer width="100%" height={108}>
        <PieChart>
          <Pie
            data={ringData}
            cx="50%"
            cy="50%"
            innerRadius={44}
            outerRadius={58}
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
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie
              data={moduleData}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={58}
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
        <ResponsiveContainer width="100%" height={140}>
          <ComposedChart data={burndownData} margin={{ top: 6, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="defDrawerArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke={grid} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: tick }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: tick }} axisLine={false} tickLine={false} width={26} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<DrawerChartTooltip />} />
            <Line type="monotone" dataKey="planned" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Planned" />
            <Area type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={2} fill="url(#defDrawerArea)" name="Actual" connectNulls />
          </ComposedChart>
        </ResponsiveContainer>
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
          <h3>Work Breakdown</h3>
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
          <h3>Team · {project.developers.length}</h3>
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

function ProjectDetailDrawer({ project, teamLead, open, onClose, theme = 'light' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !project) return null;

  const statusMeta = STATUS_META[project.status] || STATUS_META['on-track'];

  return (
    <div className="def-drawer-root open" role="presentation">
      <button type="button" className="def-drawer-backdrop" aria-label="Close project details" onClick={onClose} />
      <aside className="def-drawer def-drawer-pro" role="dialog" aria-modal="true" aria-labelledby="def-drawer-title">
        <header className="def-drawer-head def-drawer-head-pro">
          <div className="def-drawer-head-accent" style={{ background: `linear-gradient(135deg, ${statusMeta.color}22, transparent)` }} />
          <div className="def-drawer-head-inner">
            <div className="def-drawer-head-row">
              <span className="def-drawer-tier">Project Detail</span>
              <button type="button" className="def-drawer-close" onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>
            <h2 id="def-drawer-title">{project.name}</h2>
            <p className="def-drawer-subtitle">{project.client} · {teamLead.name}</p>
            <div className="def-drawer-head-badges">
              <StatusPill status={project.status} />
              <RiskBadge risk={project.risk} />
            </div>
          </div>
        </header>
        <div className="def-drawer-body def-drawer-body-pro">
          <ProjectDetailContent project={project} theme={theme} />
        </div>
      </aside>
    </div>
  );
}

function TeamLeadView({
  manager,
  teamLead,
  activeProjectId,
  onOpenProject,
  onGoCeo,
  onGoManager,
  onBack,
}) {
  return (
    <div className="def-layer def-page-enter">
      <HierarchyTrail
        items={[
          { key: 'ceo', tier: 'CEO', label: 'Overview', onClick: onGoCeo },
          { key: 'mgr', tier: 'Manager', label: manager.name, onClick: onGoManager },
          { key: 'tl', tier: 'Team Lead', label: teamLead.name },
        ]}
      />
      <header className="def-layer-header def-hero-panel def-hero-premium">
        <div className="def-header-with-avatar def-hero-content">
          <Avatar name={teamLead.name} tone="indigo" />
          <div>
            <p className="def-eyebrow">Team Lead View</p>
            <h1>{teamLead.name}</h1>
            <p className="def-subtitle">
              {teamLead.team} · reports to {manager.name} · {teamLead.projects.length} projects
            </p>
          </div>
        </div>
        <div className="def-hero-stats">
          <StatusPill status={teamLead.status} />
        </div>
      </header>

      <SectionCard title={`Projects · ${teamLead.name}`} desc={`${teamLead.projects.length} projects under ${teamLead.name}`}>
        <div className="def-table-wrap def-table-pro">
          <table className="def-table def-project-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Projected End</th>
                <th>Team</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {teamLead.projects.map((prj) => (
                <tr
                  key={prj.id}
                  className={`def-table-row def-project-row${activeProjectId === prj.id ? ' def-project-row-active' : ''}`}
                >
                  <td>
                    <strong className="def-project-name">{prj.name}</strong>
                    {prj.delayReason && (
                      <span className="def-project-row-hint">{prj.delayReason}</span>
                    )}
                  </td>
                  <td>{prj.client}</td>
                  <td>
                    <div className="def-project-row-badges">
                      <StatusPill status={prj.status} />
                      <RiskBadge risk={prj.risk} />
                    </div>
                  </td>
                  <td>
                    <div className="def-inline-progress def-inline-progress-wide">
                      <ProgressBar value={prj.progress} />
                      <span>{prj.progress}%</span>
                    </div>
                  </td>
                  <td style={{ color: prj.delayDays > 0 ? '#dc2626' : 'inherit', fontWeight: prj.delayDays > 0 ? 600 : 400 }}>
                    {formatDate(prj.timeline.projectedEndDate)}
                    {prj.delayDays > 0 && ` (+${prj.delayDays}d)`}
                  </td>
                  <td>{prj.teamSize}</td>
                  <td className="def-project-row-action">
                    <button
                      type="button"
                      className="def-btn-sm"
                      onClick={() => onOpenProject(prj.id)}
                    >
                      View Project →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <button type="button" className="def-back-btn" onClick={onBack}>← Back to Manager View</button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */

const STYLES = `
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
    --def-sidebar-w: 280px;
    --def-topbar-h: 64px;
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
    box-shadow: inset 3px 0 0 #d4d4d4, 0 8px 24px rgba(0,0,0,0.35);
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
    padding: 0 24px;
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
    padding: 20px 14px;
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
    gap: 8px;
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--def-sidebar-muted);
    font-weight: 700;
    padding: 8px 10px 6px;
    margin: 0;
  }
  .def-sidebar-label-section {
    margin-top: 10px;
    padding-top: 14px;
    border-top: 1px solid var(--def-sidebar-border);
  }
  .def-sidebar-sublabel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin: 0 0 6px;
    padding: 0 4px 4px;
    font-size: 0.58rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--def-sidebar-muted);
  }
  .def-sidebar-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 6px;
    border-radius: 999px;
    background: var(--def-topbar-pill-bg);
    border: 1px solid var(--def-sidebar-border);
    font-size: 0.58rem;
    font-weight: 800;
    letter-spacing: 0;
    color: var(--def-sidebar-text);
  }
  .def-sidebar-tier {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 9px;
    font-size: 0.58rem;
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
    width: 28px;
    height: 28px;
    border-radius: 8px;
    font-size: 0.52rem;
    background: rgba(255,255,255,0.06);
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
    gap: 4px;
    flex: 1;
    min-height: 0;
    padding-bottom: 8px;
  }
  .def-sidebar-group { margin-bottom: 2px; }
  .def-sidebar-row {
    display: flex;
    align-items: stretch;
    gap: 4px;
  }
  .def-sidebar-row .def-sidebar-link { flex: 1; min-width: 0; }
  .def-sidebar-toggle {
    flex-shrink: 0;
    width: 32px;
    border: 1px solid var(--def-sidebar-border);
    border-radius: 10px;
    background: var(--def-topbar-pill-bg);
    color: var(--def-sidebar-muted);
    cursor: pointer;
    font-size: 0.75rem;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .def-sidebar-toggle:hover,
  .def-sidebar-toggle.open {
    background: rgba(99,102,241,0.15);
    border-color: rgba(167,139,250,0.3);
    color: var(--def-sidebar-text);
  }
  .def-sidebar-link {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: transparent;
    color: inherit;
    cursor: pointer;
    text-align: left;
    font: inherit;
    transition: background 0.22s, border-color 0.22s, transform 0.22s;
  }
  .def-sidebar-link:hover { background: var(--def-sidebar-hover); transform: translateX(3px); }
  .def-sidebar-link.active {
    background: var(--def-sidebar-active);
    border-color: rgba(167,139,250,0.4);
    box-shadow: inset 3px 0 0 #a78bfa, 0 8px 24px rgba(99,102,241,0.15);
  }
  .def-sidebar-link-icon { opacity: 0.7; font-size: 0.7rem; }
  .def-sidebar-link .def-avatar { width: 32px; height: 32px; font-size: 0.62rem; border-radius: 9px; }
  .def-sidebar-link-text { flex: 1; min-width: 0; }
  .def-sidebar-link-text strong { display: block; font-size: 0.78rem; color: var(--def-sidebar-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .def-sidebar-link-text small { font-size: 0.65rem; color: var(--def-sidebar-muted); line-height: 1.35; }
  .def-sidebar-score { font-size: 0.72rem; font-weight: 800; flex-shrink: 0; }
  .def-sidebar-nested {
    margin: 4px 0 8px 18px;
    padding: 8px 0 4px 14px;
    border-left: 2px solid var(--def-sidebar-border);
    animation: defFadeUp 0.3s ease both;
  }
  .def-sidebar-nested-link {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 10px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: transparent;
    color: var(--def-sidebar-text);
    cursor: pointer;
    font: inherit;
    text-align: left;
    transition: background 0.2s, border-color 0.2s;
  }
  .def-sidebar-nested-text {
    flex: 1;
    min-width: 0;
  }
  .def-sidebar-nested-text strong {
    display: block;
    font-size: 0.74rem;
    color: var(--def-sidebar-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .def-sidebar-nested-text small {
    display: block;
    font-size: 0.62rem;
    color: var(--def-sidebar-muted);
    margin-top: 1px;
  }
  .def-sidebar-nested-link:hover { background: var(--def-sidebar-hover); }
  .def-sidebar-nested-link.active {
    background: var(--def-sidebar-active);
    border-color: rgba(167,139,250,0.35);
    box-shadow: inset 2px 0 0 #a78bfa;
  }
  .def-app.def-theme-dark .def-sidebar-nested-link.active {
    border-color: rgba(255,255,255,0.12);
    box-shadow: inset 2px 0 0 #d4d4d4;
  }
  .def-sidebar-nested-link .def-pill { transform: scale(0.85); flex-shrink: 0; }

  .def-main {
    flex: 1;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    margin: 0;
    overflow-x: hidden;
    padding: clamp(16px, 2vw, 28px) clamp(16px, 2vw, 28px) 32px;
  }

  .def-footer {
    width: 100%;
    padding: 14px clamp(20px, 2.5vw, 36px);
    border-top: 1px solid var(--def-border-soft);
    background: var(--def-footer-bg);
    backdrop-filter: blur(12px);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 0.72rem;
    color: var(--def-muted);
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
    .def-main { padding: 16px 14px 24px; }
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
      margin-left: 10px;
      padding-left: 10px;
    }
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
      padding: 11px 12px;
      font-size: 0.8rem;
    }
    .def-table-pro .def-table {
      min-width: 680px;
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
    .def-main { padding: 14px 12px 20px; }
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
      width: 28px;
      height: 28px;
      font-size: 0.52rem;
    }
    .def-sidebar-link {
      padding: 8px;
      gap: 8px;
    }
    .def-sidebar-score {
      font-size: 0.66rem;
    }
    .def-sidebar-nested-link .def-pill {
      display: none;
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
    padding: 24px;
    margin-bottom: 24px;
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
    overflow: hidden;
    box-shadow: inset 0 0 0 1px #e2e8f0;
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 24px;
    width: 100%;
  }
  @media (min-width: 1280px) {
    .def-kpi-strip { grid-template-columns: repeat(6, minmax(0, 1fr)); }
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
    background: rgba(255,255,255,0.85);
    border-color: rgba(167,139,250,0.45);
    color: var(--def-blue);
    transform: translateX(-4px);
    box-shadow: var(--def-shadow-glow);
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
    position: absolute;
    inset: 0;
    z-index: 120;
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
    grid-template-columns: 108px 1fr;
    gap: 14px;
    align-items: center;
    padding: 14px 16px;
    margin-bottom: 14px;
    border-radius: 16px;
    background: var(--def-glass);
    border: 1px solid var(--def-border);
  }
  .def-drawer-gauge {
    position: relative;
    width: 108px;
    height: 108px;
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
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 14px;
  }
  .def-drawer-charts-compact .def-drawer-chart-card {
    padding: 12px;
    border-radius: 14px;
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
  @media (max-width: 640px) {
    .def-drawer { width: 100%; }
    .def-drawer-summary { grid-template-columns: 1fr; text-align: center; }
    .def-drawer-gauge { margin: 0 auto; }
    .def-drawer-charts-compact { grid-template-columns: 1fr; }
    .def-project-table { min-width: 720px; }
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
  const [managerId, setManagerId] = useState(null);
  const [teamLeadId, setTeamLeadId] = useState(null);
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

  const manager = useMemo(() => findManager(managerId), [managerId]);
  const teamLead = useMemo(() => findTeamLead(manager, teamLeadId), [manager, teamLeadId]);
  const drawerProject = useMemo(
    () => findProject(teamLead, drawerProjectId),
    [teamLead, drawerProjectId],
  );

  const navigateTo = (target) => {
    if (target === 'ceo') {
      setLayer('ceo');
      setManagerId(null);
      setTeamLeadId(null);
      setDrawerProjectId(null);
    } else if (target === 'manager') {
      setLayer('manager');
      setTeamLeadId(null);
      setDrawerProjectId(null);
    } else if (target === 'teamLead') {
      setLayer('teamLead');
      setDrawerProjectId(null);
    }
  };

  const goManager = (id) => {
    setManagerId(id);
    setTeamLeadId(null);
    setDrawerProjectId(null);
    setLayer('manager');
  };

  const goTeamLead = (mgrId, tlId) => {
    setManagerId(mgrId);
    setTeamLeadId(tlId);
    setDrawerProjectId(null);
    setLayer('teamLead');
  };

  const openProjectDrawer = (mgrId, tlId, prjId) => {
    setManagerId(mgrId);
    setTeamLeadId(tlId);
    setLayer('teamLead');
    setDrawerProjectId(prjId);
  };

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    setSidebarOpen(false);
  }, [layer]);

  useEffect(() => {
    if (layer !== 'teamLead') setDrawerProjectId(null);
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
            manager={manager}
            teamLead={teamLead}
            open={sidebarOpen}
            onNavigate={() => setSidebarOpen(false)}
            onGoCeo={() => navigateTo('ceo')}
            onSelectManager={goManager}
            onSelectTeamLead={goTeamLead}
          />

          <div className="def-content-wrap" ref={contentRef}>
            <main className="def-main" key={layer}>
          {layer === 'ceo' && (
            <CeoView theme={theme} scrollRootRef={contentRef} />
          )}

          {layer === 'manager' && manager && (
            <ManagerView
              manager={manager}
              onGoCeo={() => navigateTo('ceo')}
              onSelectTeamLead={(tlId) => {
                setTeamLeadId(tlId);
                setLayer('teamLead');
              }}
              onSelectProject={(tlId, prjId) => openProjectDrawer(manager.id, tlId, prjId)}
              onBack={() => navigateTo('ceo')}
            />
          )}

          {layer === 'teamLead' && manager && teamLead && (
            <TeamLeadView
              manager={manager}
              teamLead={teamLead}
              activeProjectId={drawerProjectId}
              onOpenProject={setDrawerProjectId}
              onGoCeo={() => navigateTo('ceo')}
              onGoManager={() => navigateTo('manager')}
              onBack={() => navigateTo('manager')}
            />
          )}
            </main>
            <AppFooter />

            {layer === 'teamLead' && manager && teamLead && drawerProject && (
              <ProjectDetailDrawer
                project={drawerProject}
                teamLead={teamLead}
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

export default DEF;
