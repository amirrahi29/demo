import { useState, useEffect, useCallback } from 'react';
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

const DATA_SOURCE = 'json';
const JSON_DATA_URL = `${import.meta.env.BASE_URL}dashboardData.json`;
const API_DATA_URL = '/api/dashboard';

async function fetchDashboardData() {
  const url = DATA_SOURCE === 'api' ? API_DATA_URL : JSON_DATA_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      DATA_SOURCE === 'api'
        ? `API error: ${response.status} (${API_DATA_URL})`
        : 'Could not load public/dashboardData.json'
    );
  }

  const json = await response.json();
  return validateDashboardData(json);
}

function validateDashboardData(data) {
  const missing = [];

  if (!data?.header) missing.push('header');
  if (!data?.colors) missing.push('colors');
  if (!Array.isArray(data?.metricCards)) missing.push('metricCards');
  if (!data?.charts?.dcLocation) missing.push('charts.dcLocation');
  if (!data?.charts?.bu) missing.push('charts.bu');
  if (!data?.charts?.monthlyProgress) missing.push('charts.monthlyProgress');

  if (missing.length) {
    throw new Error(`Invalid dashboard data. Missing: ${missing.join(', ')}`);
  }

  return data;
}

const DASHBOARD_STYLES = `
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
  @keyframes mdPulseRing {
    0%, 100% { box-shadow: 0 0 0 0 rgba(26, 58, 107, 0.22); }
    50%      { box-shadow: 0 0 0 10px rgba(26, 58, 107, 0); }
  }
  @keyframes mdHeaderShimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .md-root {
    min-height: 100vh;
    padding: 24px 16px 40px;
    font-family: 'Segoe UI', system-ui, Arial, Calibri, sans-serif;
    background: linear-gradient(160deg, #f8fafc 0%, #eef2f6 45%, #e8edf4 100%);
    position: relative;
    overflow-x: hidden;
  }

  .md-shell {
    max-width: 1440px;
    margin: 0 auto;
    background: #fff;
    border: 1px solid #e4e7ec;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(16, 24, 40, 0.12);
    animation: mdFadeInUp 0.7s ease both;
  }

  .md-header-banner {
    position: relative;
    background: linear-gradient(135deg, #254d85 0%, #1a3a6b 48%, #0f2847 100%);
    padding: 20px 24px;
    overflow: hidden;
  }
  .md-header-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    background-size: 200% 100%;
    animation: mdHeaderShimmer 4s ease-in-out infinite;
    pointer-events: none;
  }

  .md-body {
    padding: 22px 22px 8px;
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

  .md-header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    animation: mdFadeInUp 0.6s ease both;
  }
  .md-header-left h1 {
    margin: 0;
    font-size: clamp(18px, 2.4vw, 24px);
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.3px;
  }
  .md-header-left p {
    margin: 6px 0 0;
    font-size: clamp(11px, 1.4vw, 13px);
    color: rgba(255, 255, 255, 0.82);
    letter-spacing: 0.2px;
  }
  .md-live-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 999px;
    padding: 9px 18px;
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
    white-space: nowrap;
  }
  .md-live-badge:hover {
    background: rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    transform: translateY(-2px);
  }
  .md-live-dot {
    width: 8px; height: 8px;
    background: #22c55e;
    border-radius: 50%;
    animation: mdPulse 2s ease infinite;
    box-shadow: 0 0 6px rgba(34,197,94,0.6);
  }

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
    font-size: clamp(24px, 3vw, 30px);
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.5px;
    transition: color 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .md-metric-card:hover .md-metric-value {
    color: var(--accent);
    transform: scale(1.05);
  }
  .md-metric-value-ring {
    display: inline-flex;
    border-radius: 12px;
    padding: 2px 0;
  }
  .md-metric-card:nth-child(1) .md-metric-value-ring {
    animation: mdPulseRing 2.6s ease infinite;
  }

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
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(26, 58, 107, 0.14);
    border-color: rgba(26, 58, 107, 0.28);
    z-index: 2;
  }
  .md-chart-box:hover .md-chart-title {
    color: #0f2847;
    letter-spacing: 0.4px;
  }
  .md-chart-title {
    color: #1a3a6b;
    font-size: 13px;
    font-weight: 700;
    margin: 0 0 8px;
    text-align: center;
    letter-spacing: 0.2px;
    transition: color 0.3s ease, letter-spacing 0.3s ease;
  }
  .md-chart-subtitle {
    text-align: center;
    font-size: 11px;
    color: #8fa3bb;
    margin: -4px 0 8px;
  }

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

  .md-chart-inner {
    width: 100%;
    min-height: 240px;
  }

  .md-chart-legend {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 14px 18px;
    margin-top: 8px;
    padding: 0 6px 4px;
    font-size: 11px;
    color: #475467;
  }
  .md-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 0.25s ease;
  }
  .md-legend-line {
    width: 26px;
    height: 3px;
    border-radius: 2px;
    transition: width 0.25s ease;
  }
  .md-legend-bar {
    width: 14px;
    height: 14px;
    border-radius: 4px 4px 0 0;
    transition: transform 0.25s ease;
  }
  .md-chart-box:hover .md-legend-line { width: 34px; }
  .md-chart-box:hover .md-legend-bar { transform: scaleY(1.12); }

  .md-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 14px 22px 18px;
    font-size: 11px;
    color: #667085;
    background: linear-gradient(180deg, #fafbfc 0%, #f2f4f7 100%);
    border-top: 1px solid #e4e7ec;
    flex-wrap: wrap;
  }
  .md-footer-note {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .md-footer-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    background: #fff;
    border: 1px solid #e4e7ec;
    font-size: 10px;
    transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
  }
  .md-footer-badge:hover {
    border-color: #1a3a6b;
    box-shadow: 0 4px 12px rgba(26, 58, 107, 0.12);
    transform: translateY(-1px);
  }
  .md-footer-brand {
    font-weight: 900;
    font-size: clamp(16px, 2.2vw, 22px);
    color: #1a3a6b;
    letter-spacing: 2px;
    font-style: italic;
    transition: transform 0.3s ease, color 0.3s ease;
    cursor: default;
  }
  .md-footer-brand:hover {
    transform: scale(1.06);
    color: #0f2847;
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
  }

  @media (max-width: 768px) {
    .md-root { padding: 12px 8px 24px; }
    .md-shell { border-radius: 12px; }
    .md-header-banner { padding: 16px 16px; }
    .md-body { padding: 16px 14px 6px; }
    .md-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    .md-header-left h1 { font-size: 18px; }
    .md-header-left p { font-size: 12px; line-height: 1.5; }
    .md-live-badge { width: 100%; justify-content: center; white-space: normal; text-align: center; }
    .md-footer { flex-direction: column; text-align: center; }
    .md-footer-note { justify-content: center; }
    .md-metric-card { min-height: 90px; padding: 16px 14px; }
    .md-metric-value { font-size: 26px; }
    .md-metric-title { font-size: 10.5px; }
    .md-chart-box { padding: 12px 8px 6px; }
    .md-chart-title { font-size: 12px; }
    .md-chart-subtitle { font-size: 10px; }
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
  }

  @media (hover: hover) {
    .md-metric-card:hover { transform: translateY(-6px); }
    .md-chart-box:hover { transform: translateY(-4px); }
    .md-live-badge:hover { transform: translateY(-1px); }
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

  .md-state-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(160deg, #f8fafc 0%, #eef2f6 100%);
    padding: 24px;
    text-align: center;
    animation: mdFadeIn 0.5s ease both;
  }
  .md-state-card {
    background: #fff;
    border: 1px solid #e4e7ec;
    border-radius: 16px;
    padding: 36px 32px;
    box-shadow: 0 20px 60px rgba(16, 24, 40, 0.1);
    max-width: 420px;
    width: 100%;
    animation: mdScaleIn 0.6s ease both;
  }
  .md-spinner {
    width: 44px;
    height: 44px;
    border: 3px solid #c8d9ea;
    border-top-color: #1a3a6b;
    border-radius: 50%;
    animation: mdSpin 0.8s linear infinite;
    margin-bottom: 16px;
  }
  @keyframes mdSpin {
    to { transform: rotate(360deg); }
  }
  .md-state-title {
    color: #1a3a6b;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 6px;
  }
  .md-state-text {
    color: #5a7291;
    font-size: 13px;
  }
  .md-retry-btn {
    margin-top: 16px;
    padding: 10px 20px;
    background: #1a3a6b;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .md-retry-btn:hover {
    background: #254d85;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(26, 58, 107, 0.25);
  }
`;

function DashboardStyles() {
  return <style>{DASHBOARD_STYLES}</style>;
}

function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);

    fetchDashboardData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, reload: loadData };
}

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

function useCountUp(target, duration = 1400, decimals = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = null;
    let frame;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return decimals > 0 ? value.toFixed(decimals) : Math.round(value);
}

function ComboChartLegend({ colors }) {
  return (
    <div className="md-chart-legend">
      <div className="md-legend-item">
        <span className="md-legend-bar" style={{ background: `linear-gradient(180deg, ${colors.orangeLight}, ${colors.orange})` }} />
        # Apps
      </div>
      <div className="md-legend-item">
        <span className="md-legend-line" style={{ background: colors.orange }} />
        % Completion
      </div>
    </div>
  );
}

function LineChartLegend({ lines, colors }) {
  return (
    <div className="md-chart-legend">
      {lines.map((line) => (
        <div className="md-legend-item" key={line.key}>
          <span className="md-legend-line" style={{ background: colors[line.colorKey] }} />
          {line.name}
        </div>
      ))}
    </div>
  );
}

function DashboardFooter({ colors }) {
  return (
    <footer className="md-footer">
      <div className="md-footer-note">
        <span>Interactive charts · Hover for detailed metrics</span>
        <span className="md-footer-badge">
          <span className="md-legend-bar" style={{ background: `linear-gradient(180deg, ${colors.orangeLight}, ${colors.orange})` }} />
          Apps Count
        </span>
        <span className="md-footer-badge">
          <span className="md-legend-line" style={{ background: colors.orange }} />
          Completion %
        </span>
      </div>
      <div className="md-footer-brand">CLOUD</div>
    </footer>
  );
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

const createBarLabel = (color) => ({ x, y, width, value }) => (
  <text x={x + width / 2} y={y - 6} fill={color} textAnchor="middle" fontSize={11} fontWeight={700}>
    {value}
  </text>
);

const createLineLabel = (color) => ({ x, y, value }) => (
  <text x={x} y={y - 10} fill={color} textAnchor="middle" fontSize={11} fontWeight={700}>
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

function LoadingScreen() {
  return (
    <div className="md-state-screen">
      <div className="md-state-card">
        <div className="md-spinner" />
        <p className="md-state-title">Loading Dashboard</p>
        <p className="md-state-text">Loading from {DATA_SOURCE === 'api' ? API_DATA_URL : 'dashboardData.json'}...</p>
      </div>
    </div>
  );
}

function ErrorScreen({ message, onRetry }) {
  return (
    <div className="md-state-screen">
      <div className="md-state-card">
        <p className="md-state-title">Failed to Load Data</p>
        <p className="md-state-text">{message}</p>
        <button type="button" className="md-retry-btn" onClick={onRetry}>Retry</button>
      </div>
    </div>
  );
}

function DashboardHeader({ header }) {
  return (
    <div className="md-header">
      <div className="md-header-left">
        <h1>{header.title}</h1>
        <p>{header.subtitle}</p>
      </div>
      <div className="md-live-badge">
        <span className="md-live-dot" />
        {header.liveBadge}
      </div>
    </div>
  );
}

function MetricCard({ card, index }) {
  const count = useCountUp(card.value, 1200 + index * 80);
  return (
    <div className="md-metric-card" style={{ animationDelay: `${0.05 + index * 0.06}s` }}>
      <div className="md-metric-icon">
        <MetricIcon type={card.icon} />
      </div>
      <p className="md-metric-title">{card.title}</p>
      <h2 className="md-metric-value">
        <span className="md-metric-value-ring">{count}{card.suffix}</span>
      </h2>
    </div>
  );
}

function MetricCards({ cards }) {
  return (
    <div className="md-metric-cards">
      {cards.map((card, index) => (
        <MetricCard key={card.title} card={card} index={index} />
      ))}
    </div>
  );
}

function ComboChartDefs({ colors, gradientId }) {
  return (
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={colors.orangeLight} />
        <stop offset="100%" stopColor={colors.orange} />
      </linearGradient>
    </defs>
  );
}

function ComboChartCard({ config, colors }) {
  const r = useResponsive();
  const barLabelRenderer = createBarLabel(colors.orange);
  const lineLabelRenderer = createLineLabel(colors.orange);
  const gradientId = `mdBarGrad-${config.xKey}`;

  return (
    <div className="md-chart-box">
      <h3 className="md-chart-title">{config.title}</h3>
      <p className="md-chart-subtitle">{config.subtitle}</p>
      <div className="md-chart-inner">
        <ResponsiveContainer width="100%" height={r.chartHeight}>
          <ComposedChart data={config.data} margin={r.comboMargin}>
            <ComboChartDefs colors={colors} gradientId={gradientId} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2eaf3" />
            <XAxis
              dataKey={config.xKey}
              tick={{ fontSize: r.tickSize, fill: '#5a7291' }}
              axisLine={{ stroke: '#c8d9ea' }}
              angle={r.xAxisAngle}
              textAnchor={r.xAxisAngle ? 'end' : 'middle'}
              height={r.xAxisHeight}
              interval={0}
            />
            <YAxis
              yAxisId="left"
              domain={config.yAxisLeft.domain}
              tick={{ fontSize: r.tickSize, fill: '#5a7291' }}
              axisLine={{ stroke: '#c8d9ea' }}
              width={r.isMobile ? 32 : 40}
              label={r.showAxisLabels ? { value: config.yAxisLeft.label, angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 10, fill: '#5a7291' } } : undefined}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={config.yAxisRight.domain}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: r.tickSize, fill: '#5a7291' }}
              axisLine={{ stroke: '#c8d9ea' }}
              width={r.isMobile ? 36 : 48}
              label={r.showAxisLabels ? { value: config.yAxisRight.label, angle: 90, position: 'insideRight', offset: 10, style: { fontSize: 10, fill: '#5a7291' } } : undefined}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#1a3a6b', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: r.legendSize, paddingBottom: 6 }} />
            <Bar yAxisId="left" dataKey={config.barKey} name={config.barLabel} fill={`url(#${gradientId})`} barSize={r.barSize} radius={[6, 6, 0, 0]} {...chartAnimation}>
              {!r.isMobile && <LabelList dataKey={config.barKey} content={barLabelRenderer} />}
            </Bar>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey={config.lineKey}
              name={config.lineLabel}
              stroke={colors.orange}
              strokeWidth={r.isMobile ? 2 : 2.5}
              dot={{ r: r.isMobile ? 3 : 5, fill: colors.orange, stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: r.activeDotSize, fill: colors.orange, stroke: '#fff', strokeWidth: 2 }}
              {...chartAnimation}
            >
              {!r.isMobile && <LabelList dataKey={config.lineKey} content={lineLabelRenderer} />}
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <ComboChartLegend colors={colors} />
    </div>
  );
}

function MonthlyProgressChart({ config, colors }) {
  const r = useResponsive();
  const lineConfig = config.lines.map((line) => ({
    ...line,
    color: colors[line.colorKey],
  }));

  return (
    <div className="md-chart-box">
      <h3 className="md-chart-title">{config.title}</h3>
      <p className="md-chart-subtitle">{config.subtitle}</p>
      <div className="md-chart-inner">
        <ResponsiveContainer width="100%" height={r.chartHeight}>
          <LineChart data={config.data} margin={r.lineMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2eaf3" />
            <XAxis dataKey="month" tick={{ fontSize: r.tickSize, fill: '#5a7291' }} axisLine={{ stroke: '#c8d9ea' }} />
            <YAxis
              domain={config.yDomain}
              tickFormatter={(v) => (r.isMobile ? `${v}%` : `${v.toFixed(2)}%`)}
              tick={{ fontSize: r.tickSize, fill: '#5a7291' }}
              axisLine={{ stroke: '#c8d9ea' }}
              width={r.isMobile ? 36 : 48}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#1a3a6b', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
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
      <LineChartLegend lines={config.lines} colors={colors} />
    </div>
  );
}

function DashboardContent({ data }) {
  return (
    <div className="md-root">
      <div className="md-shell">
        <div className="md-header-banner">
          <DashboardHeader header={data.header} />
        </div>
        <div className="md-body">
          <MetricCards cards={data.metricCards} />
          <div className="md-charts-row">
            <ComboChartCard config={data.charts.dcLocation} colors={data.colors} />
            <ComboChartCard config={data.charts.bu} colors={data.colors} />
            <MonthlyProgressChart config={data.charts.monthlyProgress} colors={data.colors} />
          </div>
        </div>
        <DashboardFooter colors={data.colors} />
      </div>
    </div>
  );
}

function App() {
  const { data, loading, error, reload } = useDashboardData();

  return (
    <>
      <DashboardStyles />
      {loading && <LoadingScreen />}
      {!loading && error && <ErrorScreen message={error} onRetry={reload} />}
      {!loading && data && <DashboardContent data={data} />}
    </>
  );
}

export default App;
