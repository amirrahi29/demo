/**
 * ═══════════════════════════════════════════════════════════════
 *  PORTABLE MIGRATION DASHBOARD — Enterprise Edition
 * ═══════════════════════════════════════════════════════════════
 *
 *  Copy this ENTIRE file → paste as App.js in any React project.
 *
 *  Only extra step in new project:
 *    npm install recharts
 *
 *  ALL CSS is embedded below (global reset + dashboard styles).
 *  No App.css / index.css / external stylesheet needed.
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

// ── ALL CSS embedded here (global + dashboard) ──
const DASHBOARD_STYLES = `
  /* Global Reset */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { min-height: 100vh; }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Arial, Calibri, -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #eef1f5;
  }

  @keyframes mdFadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mdFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes mdScaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes mdPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.6; transform: scale(1.4); }
  }
  @keyframes mdShimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes mdBarGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  .md-root {
    min-height: 100vh;
    padding: 24px 28px 32px;
    font-family: 'Segoe UI', Arial, Calibri, sans-serif;
    background: linear-gradient(135deg, #e8edf4 0%, #eef2f7 40%, #e4ebf5 100%);
    position: relative;
    overflow-x: hidden;
  }
  .md-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse at 10% 0%, rgba(26,58,107,0.06) 0%, transparent 50%),
      radial-gradient(ellipse at 90% 100%, rgba(224,122,58,0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  .md-root *, .md-root *::before, .md-root *::after { box-sizing: border-box; }
  .md-content { position: relative; z-index: 1; }

  /* Header */
  .md-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    animation: mdFadeInUp 0.6s ease both;
  }
  .md-header-left h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: #1a3a6b;
    letter-spacing: -0.3px;
  }
  .md-header-left p {
    margin: 4px 0 0;
    font-size: 13px;
    color: #5a7291;
  }
  .md-live-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1px solid #c8d9ea;
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 600;
    color: #1a3a6b;
    box-shadow: 0 2px 8px rgba(26,58,107,0.08);
    transition: all 0.3s ease;
  }
  .md-live-badge:hover {
    box-shadow: 0 4px 16px rgba(26,58,107,0.14);
    transform: translateY(-1px);
  }
  .md-live-dot {
    width: 8px; height: 8px;
    background: #22c55e;
    border-radius: 50%;
    animation: mdPulse 2s ease infinite;
    box-shadow: 0 0 6px rgba(34,197,94,0.6);
  }

  /* Metric Cards */
  .md-metric-cards {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-bottom: 22px;
  }
  .md-metric-card {
    position: relative;
    background: #ffffff;
    border: 1px solid rgba(26,58,107,0.15);
    border-radius: 14px;
    padding: 20px 16px 18px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100px;
    overflow: hidden;
    cursor: default;
    box-shadow: 0 2px 8px rgba(26,58,107,0.06);
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
                box-shadow 0.35s ease,
                border-color 0.35s ease;
    animation: mdFadeInUp 0.6s ease both;
  }
  .md-metric-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--accent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }
  .md-metric-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%);
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  .md-metric-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(26,58,107,0.14);
    border-color: var(--accent);
  }
  .md-metric-card:hover::before { transform: scaleX(1); }
  .md-metric-card:hover::after {
    opacity: 1;
    animation: mdShimmer 1.2s ease;
  }
  .md-metric-card:nth-child(1) { animation-delay: 0.05s; --accent: #1a3a6b; }
  .md-metric-card:nth-child(2) { animation-delay: 0.10s; --accent: #2563eb; }
  .md-metric-card:nth-child(3) { animation-delay: 0.15s; --accent: #e07a3a; }
  .md-metric-card:nth-child(4) { animation-delay: 0.20s; --accent: #059669; }
  .md-metric-card:nth-child(5) { animation-delay: 0.25s; --accent: #7c3aed; }
  .md-metric-icon {
    width: 42px;
    height: 42px;
    border-radius: 11px;
    background: color-mix(in srgb, var(--accent) 12%, white);
    border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    color: var(--accent);
    flex-shrink: 0;
    transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  }
  .md-metric-icon svg {
    width: 20px;
    height: 20px;
    display: block;
  }
  .md-metric-card:hover .md-metric-icon {
    transform: scale(1.08);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--accent) 25%, transparent);
    background: color-mix(in srgb, var(--accent) 18%, white);
  }
  .md-metric-title {
    color: #5a7291;
    font-size: 11.5px;
    font-weight: 600;
    margin: 0 0 10px;
    line-height: 1.4;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .md-metric-value {
    color: #1a3a6b;
    font-size: 30px;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.5px;
    transition: color 0.3s ease;
  }
  .md-metric-card:hover .md-metric-value { color: var(--accent); }

  /* Charts */
  .md-charts-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 22px;
  }
  .md-chart-box {
    background: #ffffff;
    border: 1px solid rgba(26,58,107,0.12);
    border-radius: 14px;
    padding: 16px 14px 10px;
    box-shadow: 0 2px 8px rgba(26,58,107,0.06);
    overflow: hidden;
    transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
    animation: mdScaleIn 0.7s ease both;
  }
  .md-chart-box:nth-child(1) { animation-delay: 0.30s; }
  .md-chart-box:nth-child(2) { animation-delay: 0.38s; }
  .md-chart-box:nth-child(3) { animation-delay: 0.46s; }
  .md-chart-box:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 32px rgba(26,58,107,0.12);
    border-color: rgba(26,58,107,0.25);
  }
  .md-chart-title {
    color: #1a3a6b;
    font-size: 13px;
    font-weight: 700;
    margin: 0 0 8px;
    text-align: center;
    letter-spacing: 0.2px;
  }
  .md-chart-subtitle {
    text-align: center;
    font-size: 11px;
    color: #8fa3bb;
    margin: -4px 0 8px;
  }

  /* Custom Tooltip */
  .md-tooltip {
    background: rgba(26,58,107,0.95);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 10px;
    padding: 10px 14px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    animation: mdFadeIn 0.2s ease;
  }
  .md-tooltip-label {
    color: rgba(255,255,255,0.7);
    font-size: 11px;
    margin-bottom: 6px;
    font-weight: 600;
  }
  .md-tooltip-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    margin: 3px 0;
  }
  .md-tooltip-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* Table */
  .md-table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    animation: mdFadeInUp 0.6s ease 0.55s both;
  }
  .md-table-header h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #1a3a6b;
  }
  .md-table-count {
    font-size: 12px;
    color: #8fa3bb;
    background: #fff;
    border: 1px solid #c8d9ea;
    border-radius: 20px;
    padding: 4px 12px;
    font-weight: 600;
  }
  .md-table-section {
    background: #ffffff;
    border: 1px solid rgba(26,58,107,0.12);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(26,58,107,0.06);
    transition: box-shadow 0.35s ease;
    animation: mdFadeInUp 0.7s ease 0.60s both;
  }
  .md-table-section:hover {
    box-shadow: 0 8px 24px rgba(26,58,107,0.10);
  }
  .md-table-scroll {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: #b8cde0 transparent;
  }
  .md-table-scroll::-webkit-scrollbar { height: 6px; }
  .md-table-scroll::-webkit-scrollbar-thumb {
    background: #b8cde0;
    border-radius: 10px;
  }
  .md-table-scroll-hint {
    display: none;
    text-align: center;
    font-size: 11px;
    color: #8fa3bb;
    padding: 6px 0 2px;
    font-weight: 600;
  }

  /* Mobile Table Cards */
  .md-table-mobile { display: none; }
  .md-mobile-card {
    background: #fff;
    border: 1px solid #dde6f0;
    border-radius: 12px;
    padding: 14px;
    margin-bottom: 10px;
    box-shadow: 0 2px 6px rgba(26,58,107,0.05);
    transition: box-shadow 0.25s ease, transform 0.25s ease;
    animation: mdFadeInUp 0.5s ease both;
  }
  .md-mobile-card:active { transform: scale(0.99); }
  .md-mobile-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8eef5;
  }
  .md-mobile-card-header strong {
    font-size: 14px;
    color: #1a3a6b;
    display: block;
  }
  .md-mobile-card-id {
    font-size: 11px;
    color: #8fa3bb;
    margin-top: 2px;
  }
  .md-mobile-card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    font-size: 12px;
    gap: 8px;
  }
  .md-mobile-card-label {
    color: #8fa3bb;
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    flex-shrink: 0;
  }
  .md-mobile-card-value {
    color: #1a3a6b;
    font-weight: 600;
    text-align: right;
    word-break: break-word;
  }
  .md-mobile-card-row .md-progress-cell {
    width: 130px;
    justify-content: flex-end;
  }
  .md-chart-inner {
    width: 100%;
    min-height: 240px;
  }
  .md-migration-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  .md-migration-table thead tr {
    background: linear-gradient(135deg, #1a3a6b 0%, #254d85 100%);
  }
  .md-migration-table th {
    color: #ffffff;
    font-weight: 700;
    padding: 13px 16px;
    text-align: left;
    white-space: nowrap;
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  .md-migration-table td {
    padding: 12px 16px;
    color: #1a3a6b;
    border-bottom: 1px solid #e8eef5;
    transition: background 0.25s ease, padding-left 0.25s ease;
  }
  .md-migration-table tbody tr {
    transition: background 0.25s ease;
    animation: mdFadeIn 0.5s ease both;
  }
  .md-migration-table tbody tr:nth-child(1) { animation-delay: 0.65s; }
  .md-migration-table tbody tr:nth-child(2) { animation-delay: 0.70s; }
  .md-migration-table tbody tr:nth-child(3) { animation-delay: 0.75s; }
  .md-migration-table tbody tr:nth-child(4) { animation-delay: 0.80s; }
  .md-migration-table tbody tr:nth-child(5) { animation-delay: 0.85s; }
  .md-migration-table tbody tr:nth-child(6) { animation-delay: 0.90s; }
  .md-migration-table tbody tr:nth-child(even) { background: #f4f8fc; }
  .md-migration-table tbody tr:nth-child(odd)  { background: #ffffff; }
  .md-migration-table tbody tr:hover {
    background: #dceaf8 !important;
  }
  .md-migration-table tbody tr:hover td:first-child {
    box-shadow: inset 3px 0 0 #2563eb;
  }

  /* Status Badge */
  .md-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .md-badge:hover { transform: scale(1.05); }
  .md-badge-on-track {
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #bbf7d0;
  }
  .md-badge-completed {
    background: #dbeafe;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
  }
  .md-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  /* Progress Bar in Table */
  .md-progress-cell {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .md-progress-bar {
    flex: 1;
    height: 6px;
    background: #e2eaf3;
    border-radius: 10px;
    overflow: hidden;
    min-width: 60px;
  }
  .md-progress-fill {
    height: 100%;
    border-radius: 10px;
    background: linear-gradient(90deg, #1a3a6b, #2563eb);
    transform-origin: left;
    animation: mdBarGrow 1s ease both;
    transition: width 0.6s ease;
  }
  .md-progress-fill.complete {
    background: linear-gradient(90deg, #059669, #34d399);
  }
  .md-progress-text {
    font-weight: 700;
    font-size: 11.5px;
    min-width: 32px;
    text-align: right;
  }

  @media (max-width: 1400px) {
    .md-metric-cards { grid-template-columns: repeat(5, 1fr); gap: 12px; }
    .md-root { padding: 20px 20px 28px; }
  }

  @media (max-width: 1200px) {
    .md-metric-cards { grid-template-columns: repeat(3, 1fr); }
    .md-charts-row { grid-template-columns: repeat(2, 1fr); }
    .md-charts-row .md-chart-box:last-child { grid-column: 1 / -1; }
    .md-header-left h1 { font-size: 20px; }
  }

  @media (max-width: 992px) {
    .md-metric-cards { grid-template-columns: repeat(2, 1fr); }
    .md-charts-row { grid-template-columns: 1fr; }
    .md-charts-row .md-chart-box:last-child { grid-column: auto; }
    .md-migration-table { min-width: 720px; }
    .md-table-scroll-hint { display: block; }
    .md-table-header { flex-wrap: wrap; gap: 8px; }
  }

  @media (max-width: 768px) {
    .md-root { padding: 16px 14px 24px; }
    .md-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 18px;
    }
    .md-header-left h1 { font-size: 18px; }
    .md-header-left p { font-size: 12px; line-height: 1.5; }
    .md-live-badge { width: 100%; justify-content: center; }
    .md-metric-card { min-height: 90px; padding: 16px 14px; }
    .md-metric-value { font-size: 26px; }
    .md-metric-title { font-size: 10.5px; }
    .md-chart-box { padding: 12px 8px 6px; }
    .md-chart-title { font-size: 12px; }
    .md-chart-subtitle { font-size: 10px; }
    .md-table-header h2 { font-size: 15px; }
    .md-progress-bar { min-width: 48px; }
  }

  @media (max-width: 640px) {
    .md-table-desktop { display: none; }
    .md-table-mobile { display: block; padding: 12px; }
    .md-table-scroll-hint { display: none; }
    .md-migration-table { min-width: unset; }
  }

  @media (max-width: 576px) {
    .md-metric-cards { grid-template-columns: 1fr; gap: 10px; }
    .md-metric-card {
      flex-direction: row;
      align-items: center;
      text-align: left;
      gap: 14px;
      min-height: unset;
      padding: 14px 16px;
    }
    .md-metric-icon { margin-bottom: 0; width: 44px; height: 44px; }
    .md-metric-icon svg { width: 22px; height: 22px; }
    .md-metric-title { margin-bottom: 4px; }
    .md-metric-value { font-size: 24px; }
    .md-chart-inner { min-height: 220px; }
    .md-tooltip { padding: 8px 10px; max-width: 200px; }
    .md-tooltip-item { font-size: 11px; }
  }

  @media (max-width: 400px) {
    .md-root { padding: 12px 10px 20px; }
    .md-header-left h1 { font-size: 16px; }
    .md-live-badge { font-size: 11px; padding: 6px 12px; }
    .md-metric-value { font-size: 22px; }
    .md-mobile-card { padding: 12px; }
  }

  @media (hover: hover) {
    .md-metric-card:hover { transform: translateY(-6px); }
    .md-chart-box:hover { transform: translateY(-4px); }
    .md-live-badge:hover { transform: translateY(-1px); }
    .md-badge:hover { transform: scale(1.05); }
  }

  @media (hover: none) {
    .md-metric-card:hover,
    .md-chart-box:hover,
    .md-live-badge:hover { transform: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

function DashboardStyles() {
  return <style>{DASHBOARD_STYLES}</style>;
}

// ── Data ──
const colors = {
  orange: '#e07a3a',
  orangeLight: '#f09658',
  line1: '#0b2f6b',
  line2: '#1d4ed8',
  line3: '#5b9bd5',
  line4: '#7ec8e3',
};

const metricCards = [
  { title: '% Applications Migrated', value: 13, icon: 'migrate', suffix: '%' },
  { title: 'Cloud Spend Contribution to Total Growth', value: 24, icon: 'cloud', suffix: '%' },
  { title: '% idle (zombie) Resources', value: 20, icon: 'idle', suffix: '%' },
  { title: 'Cloud Cost Reduction (%)', value: 16, icon: 'savings', suffix: '%' },
  { title: 'BF wise Migrations %', value: 13, icon: 'analytics', suffix: '%' },
];

const dcLocationData = [
  { location: 'DC1 and 2', apps: 18, completion: 18 },
  { location: 'DC10 and 11', apps: 587, completion: 20 },
  { location: 'DC12 and 13', apps: 77, completion: 100 },
  { location: 'DC14 and 15', apps: 33, completion: 100 },
  { location: 'DC4 and 5', apps: 44, completion: 55 },
];

const buData = [
  { bu: 'SM...', apps: 6, completion: 4 },
  { bu: 'AD...', apps: 33, completion: 44 },
  { bu: 'NAS', apps: 21, completion: 12 },
  { bu: 'ESI', apps: 33, completion: 100 },
  { bu: 'Out...', apps: 44, completion: 55 },
];

const monthlyProgressData = [
  { month: 'Jan-26', appMigrated: 8, bfWise: 6, cloudSpend: 12, costReduction: 5 },
  { month: 'Feb-26', appMigrated: 18, bfWise: 14, cloudSpend: 22, costReduction: 12 },
  { month: 'Mar-26', appMigrated: 32, bfWise: 26, cloudSpend: 38, costReduction: 22 },
  { month: 'Apr-26', appMigrated: 48, bfWise: 40, cloudSpend: 55, costReduction: 35 },
];

const migrationTableData = [
  { dcLocation: 'DC1 and 2', productId: '10001', productName: 'RLIN', completion: 2, migrationStatus: 'On Track', migrationPhase: '' },
  { dcLocation: 'DC1 and 2', productId: '10002', productName: 'CA Service Desk', completion: 0, migrationStatus: 'On Track', migrationPhase: '3- Non-Prod Migration & testing' },
  { dcLocation: 'DC10 and 11', productId: '10003', productName: 'Enterprise Portal', completion: 45, migrationStatus: 'On Track', migrationPhase: '2- Assessment' },
  { dcLocation: 'DC12 and 13', productId: '10004', productName: 'Data Analytics Hub', completion: 100, migrationStatus: 'Completed', migrationPhase: '5- Production Migration' },
  { dcLocation: 'DC14 and 15', productId: '10005', productName: 'CRM Platform', completion: 100, migrationStatus: 'Completed', migrationPhase: '5- Production Migration' },
  { dcLocation: 'DC4 and 5', productId: '10006', productName: 'HR Management System', completion: 55, migrationStatus: 'On Track', migrationPhase: '4- Prod Migration Planning' },
];

// ── Hooks & Helpers ──
function useResponsive() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = width < 576;
  const isTablet = width >= 576 && width < 992;
  const isSmall = width < 768;

  return {
    width,
    isMobile,
    isTablet,
    isSmall,
    chartHeight: isMobile ? 240 : isTablet ? 270 : isSmall ? 285 : 300,
    barSize: isMobile ? 20 : isTablet ? 28 : 36,
    tickSize: isMobile ? 8 : 10,
    comboMargin: isMobile
      ? { top: 16, right: 8, left: -8, bottom: 50 }
      : isSmall
      ? { top: 22, right: 20, left: 0, bottom: 30 }
      : { top: 30, right: 40, left: 10, bottom: 5 },
    lineMargin: isMobile
      ? { top: 16, right: 8, left: -8, bottom: 10 }
      : isSmall
      ? { top: 22, right: 12, left: 0, bottom: 5 }
      : { top: 30, right: 20, left: 10, bottom: 5 },
    xAxisAngle: isMobile ? -40 : isSmall ? -25 : 0,
    xAxisHeight: isMobile ? 60 : isSmall ? 45 : 30,
    showAxisLabels: !isMobile,
    legendSize: isMobile ? 9 : isSmall ? 10 : 11,
    dotSize: isMobile ? 3 : 4,
    activeDotSize: isMobile ? 5 : 6,
  };
}

function useCountUp(target, duration = 1400) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="md-tooltip">
      <div className="md-tooltip-label">{label}</div>
      {payload.map((entry) => (
        <div className="md-tooltip-item" key={entry.name}>
          <span className="md-tooltip-dot" style={{ background: entry.color }} />
          {entry.name}: {entry.name.includes('%') || entry.name.includes('Completion') ? `${entry.value}%` : entry.value}
        </div>
      ))}
    </div>
  );
}

const renderBarLabel = ({ x, y, width, value }) => (
  <text x={x + width / 2} y={y - 6} fill={colors.orange} textAnchor="middle" fontSize={11} fontWeight={700}>
    {value}
  </text>
);

const renderLineLabel = ({ x, y, value }) => (
  <text x={x} y={y - 10} fill={colors.orange} textAnchor="middle" fontSize={11} fontWeight={700}>
    {`${value}%`}
  </text>
);

const chartAnimation = { animationDuration: 1400, animationEasing: 'ease-out' };

const svgProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function MetricIcon({ type }) {
  switch (type) {
    case 'migrate':
      return (
        <svg {...svgProps}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
          <rect x="3" y="3" width="18" height="6" rx="1" />
        </svg>
      );
    case 'cloud':
      return (
        <svg {...svgProps}>
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          <path d="M12 14v4" />
          <path d="M10 16h4" />
        </svg>
      );
    case 'idle':
      return (
        <svg {...svgProps}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h6v6H9z" />
          <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
        </svg>
      );
    case 'savings':
      return (
        <svg {...svgProps}>
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          <path d="M7 15l-3 3 3 3" />
        </svg>
      );
    case 'analytics':
      return (
        <svg {...svgProps}>
          <path d="M3 3v18h18" />
          <path d="M7 16V9" />
          <path d="M12 16V6" />
          <path d="M17 16v-4" />
        </svg>
      );
    default:
      return null;
  }
}

// ── Components ──
function DashboardHeader() {
  return (
    <div className="md-header">
      <div className="md-header-left">
        <h1>Cloud Migration Dashboard</h1>
        <p>Real-time overview of application migration progress & cloud optimization</p>
      </div>
      <div className="md-live-badge">
        <span className="md-live-dot" />
        Live Data · May 2026
      </div>
    </div>
  );
}

function MetricCard({ card }) {
  const count = useCountUp(card.value);
  return (
    <div className="md-metric-card">
      <div className="md-metric-icon">
        <MetricIcon type={card.icon} />
      </div>
      <p className="md-metric-title">{card.title}</p>
      <h2 className="md-metric-value">{count}{card.suffix}</h2>
    </div>
  );
}

function MetricCards() {
  return (
    <div className="md-metric-cards">
      {metricCards.map((card) => (
        <MetricCard key={card.title} card={card} />
      ))}
    </div>
  );
}

function ComboChartDefs() {
  return (
    <defs>
      <linearGradient id="mdBarGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={colors.orangeLight} />
        <stop offset="100%" stopColor={colors.orange} />
      </linearGradient>
    </defs>
  );
}

function DCLocationChart() {
  const r = useResponsive();
  return (
    <div className="md-chart-box">
      <h3 className="md-chart-title">Migration Status by DC Location</h3>
      <p className="md-chart-subtitle">Apps count vs completion %</p>
      <div className="md-chart-inner">
        <ResponsiveContainer width="100%" height={r.chartHeight}>
          <ComposedChart data={dcLocationData} margin={r.comboMargin}>
            <ComboChartDefs />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2eaf3" />
            <XAxis
              dataKey="location"
              tick={{ fontSize: r.tickSize, fill: '#5a7291' }}
              axisLine={{ stroke: '#c8d9ea' }}
              angle={r.xAxisAngle}
              textAnchor={r.xAxisAngle ? 'end' : 'middle'}
              height={r.xAxisHeight}
              interval={0}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 700]}
              tick={{ fontSize: r.tickSize, fill: '#5a7291' }}
              axisLine={{ stroke: '#c8d9ea' }}
              width={r.isMobile ? 32 : 40}
              label={r.showAxisLabels ? { value: '# Apps', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 10, fill: '#5a7291' } } : undefined}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 120]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: r.tickSize, fill: '#5a7291' }}
              axisLine={{ stroke: '#c8d9ea' }}
              width={r.isMobile ? 36 : 48}
              label={r.showAxisLabels ? { value: '% Completion', angle: 90, position: 'insideRight', offset: 10, style: { fontSize: 10, fill: '#5a7291' } } : undefined}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26,58,107,0.04)' }} />
            <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: r.legendSize, paddingBottom: 6 }} />
            <Bar yAxisId="left" dataKey="apps" name="# Apps" fill="url(#mdBarGrad)" barSize={r.barSize} radius={[6, 6, 0, 0]} {...chartAnimation}>
              {!r.isMobile && <LabelList dataKey="apps" content={renderBarLabel} />}
            </Bar>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="completion"
              name="% Completion"
              stroke={colors.orange}
              strokeWidth={r.isMobile ? 2 : 2.5}
              dot={{ r: r.isMobile ? 3 : 5, fill: colors.orange, stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: r.activeDotSize, fill: colors.orange, stroke: '#fff', strokeWidth: 2 }}
              {...chartAnimation}
            >
              {!r.isMobile && <LabelList dataKey="completion" content={renderLineLabel} />}
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function BUChart() {
  const r = useResponsive();
  return (
    <div className="md-chart-box">
      <h3 className="md-chart-title">Migration Status by BU</h3>
      <p className="md-chart-subtitle">Business unit breakdown</p>
      <div className="md-chart-inner">
        <ResponsiveContainer width="100%" height={r.chartHeight}>
          <ComposedChart data={buData} margin={r.comboMargin}>
            <ComboChartDefs />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2eaf3" />
            <XAxis
              dataKey="bu"
              tick={{ fontSize: r.tickSize, fill: '#5a7291' }}
              axisLine={{ stroke: '#c8d9ea' }}
              angle={r.xAxisAngle}
              textAnchor={r.xAxisAngle ? 'end' : 'middle'}
              height={r.xAxisHeight}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 50]}
              tick={{ fontSize: r.tickSize, fill: '#5a7291' }}
              axisLine={{ stroke: '#c8d9ea' }}
              width={r.isMobile ? 32 : 40}
              label={r.showAxisLabels ? { value: '# Apps', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 10, fill: '#5a7291' } } : undefined}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 120]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: r.tickSize, fill: '#5a7291' }}
              axisLine={{ stroke: '#c8d9ea' }}
              width={r.isMobile ? 36 : 48}
              label={r.showAxisLabels ? { value: '% Completion', angle: 90, position: 'insideRight', offset: 10, style: { fontSize: 10, fill: '#5a7291' } } : undefined}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26,58,107,0.04)' }} />
            <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: r.legendSize, paddingBottom: 6 }} />
            <Bar yAxisId="left" dataKey="apps" name="# Apps" fill="url(#mdBarGrad)" barSize={r.barSize} radius={[6, 6, 0, 0]} {...chartAnimation}>
              {!r.isMobile && <LabelList dataKey="apps" content={renderBarLabel} />}
            </Bar>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="completion"
              name="% Completion"
              stroke={colors.orange}
              strokeWidth={r.isMobile ? 2 : 2.5}
              dot={{ r: r.isMobile ? 3 : 5, fill: colors.orange, stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: r.activeDotSize, fill: colors.orange, stroke: '#fff', strokeWidth: 2 }}
              {...chartAnimation}
            >
              {!r.isMobile && <LabelList dataKey="completion" content={renderLineLabel} />}
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MonthlyProgressChart() {
  const r = useResponsive();
  const lineConfig = [
    { key: 'appMigrated', name: '% APP Migrated', color: colors.line1 },
    { key: 'bfWise', name: 'BF Wise Migration%', color: colors.line2 },
    { key: 'cloudSpend', name: 'Cloud Spent count to Total Growth', color: colors.line3 },
    { key: 'costReduction', name: 'Cloud Cost Reduction', color: colors.line4 },
  ];
  return (
    <div className="md-chart-box">
      <h3 className="md-chart-title">% Monthly Migrated App Progress</h3>
      <p className="md-chart-subtitle">Trend over Jan – Apr 2026</p>
      <div className="md-chart-inner">
        <ResponsiveContainer width="100%" height={r.chartHeight}>
          <LineChart data={monthlyProgressData} margin={r.lineMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2eaf3" />
            <XAxis dataKey="month" tick={{ fontSize: r.tickSize, fill: '#5a7291' }} axisLine={{ stroke: '#c8d9ea' }} />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => (r.isMobile ? `${v}%` : `${v.toFixed(2)}%`)}
              tick={{ fontSize: r.tickSize, fill: '#5a7291' }}
              axisLine={{ stroke: '#c8d9ea' }}
              width={r.isMobile ? 36 : 48}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align={r.isMobile ? 'center' : 'left'}
              wrapperStyle={{ fontSize: r.legendSize, paddingBottom: 6, lineHeight: '16px' }}
            />
            {lineConfig.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={r.isMobile ? 2 : 2.5}
                dot={{ r: r.dotSize, fill: line.color, stroke: '#fff', strokeWidth: 1.5 }}
                activeDot={{ r: r.activeDotSize, fill: line.color, stroke: '#fff', strokeWidth: 2 }}
                {...chartAnimation}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isCompleted = status === 'Completed';
  return (
    <span className={`md-badge ${isCompleted ? 'md-badge-completed' : 'md-badge-on-track'}`}>
      <span className="md-badge-dot" />
      {status}
    </span>
  );
}

function ProgressCell({ value }) {
  const isComplete = value >= 100;
  return (
    <div className="md-progress-cell">
      <div className="md-progress-bar">
        <div
          className={`md-progress-fill ${isComplete ? 'complete' : ''}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="md-progress-text">{value}%</span>
    </div>
  );
}

function MobileTableCard({ row, index }) {
  return (
    <div className="md-mobile-card" style={{ animationDelay: `${0.65 + index * 0.05}s` }}>
      <div className="md-mobile-card-header">
        <div>
          <strong>{row.productName}</strong>
          <div className="md-mobile-card-id">ID: {row.productId}</div>
        </div>
        <StatusBadge status={row.migrationStatus} />
      </div>
      <div className="md-mobile-card-row">
        <span className="md-mobile-card-label">DC Location</span>
        <span className="md-mobile-card-value">{row.dcLocation}</span>
      </div>
      <div className="md-mobile-card-row">
        <span className="md-mobile-card-label">Completion</span>
        <span className="md-mobile-card-value"><ProgressCell value={row.completion} /></span>
      </div>
      {row.migrationPhase && (
        <div className="md-mobile-card-row">
          <span className="md-mobile-card-label">Phase</span>
          <span className="md-mobile-card-value">{row.migrationPhase}</span>
        </div>
      )}
    </div>
  );
}

function MigrationTable() {
  return (
    <>
      <div className="md-table-header">
        <h2>Migration Details</h2>
        <span className="md-table-count">{migrationTableData.length} Applications</span>
      </div>
      <div className="md-table-section">
        <div className="md-table-desktop">
          <div className="md-table-scroll">
            <table className="md-migration-table">
              <thead>
                <tr>
                  <th>DC Location</th>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>% Completion</th>
                  <th>Migration Status</th>
                  <th>Migration Phase</th>
                </tr>
              </thead>
              <tbody>
                {migrationTableData.map((row, index) => (
                  <tr key={`${row.productId}-${index}`}>
                    <td>{row.dcLocation}</td>
                    <td>{row.productId}</td>
                    <td><strong>{row.productName}</strong></td>
                    <td><ProgressCell value={row.completion} /></td>
                    <td><StatusBadge status={row.migrationStatus} /></td>
                    <td>{row.migrationPhase || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="md-table-scroll-hint">← Scroll horizontally to see all columns →</p>
        </div>
        <div className="md-table-mobile">
          {migrationTableData.map((row, index) => (
            <MobileTableCard key={`${row.productId}-m-${index}`} row={row} index={index} />
          ))}
        </div>
      </div>
    </>
  );
}

// ── Main App ──
function App() {
  return (
    <>
      <DashboardStyles />
      <div className="md-root">
        <div className="md-content">
          <DashboardHeader />
          <MetricCards />
          <div className="md-charts-row">
            <DCLocationChart />
            <BUChart />
            <MonthlyProgressChart />
          </div>
          <MigrationTable />
        </div>
      </div>
    </>
  );
}

export default App;
