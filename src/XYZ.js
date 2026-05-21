import React, { useEffect, useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
  Tooltip,
} from 'recharts';

const DATA_SOURCE = 'json';
const JSON_DATA_URL = `${process.env.PUBLIC_URL}/productResiliencyData.json`;
const API_DATA_URL = '/api/product-resiliency';

const CHART_KEYS = ['mttd', 'mtte', 'mttr'];
const CHART_DELAYS = { mttd: 450, mtte: 520, mttr: 590 };

async function fetchDashboardData() {
  const url = DATA_SOURCE === 'api' ? API_DATA_URL : JSON_DATA_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      DATA_SOURCE === 'api'
        ? `API error: ${response.status} (${API_DATA_URL})`
        : 'Could not load public/productResiliencyData.json'
    );
  }

  const json = await response.json();
  return validateDashboardData(json);
}

function validateDashboardData(data) {
  const missing = [];

  if (!data?.header) missing.push('header');
  if (!data?.colors) missing.push('colors');
  if (!data?.metricsSection) missing.push('metricsSection');
  if (!Array.isArray(data?.metricCards)) missing.push('metricCards');
  if (!data?.charts?.mttd) missing.push('charts.mttd');
  if (!data?.charts?.mtte) missing.push('charts.mtte');
  if (!data?.charts?.mttr) missing.push('charts.mttr');
  if (!data?.footer) missing.push('footer');

  if (missing.length) {
    throw new Error(`Invalid dashboard data. Missing: ${missing.join(', ')}`);
  }

  return data;
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

const DASHBOARD_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { min-height: 100vh; width: 100%; }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #eef1f5;
    overflow-x: hidden;
  }

  @keyframes pr-fade-up {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pr-shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pr-pulse-green {
    0%, 100% { box-shadow: 0 0 0 0 rgba(2, 122, 72, 0.25); }
    50% { box-shadow: 0 0 0 8px rgba(2, 122, 72, 0); }
  }
  @keyframes pr-live-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.4); }
  }
  @keyframes pr-header-glow {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.75; }
  }
  @keyframes pr-tooltip-in {
    from { opacity: 0; transform: translateY(6px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes pr-border-glow {
    0%, 100% { border-color: #e4e7ec; }
    50% { border-color: color-mix(in srgb, #c9542a 40%, #e4e7ec); }
  }
  @keyframes pr-strip-rise {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes pr-strip-shine {
    0% { transform: translateX(-120%) skewX(-12deg); opacity: 0; }
    40% { opacity: 0.6; }
    100% { transform: translateX(220%) skewX(-12deg); opacity: 0; }
  }
  @keyframes pr-bar-glow {
    0%, 100% { box-shadow: 0 0 4px color-mix(in srgb, var(--accent) 30%, transparent); }
    50% { box-shadow: 0 0 10px color-mix(in srgb, var(--accent) 55%, transparent); }
  }
  @keyframes pr-dot-breathe {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.35); opacity: 0.75; }
  }
  @keyframes pr-featured-glow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  @keyframes pr-badge-pop {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.06); }
  }
  @keyframes pr-mesh-drift {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.55; }
    50% { transform: translate(2%, -1%) scale(1.04); opacity: 0.85; }
  }
  @keyframes pr-chart-rise {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes pr-accent-pulse {
    0%, 100% { opacity: 0.75; filter: brightness(1); }
    50% { opacity: 1; filter: brightness(1.15); }
  }
  @keyframes pr-footer-shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  @keyframes pr-loader-orbit {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes pr-title-glow {
    0%, 100% { text-shadow: 0 2px 16px rgba(0,0,0,0.15); }
    50% { text-shadow: 0 2px 24px rgba(0,0,0,0.25), 0 0 40px rgba(255,255,255,0.08); }
  }

  .pr-root {
    min-height: 100vh;
    width: 100%;
    padding: 0;
    font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
    background: #f4f5f7;
    color: #101828;
    position: relative;
    overflow-x: hidden;
  }

  .pr-root::before,
  .pr-root::after {
    display: none;
  }

  .pr-root *, .pr-root *::before, .pr-root *::after { box-sizing: border-box; }

  .pr-shell {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: none;
    min-height: 100vh;
    margin: 0;
    background: #fff;
    border: none;
    border-radius: 0;
    overflow: hidden;
    box-shadow: none;
    animation: pr-fade-up 0.7s ease both;
    display: flex;
    flex-direction: column;
  }

  .pr-header-banner {
    position: relative;
    background: linear-gradient(135deg, #c9542a 0%, #b84a24 100%);
    padding: 16px 0;
    overflow: hidden;
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }

  .pr-header-banner::before,
  .pr-header-banner::after {
    display: none;
  }

  .pr-header-accent {
    display: none;
  }

  .pr-header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    animation: pr-fade-up 0.6s ease both;
  }

  .pr-header-left h1 {
    margin: 0;
    font-size: clamp(15px, 2.2vw, 20px);
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    line-height: 1.3;
  }

  .pr-header-left p {
    margin: 6px 0 0;
    font-size: clamp(11px, 1.4vw, 13px);
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 0.2px;
  }

  .pr-live-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 8px;
    padding: 7px 14px;
    font-size: 11px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    flex-shrink: 0;
    transition: background 0.2s ease;
  }

  .pr-live-badge:hover {
    background: rgba(255, 255, 255, 0.18);
  }

  .pr-live-dot {
    width: 8px;
    height: 8px;
    background: #22c55e;
    border-radius: 50%;
    animation: pr-live-pulse 2s ease infinite;
    box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
    flex-shrink: 0;
  }

  .pr-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .pr-content-inner {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 22px;
  }

  .pr-metrics-section {
    padding: 16px 0 14px;
    border-bottom: 1px solid #eaecf0;
    background: #fff;
    width: 100%;
    position: relative;
  }

  .pr-metrics-section .pr-content-inner {
    padding-top: 0;
    padding-bottom: 0;
  }

  .pr-metrics-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
    flex-wrap: wrap;
    padding-bottom: 8px;
    border-bottom: 1px solid #eef2f6;
    transition: border-color 0.3s ease;
  }

  .pr-metrics-heading:hover { border-color: #e4e7ec; }

  .pr-metrics-heading-left h2 {
    margin: 0;
    font-size: clamp(14px, 1.6vw, 16px);
    font-weight: 600;
    color: #344054;
    letter-spacing: -0.1px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pr-metrics-heading-left h2::before {
    content: '';
    width: 3px;
    height: 14px;
    border-radius: 2px;
    background: #c9542a;
    flex-shrink: 0;
  }

  .pr-metrics-heading-left p {
    margin: 2px 0 0 11px;
    font-size: 11px;
    color: #667085;
    line-height: 1.4;
  }

  .pr-metrics-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 6px;
    background: #f9fafb;
    border: 1px solid #eaecf0;
    font-size: 10px;
    font-weight: 500;
    color: #667085;
    transition: border-color 0.22s ease, background 0.22s ease, color 0.22s ease;
  }

  .pr-metrics-tag:hover {
    border-color: #c9542a;
    background: #fffaf8;
    color: #c9542a;
  }

  .pr-metrics-strip {
    position: relative;
    display: grid;
    grid-template-columns: minmax(160px, 1.3fr) repeat(2, minmax(90px, 0.7fr)) repeat(3, minmax(110px, 1fr));
    border-radius: 10px;
    border: 1px solid #eaecf0;
    background: #fff;
    box-shadow: 0 1px 3px rgba(16, 24, 40, 0.05);
    overflow: hidden;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .pr-metrics-strip:focus-within {
    border-color: #d0d5dd;
    box-shadow: 0 2px 8px rgba(16, 24, 40, 0.06);
  }

  .pr-strip-cell {
    position: relative;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3px;
    border-right: 1px solid #f2f4f7;
    min-height: 60px;
    cursor: default;
    animation: pr-strip-rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
    transition:
      background 0.22s ease,
      box-shadow 0.22s ease;
    --accent: #667085;
    overflow: hidden;
  }

  .pr-strip-cell:first-child { border-radius: 9px 0 0 9px; }
  .pr-strip-cell:last-child { border-right: none; border-radius: 0 9px 9px 0; }

  .pr-strip-cell::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--accent);
    opacity: 0;
    transform: scaleY(0.5);
    transform-origin: center;
    transition: opacity 0.22s ease, transform 0.22s ease;
  }

  .pr-strip-cell::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.7) 50%, transparent 70%);
    transform: translateX(-110%);
    pointer-events: none;
    opacity: 0;
  }

  .pr-strip-cell:hover {
    background: #fafbfc;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 14%, #eaecf0);
    z-index: 2;
  }

  .pr-strip-cell:hover::before {
    opacity: 1;
    transform: scaleY(1);
  }

  .pr-strip-cell:hover::after {
    opacity: 1;
    animation: pr-strip-shine 0.55s ease;
  }

  .pr-strip-cell.featured {
    background: #f6fef9;
    --accent: #027a48;
  }

  .pr-strip-cell.featured::before {
    opacity: 0.7;
    transform: scaleY(1);
  }

  .pr-strip-cell.featured:hover {
    background: #ecfdf3;
    box-shadow: inset 0 0 0 1px rgba(2, 122, 72, 0.18);
  }

  .pr-strip-top {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    position: relative;
    z-index: 1;
  }

  .pr-strip-icon {
    width: 24px;
    height: 24px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--accent) 10%, white);
    color: var(--accent);
    flex-shrink: 0;
    border: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
    transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
  }

  .pr-strip-icon svg { width: 12px; height: 12px; display: block; }

  .pr-strip-cell:hover .pr-strip-icon {
    transform: scale(1.08);
    background: color-mix(in srgb, var(--accent) 14%, white);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--accent) 18%, transparent);
  }

  .pr-strip-label {
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.45px;
    color: #667085;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.25s ease;
  }

  .pr-strip-cell:hover .pr-strip-label { color: #344054; }

  .pr-strip-value-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    padding-left: 30px;
    position: relative;
    z-index: 1;
  }

  .pr-strip-value {
    font-size: 18px;
    font-weight: 700;
    color: #101828;
    letter-spacing: -0.4px;
    line-height: 1;
    transition: color 0.22s ease;
  }

  .pr-strip-cell:hover .pr-strip-value {
    color: var(--accent);
  }

  .pr-strip-cell.featured .pr-strip-value {
    color: #027a48;
    font-size: 20px;
  }

  .pr-strip-cell.featured:hover .pr-strip-value {
    color: #027a48;
  }

  .pr-strip-sub {
    font-size: 9px;
    font-weight: 600;
    color: #98a2b3;
    transition: color 0.25s ease;
  }

  .pr-strip-cell:hover .pr-strip-sub { color: #667085; }

  .pr-strip-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    background: #ecfdf3;
    color: #027a48;
    border: 1px solid #abefc6;
  }

  .pr-strip-badge.warning { background: #fffaeb; color: #b54708; border-color: #fedf89; }
  .pr-strip-badge.danger { background: #fef3f2; color: #b42318; border-color: #fecdca; }

  .pr-strip-thresholds {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-left: 30px;
    margin-top: 1px;
    position: relative;
    z-index: 1;
  }

  .pr-strip-threshold {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 7px;
    font-weight: 600;
    color: #98a2b3;
    text-transform: uppercase;
    letter-spacing: 0.2px;
  }

  .pr-strip-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
    transition: transform 0.22s ease;
  }

  .pr-strip-cell:hover .pr-strip-dot {
    transform: scale(1.2);
  }

  .pr-strip-bar {
    height: 3px;
    border-radius: 999px;
    background: #f2f4f7;
    overflow: hidden;
    margin: 3px 0 0 30px;
    max-width: calc(100% - 30px);
    position: relative;
    z-index: 1;
  }

  .pr-strip-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent) 85%, white);
    transition: width 0.8s ease, background 0.22s ease;
  }

  .pr-strip-cell:hover .pr-strip-bar-fill {
    background: var(--accent);
  }

  .pr-strip-time-row {
    display: flex;
    gap: 6px;
    padding-left: 30px;
    margin-top: 1px;
    position: relative;
    z-index: 1;
  }

  .pr-strip-time-item {
    flex: 1;
    min-width: 0;
    padding: 4px 6px;
    border-radius: 6px;
    background: #f9fafb;
    border: 1px solid #f2f4f7;
    transition: border-color 0.22s ease, background 0.22s ease;
  }

  .pr-strip-time-item.median {
    background: #f9fafb;
    border-color: #eaecf0;
  }

  .pr-strip-cell:hover .pr-strip-time-item {
    border-color: #e4e7ec;
    background: #fff;
  }

  .pr-strip-cell:hover .pr-strip-time-item.median {
    border-color: color-mix(in srgb, var(--accent) 28%, #e4e7ec);
    background: color-mix(in srgb, var(--accent) 5%, white);
  }

  .pr-strip-time-lbl {
    font-size: 7px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #98a2b3;
    margin-bottom: 1px;
  }

  .pr-strip-time-item.median .pr-strip-time-val { color: var(--accent); }

  .pr-strip-time-val {
    font-size: 10px;
    font-weight: 700;
    color: #344054;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.22s ease;
  }

  .pr-strip-cell:hover .pr-strip-threshold { color: #667085; }

  .pr-strip-short {
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.6px;
    color: var(--accent);
    padding-left: 30px;
  }

  .pr-charts-section {
    width: 100%;
    padding: 16px 0 20px;
    background: #f4f5f7;
    flex: 1;
    position: relative;
  }

  .pr-charts-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eaecf0;
  }

  .pr-charts-heading h2 {
    margin: 0;
    font-size: clamp(14px, 1.6vw, 16px);
    font-weight: 600;
    color: #344054;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: -0.1px;
  }

  .pr-charts-heading h2::before {
    content: '';
    width: 3px;
    height: 14px;
    border-radius: 2px;
    background: #c9542a;
    flex-shrink: 0;
  }

  .pr-charts-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 6px;
    background: #fff;
    border: 1px solid #eaecf0;
    font-size: 10px;
    font-weight: 500;
    color: #667085;
  }

  .pr-charts-tag:hover {
    border-color: #d0d5dd;
    color: #475467;
    transform: none;
    box-shadow: none;
  }

  .pr-charts-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    width: 100%;
    align-items: stretch;
  }

  .pr-chart-panel {
    border: 1px solid #eaecf0;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
    transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
    animation: pr-fade-up 0.5s ease both;
    overflow: hidden;
    min-width: 0;
    position: relative;
    isolation: isolate;
    --chart-accent: #c9542a;
    will-change: transform, box-shadow;
  }

  .pr-chart-panel::before {
    display: none;
  }

  .pr-chart-panel::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--chart-accent);
    opacity: 0.45;
    transition: opacity 0.22s ease;
    z-index: 2;
    pointer-events: none;
  }

  .pr-chart-panel:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--chart-accent) 28%, #eaecf0);
    box-shadow:
      0 4px 6px -2px rgba(16, 24, 40, 0.05),
      0 12px 20px -4px rgba(16, 24, 40, 0.08);
    z-index: 2;
  }

  .pr-chart-panel:hover::after {
    opacity: 1;
  }

  .pr-chart-mttd { --chart-accent: #2563eb; }
  .pr-chart-mtte { --chart-accent: #7c3aed; }
  .pr-chart-mttr { --chart-accent: #0d9488; }

  .pr-charts-heading p {
    margin: 2px 0 0 11px;
    font-size: 11px;
    color: #667085;
  }

  .pr-stat-row {
    display: flex;
    border-bottom: 1px solid #eaecf0;
    position: relative;
    z-index: 1;
  }

  .pr-stat-cell.orange:last-child,
  .pr-stat-cell.gray:last-child { border-right: none; }

  .pr-chart-legend {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 4px;
    padding: 0 8px 4px;
    font-size: 11px;
    color: #667085;
    position: relative;
    z-index: 1;
    background: #fff;
  }

  .pr-tooltip-row:hover {
    color: #344054;
  }

  .pr-stat-cell {
    flex: 1;
    padding: 8px 10px;
    font-size: clamp(9px, 1vw, 11px);
    font-weight: 600;
    transition: background 0.2s ease;
  }

  .pr-stat-cell.gray {
    background: #f2f4f7;
    color: #475467;
    border-right: 1px solid #eaecf0;
  }

  .pr-stat-cell.gray:hover {
    background: #eaecf0;
    transform: none;
    box-shadow: none;
  }

  .pr-stat-cell.orange {
    background: #c9542a;
    color: #fff;
    border-right: 1px solid #b84a24;
  }

  .pr-stat-cell.orange::after {
    display: none;
  }

  .pr-stat-cell.orange:hover {
    background: #b84a24;
    transform: none;
    box-shadow: none;
    filter: none;
  }

  .pr-chart-title {
    text-align: center;
    font-weight: 600;
    font-size: clamp(11px, 1.2vw, 12px);
    padding: 10px 8px 8px;
    border-bottom: 1px solid #f2f4f7;
    color: #344054;
    transition: color 0.22s ease;
    position: relative;
    z-index: 1;
    background: #fff;
  }

  .pr-chart-panel:hover .pr-chart-title {
    color: var(--chart-accent);
    letter-spacing: normal;
  }

  .pr-chart-body {
    padding: 6px 10px 0;
    width: 100%;
    min-height: 220px;
    position: relative;
    z-index: 1;
    background: #fff;
  }

  .pr-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background 0.2s ease;
    cursor: default;
  }

  .pr-legend-item:hover {
    background: #f2f4f7;
    color: #344054;
    transform: none;
  }

  .pr-legend-line {
    width: 24px;
    height: 2px;
    border-radius: 1px;
    transition: none;
  }

  .pr-chart-panel:hover .pr-legend-line {
    width: 24px;
    box-shadow: none;
  }

  .pr-fytd {
    text-align: center;
    font-weight: 700;
    font-size: clamp(11px, 1.3vw, 14px);
    padding: 8px 8px 12px;
    position: relative;
    z-index: 1;
    background: #fff;
    border-top: 1px solid #f9fafb;
  }

  .pr-chart-panel:hover .pr-fytd {
    letter-spacing: normal;
    transform: none;
  }

  .pr-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 14px 0 16px;
    font-size: 11px;
    color: #667085;
    background: #fff;
    border-top: 1px solid #eaecf0;
    flex-wrap: wrap;
    margin-top: auto;
    width: 100%;
  }

  .pr-footer::before,
  .pr-footer::after {
    display: none;
  }

  .pr-footer .pr-content-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  .pr-footer-note {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .pr-footer-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 6px;
    background: #f9fafb;
    border: 1px solid #eaecf0;
    font-size: 10px;
    cursor: default;
  }

  .pr-footer-badge::before {
    display: none;
  }

  .pr-footer-badge:hover {
    border-color: #d0d5dd;
    background: #f2f4f7;
    transform: none;
    box-shadow: none;
  }

  .pr-logo {
    font-weight: 800;
    font-size: clamp(16px, 2.2vw, 22px);
    color: #c9542a;
    letter-spacing: 1px;
    font-style: italic;
    cursor: default;
  }

  .pr-logo:hover {
    color: #a84422;
  }

  .pr-tooltip {
    background: #fff !important;
    border: 1px solid #eaecf0 !important;
    border-radius: 8px !important;
    padding: 0 !important;
    box-shadow: 0 8px 24px rgba(16, 24, 40, 0.1) !important;
    font-size: 12px !important;
    overflow: hidden;
    pointer-events: none;
  }

  .pr-tooltip-inner {
    padding: 12px 16px;
  }

  .pr-tooltip-label {
    font-weight: 700;
    font-size: 12px;
    color: #1d2939;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(16, 24, 40, 0.08);
    letter-spacing: 0.2px;
  }

  .pr-tooltip-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 5px;
    font-size: 11px;
    color: #475467;
    transition: transform 0.2s ease;
  }

  .pr-tooltip-row:first-of-type { margin-top: 0; }

  .pr-tooltip-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 0 2px rgba(255,255,255,0.8);
  }

  .pr-tooltip-name {
    font-weight: 600;
    color: #344054;
  }

  .pr-tooltip-value {
    margin-left: auto;
    font-weight: 800;
    color: #1d2939;
    font-size: 12px;
  }

  .pr-mobile-label { display: none; }

  @media (max-width: 1400px) {
    .pr-metrics-strip { grid-template-columns: minmax(140px, 1.2fr) repeat(2, minmax(80px, 0.65fr)) repeat(3, minmax(100px, 0.9fr)); }
    .pr-charts-row { gap: 12px; }
  }

  @media (max-width: 1200px) {
    .pr-metrics-strip {
      grid-template-columns: repeat(3, 1fr);
    }
    .pr-strip-cell.availability { grid-column: span 3; }
    .pr-charts-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .pr-charts-row .pr-chart-panel:last-child { grid-column: 1 / -1; }
  }

  @media (max-width: 992px) {
    .pr-metrics-strip { grid-template-columns: repeat(2, 1fr); }
    .pr-strip-cell.availability { grid-column: span 2; }
    .pr-charts-row { grid-template-columns: 1fr; }
    .pr-charts-row .pr-chart-panel:last-child { grid-column: auto; }
    .pr-stat-cell { font-size: 10px; padding: 6px 8px; }
  }

  @media (max-width: 768px) {
    .pr-content-inner { padding: 0 14px; }
    .pr-header-banner { padding: 16px 0; }
    .pr-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    .pr-live-badge { width: 100%; justify-content: center; white-space: normal; text-align: center; }
    .pr-metrics-section { padding: 12px 0 10px; }
    .pr-metrics-strip { grid-template-columns: 1fr 1fr; }
    .pr-strip-cell.availability { grid-column: span 2; }
    .pr-strip-cell { min-height: 62px; padding: 8px 10px; }
    .pr-charts-row { gap: 12px; }
    .pr-chart-body { min-height: 210px; }
    .pr-stat-row { flex-direction: column; }
    .pr-stat-cell { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.15); }
    .pr-stat-cell.gray { border-bottom: 1px solid #d0d5dd; }
    .pr-stat-cell:last-child { border-bottom: none; }
    .pr-footer { flex-direction: column; text-align: center; }
    .pr-footer .pr-content-inner { flex-direction: column; text-align: center; }
    .pr-footer-note { justify-content: center; }
  }

  @media (max-width: 576px) {
    .pr-metrics-strip { grid-template-columns: 1fr; }
    .pr-strip-cell,
    .pr-strip-cell.availability { grid-column: span 1; }
    .pr-strip-value { font-size: 16px; }
    .pr-chart-body { min-height: 200px; }
    .pr-chart-legend { gap: 12px; font-size: 10px; }
    .pr-metrics-heading { flex-direction: column; align-items: flex-start; }
    .pr-metrics-tag { width: 100%; justify-content: center; }
  }

  @media (max-width: 480px) {
    .pr-content-inner { padding: 0 10px; }
    .pr-header-left h1 { font-size: 14px; }
    .pr-live-badge { font-size: 11px; padding: 7px 12px; }
    .pr-chart-title { font-size: 11px; }
    .pr-fytd { font-size: 12px; }
  }

  @media (hover: hover) {
    .pr-chart-panel:hover { transform: translateY(-2px); }
  }

  @media (hover: none) {
    .pr-strip-cell:hover {
      background: inherit;
      box-shadow: none;
    }
    .pr-strip-cell:hover::before { opacity: inherit; transform: inherit; }
    .pr-strip-cell:hover::after { animation: none; opacity: 0; }
    .pr-strip-cell.featured:hover { background: #f6fef9; }
    .pr-chart-panel:hover { transform: none; box-shadow: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  .pr-state-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(160deg, #f8fafc 0%, #eef2f6 100%);
    padding: 24px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .pr-state-screen::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 30% 40%, rgba(201, 84, 42, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 70% 60%, rgba(29, 78, 216, 0.05) 0%, transparent 50%);
    animation: pr-mesh-drift 12s ease-in-out infinite;
    pointer-events: none;
  }

  .pr-state-card {
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    padding: 40px 36px;
    box-shadow: 0 24px 64px rgba(16, 24, 40, 0.12);
    max-width: 420px;
    width: 100%;
    position: relative;
    z-index: 1;
    animation: pr-chart-rise 0.6s ease both;
  }

  .pr-spinner-wrap {
    position: relative;
    width: 52px;
    height: 52px;
    margin: 0 auto 18px;
  }

  .pr-spinner {
    width: 44px;
    height: 44px;
    border: 3px solid #e4e7ec;
    border-top-color: #c9542a;
    border-radius: 50%;
    animation: pr-spin 0.8s linear infinite;
    position: absolute;
    inset: 4px;
  }

  .pr-spinner-orbit {
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    border-top-color: rgba(201, 84, 42, 0.25);
    border-radius: 50%;
    animation: pr-loader-orbit 1.4s linear infinite reverse;
  }

  .pr-retry-btn {
    margin-top: 16px;
    padding: 10px 22px;
    background: linear-gradient(135deg, #d45a32, #c9542a);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 0.3s ease;
    box-shadow: 0 4px 14px rgba(201, 84, 42, 0.25);
  }

  .pr-retry-btn:hover {
    background: linear-gradient(135deg, #c9542a, #a84422);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(201, 84, 42, 0.35);
  }

  @keyframes pr-spin {
    to { transform: rotate(360deg); }
  }

  .pr-state-title {
    color: #1d2939;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .pr-state-text {
    color: #667085;
    font-size: 13px;
  }
`;

const useCountUp = (target, duration = 1200, decimals = 0) => {
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
};

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
    isMobile,
    isTablet,
    isSmall,
    chartHeight: isMobile ? 200 : isTablet ? 230 : isSmall ? 240 : 260,
    chartMargin: isMobile
      ? { top: 12, right: 6, left: -6, bottom: 4 }
      : isSmall
      ? { top: 16, right: 10, left: -2, bottom: 4 }
      : { top: 18, right: 14, left: 2, bottom: 4 },
    yAxisWidth: isMobile ? 24 : 30,
    tickSize: isMobile ? 8 : 10,
    showLabels: !isMobile,
    xAxisAngle: isMobile ? -35 : 0,
    xAxisHeight: isMobile ? 50 : 30,
    dotSize: isMobile ? 3 : 4,
    activeDotSize: isMobile ? 5 : 6,
    strokeWidth: isMobile ? 2 : 2.5,
  };
}

const createDataLabel = (colors) => ({ x, y, value }) => {
  if (value == null || value === 0) return null;
  return (
    <text x={x} y={y - 8} fill={colors.textDark} fontSize={9} fontWeight={600} textAnchor="middle">
      {Number(value).toFixed(2)}
    </text>
  );
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="pr-tooltip">
      <div className="pr-tooltip-inner">
        <div className="pr-tooltip-label">{label}</div>
        {payload.map((entry) => (
          <div className="pr-tooltip-row" key={entry.dataKey}>
            <span className="pr-tooltip-dot" style={{ background: entry.color }} />
            <span className="pr-tooltip-name">{entry.name}</span>
            <span className="pr-tooltip-value">{Number(entry.value).toFixed(2)} hrs</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChartLegend = ({ colors }) => (
  <div className="pr-chart-legend">
    <div className="pr-legend-item">
      <span className="pr-legend-line" style={{ background: colors.fy25Line }} />
      FY25
    </div>
    <div className="pr-legend-item">
      <span className="pr-legend-line" style={{ background: colors.fy26Line }} />
      FY26
    </div>
    <div className="pr-legend-item">
      <span className="pr-legend-line" style={{ background: colors.goalLine }} />
      Goal
    </div>
  </div>
);

const MetricChart = ({ config, colors, delay = 0, chartKey }) => {
  const r = useResponsive();

  return (
  <div
    className={`pr-chart-panel pr-chart-${chartKey}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="pr-stat-row">
      <div className="pr-stat-cell gray">FY25: {config.headerStats.fy25}</div>
      <div className="pr-stat-cell gray">FY25 (Jul-Mar): {config.headerStats.fy25JulMar}</div>
    </div>
    <div className="pr-stat-row">
      <div className="pr-stat-cell orange">FY26 Goal: {config.headerStats.fy26Goal}</div>
      <div className="pr-stat-cell orange">FY26 Current: {config.headerStats.fy26Current}</div>
    </div>
    <div className="pr-chart-title">{config.title}</div>
    <div className="pr-chart-body">
      <ResponsiveContainer width="100%" height={r.chartHeight}>
        <LineChart data={config.data} margin={r.chartMargin}>
          <CartesianGrid stroke="#e4e7ec" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: r.tickSize, fill: colors.textMuted }}
            axisLine={{ stroke: '#d0d5dd' }}
            tickLine={false}
            angle={r.xAxisAngle}
            textAnchor={r.xAxisAngle ? 'end' : 'middle'}
            height={r.xAxisHeight}
            interval={0}
          />
          <YAxis
            domain={[0, config.yMax]}
            tick={{ fontSize: r.tickSize, fill: colors.textMuted }}
            axisLine={{ stroke: '#d0d5dd' }}
            tickLine={false}
            width={r.yAxisWidth}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: colors.headerOrange, strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.45 }}
            wrapperStyle={{ outline: 'none', zIndex: 20 }}
          />
          <ReferenceLine
            y={config.goal}
            stroke={colors.goalLine}
            strokeWidth={2.5}
            strokeDasharray="6 4"
            label={r.showLabels ? { value: 'Goal', position: 'insideTopRight', fill: colors.goalLine, fontSize: 10 } : undefined}
          />
          <Line
            type="monotone"
            dataKey="fy25"
            name="FY25"
            stroke={colors.fy25Line}
            strokeWidth={r.strokeWidth}
            dot={{ r: r.dotSize, fill: colors.fy25Line, stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: r.activeDotSize, stroke: '#fff', strokeWidth: 2 }}
            animationDuration={1400}
            animationEasing="ease-out"
          >
            {r.showLabels && <LabelList dataKey="fy25" content={createDataLabel(colors)} />}
          </Line>
          <Line
            type="monotone"
            dataKey="fy26"
            name="FY26"
            stroke={colors.fy26Line}
            strokeWidth={r.strokeWidth}
            dot={{ r: r.dotSize, fill: colors.fy26Line, stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: r.activeDotSize, stroke: '#fff', strokeWidth: 2 }}
            animationDuration={1600}
            animationEasing="ease-out"
          >
            {r.showLabels && <LabelList dataKey="fy26" content={createDataLabel(colors)} />}
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
    <ChartLegend colors={colors} />
    <div className="pr-fytd" style={{ color: colors[config.fytdColorKey] }}>
      Fiscal Year to Date: {config.fytdPercent}
    </div>
  </div>
  );
};

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
    case 'shield':
      return (
        <svg {...svgProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'alert':
      return (
        <svg {...svgProps}>
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case 'change':
      return (
        <svg {...svgProps}>
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 16h5v5" />
        </svg>
      );
    case 'detect':
      return (
        <svg {...svgProps}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
          <path d="M11 8v6" />
          <path d="M8 11h6" />
        </svg>
      );
    case 'engage':
      return (
        <svg {...svgProps}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'resolve':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    default:
      return null;
  }
}

function StripCell({ children, accent, className = '', delay = 0, featured = false, title = '' }) {
  return (
    <div
      className={`pr-strip-cell ${featured ? 'featured' : ''} ${className}`}
      style={{ '--accent': accent, animationDelay: `${delay}ms` }}
      title={title || undefined}
    >
      {children}
    </div>
  );
}

function AvailabilityStripCell({ card, delay }) {
  const count = useCountUp(card.value, 1200, card.decimals || 0);
  const displayValue = `${count}${card.suffix || ''}`;

  return (
    <StripCell
      accent={card.accent}
      className="availability"
      delay={delay}
      featured
      title={card.description || card.title}
    >
      <div className="pr-strip-top">
        <div className="pr-strip-icon">
          <MetricIcon type={card.icon} />
        </div>
        <span className="pr-strip-label">{card.title}</span>
      </div>
      <div className="pr-strip-value-row">
        <span className="pr-strip-value">{displayValue}</span>
        {card.badge && (
          <span className={`pr-strip-badge ${card.badgeStatus || 'success'}`}>{card.badge}</span>
        )}
        {card.target && (
          <span className="pr-strip-sub">Goal {card.target}{card.suffix || ''}</span>
        )}
      </div>
      {card.thresholds?.length > 0 && (
        <div className="pr-strip-thresholds">
          {card.thresholds.map((row) => (
            <span key={row.label} className="pr-strip-threshold">
              <span className="pr-strip-dot" style={{ background: row.color }} />
              {row.label.split(' ')[0]}
            </span>
          ))}
        </div>
      )}
    </StripCell>
  );
}

function CountStripCell({ card, delay }) {
  const count = useCountUp(card.value, 900);
  const fillPct = card.max ? Math.min((card.value / card.max) * 100, 100) : 0;

  return (
    <StripCell accent={card.accent} delay={delay} title={card.description || card.title}>
      <div className="pr-strip-top">
        <div className="pr-strip-icon">
          <MetricIcon type={card.icon} />
        </div>
        <span className="pr-strip-label">{card.title}</span>
      </div>
      <div className="pr-strip-value-row">
        <span className="pr-strip-value">{count}{card.suffix || ''}</span>
        {card.badge && (
          <span className={`pr-strip-badge ${card.badgeStatus || 'warning'}`}>{card.badge}</span>
        )}
      </div>
      {card.max > 0 && (
        <div className="pr-strip-bar">
          <div className="pr-strip-bar-fill" style={{ width: `${fillPct}%` }} />
        </div>
      )}
    </StripCell>
  );
}

function TimeStripCell({ card, delay }) {
  return (
    <StripCell accent={card.accent} delay={delay} title={card.description || card.title}>
      <div className="pr-strip-top">
        <div className="pr-strip-icon">
          <MetricIcon type={card.icon} />
        </div>
        <span className="pr-strip-label">{card.shortLabel}</span>
      </div>
      <div className="pr-strip-time-row">
        <div className="pr-strip-time-item">
          <div className="pr-strip-time-lbl">{card.meanLabel}</div>
          <div className="pr-strip-time-val">{card.meanValue}</div>
        </div>
        <div className="pr-strip-time-item median">
          <div className="pr-strip-time-lbl">{card.medianLabel}</div>
          <div className="pr-strip-time-val">{card.medianValue}</div>
        </div>
      </div>
    </StripCell>
  );
}

function MonthlyMetricsBento({ cards }) {
  const availability = cards.find((c) => c.type === 'availability');
  const counts = cards.filter((c) => c.type === 'count');
  const times = cards.filter((c) => c.type === 'time');

  return (
    <div className="pr-metrics-strip">
      {availability && <AvailabilityStripCell card={availability} delay={60} />}
      {counts.map((card, index) => (
        <CountStripCell key={card.title} card={card} delay={100 + index * 40} />
      ))}
      {times.map((card, index) => (
        <TimeStripCell key={card.shortLabel || card.title} card={card} delay={180 + index * 40} />
      ))}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="pr-state-screen">
      <div className="pr-state-card">
        <div className="pr-spinner-wrap">
          <div className="pr-spinner-orbit" />
          <div className="pr-spinner" />
        </div>
        <p className="pr-state-title">Loading Dashboard</p>
        <p className="pr-state-text">
          Loading from {DATA_SOURCE === 'api' ? API_DATA_URL : 'productResiliencyData.json'}...
        </p>
      </div>
    </div>
  );
}

function ErrorScreen({ message, onRetry }) {
  return (
    <div className="pr-state-screen">
      <div className="pr-state-card">
        <p className="pr-state-title">Failed to Load Data</p>
        <p className="pr-state-text">{message}</p>
        <button type="button" className="pr-retry-btn" onClick={onRetry}>Retry</button>
      </div>
    </div>
  );
}

function DashboardContent({ data }) {
  const { header, colors, metricsSection, metricCards, charts, footer } = data;

  return (
    <div className="pr-root">
      <div className="pr-shell">
        <header className="pr-header-banner">
          <div className="pr-content-inner">
            <div className="pr-header">
              <div className="pr-header-left">
                <h1>{header.title}</h1>
                <p>{header.subtitle}</p>
              </div>
              <div className="pr-live-badge">
                <span className="pr-live-dot" />
                {header.liveBadge}
              </div>
            </div>
          </div>
        </header>

        <div className="pr-body">
          <section className="pr-metrics-section">
            <div className="pr-content-inner">
              <div className="pr-metrics-heading">
                <div className="pr-metrics-heading-left">
                  <h2>{metricsSection.title}</h2>
                  <p>{metricsSection.subtitle}</p>
                </div>
                <span className="pr-metrics-tag">
                  <span className="pr-live-dot" style={{ width: 7, height: 7 }} />
                  {metricsSection.liveTag}
                </span>
              </div>

              <MonthlyMetricsBento cards={metricCards} />
            </div>
          </section>

          <section className="pr-charts-section">
            <div className="pr-content-inner">
              <div className="pr-charts-heading">
                <div>
                  <h2>Trend Analysis</h2>
                  <p>Month-over-month resiliency performance vs goals</p>
                </div>
                <span className="pr-charts-tag">
                  <span className="pr-live-dot" style={{ width: 7, height: 7 }} />
                  FY25 · FY26 · Goal
                </span>
              </div>
              <div className="pr-charts-row">
                {CHART_KEYS.map((key) => (
                  <MetricChart
                    key={key}
                    chartKey={key}
                    config={charts[key]}
                    colors={colors}
                    delay={CHART_DELAYS[key]}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>

        <footer className="pr-footer">
          <div className="pr-content-inner">
            <div className="pr-footer-note">
              <span>{footer.note}</span>
              <span className="pr-footer-badge">
                <span style={{ width: 14, height: 3, background: colors.goalLine, borderRadius: 2 }} />
                {footer.goalLabel}
              </span>
              <span className="pr-footer-badge">
                <span style={{ width: 14, height: 3, background: colors.fy26Line, borderRadius: 2 }} />
                {footer.currentLabel}
              </span>
            </div>
            <div className="pr-logo">{footer.brand}</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

const XYZ = () => {
  const { data, loading, error, reload } = useDashboardData();

  return (
    <>
      <style>{DASHBOARD_STYLES}</style>
      {loading && <LoadingScreen />}
      {!loading && error && <ErrorScreen message={error} onRetry={reload} />}
      {!loading && data && <DashboardContent data={data} />}
    </>
  );
};

export default XYZ;
