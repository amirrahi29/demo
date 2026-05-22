import React, { useEffect, useState } from 'react';
import productResiliencyData from './data/productResiliencyData.json';
import TrendingCharts, { TRENDING_CHARTS_STYLES } from './TrendingCharts';

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
  @keyframes pr-strip-rise {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes pr-strip-shine {
    0% { transform: translateX(-120%) skewX(-12deg); opacity: 0; }
    40% { opacity: 0.6; }
    100% { transform: translateX(220%) skewX(-12deg); opacity: 0; }
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
    background: linear-gradient(135deg, #0000ab 0%, #000080 100%);
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
    background: #0000ab;
    flex-shrink: 0;
  }

  .pr-metrics-heading-left p {
    margin: 2px 0 0 11px;
    font-size: 11px;
    color: #667085;
    line-height: 1.4;
  }

  .pr-metrics-grid {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .pr-metrics-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    align-items: stretch;
  }

  .pr-metric-card {
    position: relative;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 12px;
    border: 1px solid #eaecf0;
    background: #fff;
    box-shadow: 0 1px 3px rgba(16, 24, 40, 0.05);
    min-height: 148px;
    height: 100%;
    cursor: default;
    animation: pr-strip-rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
    transition:
      background 0.22s ease,
      box-shadow 0.22s ease,
      border-color 0.22s ease,
      transform 0.22s ease;
    --accent: #667085;
    overflow: hidden;
  }

  .pr-metric-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--accent);
    opacity: 0;
    transition: opacity 0.22s ease;
  }

  .pr-metric-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.7) 50%, transparent 70%);
    transform: translateX(-110%);
    pointer-events: none;
    opacity: 0;
  }

  .pr-metric-card:hover {
    background: #fafbfc;
    border-color: color-mix(in srgb, var(--accent) 22%, #eaecf0);
    box-shadow: 0 4px 14px rgba(16, 24, 40, 0.08);
    transform: translateY(-2px);
    z-index: 2;
  }

  .pr-metric-card:hover::before {
    opacity: 1;
  }

  .pr-metric-card:hover::after {
    opacity: 1;
    animation: pr-strip-shine 0.55s ease;
  }

  .pr-metric-card-header {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    min-width: 0;
    position: relative;
    z-index: 1;
  }

  .pr-metric-card-icon {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--accent) 10%, white);
    color: var(--accent);
    flex-shrink: 0;
    border: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
    transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
  }

  .pr-metric-card-icon svg { width: 16px; height: 16px; display: block; }

  .pr-metric-card:hover .pr-metric-card-icon {
    transform: scale(1.08);
    background: color-mix(in srgb, var(--accent) 14%, white);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--accent) 18%, transparent);
  }

  .pr-metric-card-label {
    font-size: 11px;
    font-weight: 600;
    color: #344054;
    line-height: 1.35;
    transition: color 0.25s ease;
  }

  .pr-metric-card:hover .pr-metric-card-label { color: #101828; }

  .pr-metric-card-body {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    justify-content: space-between;
  }

  .pr-metric-card-footer {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 32px;
    justify-content: flex-end;
  }

  .pr-metric-card-value-row {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 8px;
  }

  .pr-metric-card-value {
    font-size: clamp(22px, 2.4vw, 28px);
    font-weight: 700;
    color: #101828;
    letter-spacing: -0.4px;
    line-height: 1;
    transition: color 0.22s ease;
  }

  .pr-metric-card:hover .pr-metric-card-value {
    color: var(--accent);
  }

  .pr-metric-card-sub {
    font-size: 10px;
    font-weight: 600;
    color: #98a2b3;
    transition: color 0.25s ease;
  }

  .pr-metric-card:hover .pr-metric-card-sub { color: #667085; }

  .pr-metric-card-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    background: #ecfdf3;
    color: #027a48;
    border: 1px solid #abefc6;
  }

  .pr-metric-card-badge.warning { background: #fffaeb; color: #b54708; border-color: #fedf89; }
  .pr-metric-card-badge.danger { background: #fef3f2; color: #b42318; border-color: #fecdca; }

  .pr-metric-card-bar {
    height: 4px;
    border-radius: 999px;
    background: #f2f4f7;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  .pr-metric-card-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent) 85%, white);
    transition: width 0.8s ease, background 0.22s ease;
  }

  .pr-metric-card:hover .pr-metric-card-bar-fill {
    background: var(--accent);
  }

  .pr-metric-card-caption {
    font-size: 10px;
    font-weight: 600;
    color: #667085;
    line-height: 1.35;
  }

  .pr-metric-card-threshold-legend {
    font-size: 9px;
    font-weight: 500;
    color: #667085;
    line-height: 1.4;
  }

  .pr-metric-card-value.is-green {
    color: #027a48;
  }

  .pr-metric-card:hover .pr-metric-card-value.is-green {
    color: #027a48;
  }

  .pr-metric-card-trend {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    font-weight: 600;
    line-height: 1.3;
  }

  .pr-metric-card-trend.down { color: #027a48; }
  .pr-metric-card-trend.up { color: #b42318; }

  .pr-metric-card-trend svg {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
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
    color: #0000ab;
    letter-spacing: 1px;
    font-style: italic;
    cursor: default;
  }

  .pr-logo:hover {
    color: #000066;
  }

  @media (max-width: 1400px) {
    .pr-metrics-row { gap: 12px; }
    .pr-metrics-grid { gap: 12px; }
  }

  @media (max-width: 992px) {
    .pr-metrics-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 768px) {
    .pr-content-inner { padding: 0 14px; }
    .pr-header-banner { padding: 16px 0; }
    .pr-metrics-section { padding: 12px 0 10px; }
    .pr-metrics-row { gap: 10px; }
    .pr-metrics-grid { gap: 10px; }
    .pr-metric-card { min-height: 136px; padding: 12px 14px; }
    .pr-footer { flex-direction: column; text-align: center; }
    .pr-footer .pr-content-inner { flex-direction: column; text-align: center; }
    .pr-footer-note { justify-content: center; }
  }

  @media (max-width: 576px) {
    .pr-metrics-row { grid-template-columns: 1fr; }
    .pr-metric-card-value { font-size: 22px; }
  }

  @media (max-width: 480px) {
    .pr-content-inner { padding: 0 10px; }
    .pr-header-left h1 { font-size: 14px; }
  }

  @media (hover: none) {
    .pr-metric-card:hover {
      background: inherit;
      box-shadow: none;
      transform: none;
    }
    .pr-metric-card:hover::before { opacity: inherit; }
    .pr-metric-card:hover::after { animation: none; opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
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
    case 'compliance':
      return (
        <svg {...svgProps}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case 'incidents':
      return (
        <svg {...svgProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      );
    default:
      return null;
  }
}

function MetricCardShell({ children, accent, delay = 0, title = '' }) {
  return (
    <div
      className="pr-metric-card"
      style={{ '--accent': accent, animationDelay: `${delay}ms` }}
      title={title || undefined}
    >
      {children}
    </div>
  );
}

function AvailabilityCard({ card, delay }) {
  const count = useCountUp(card.value, 1200, card.decimals || 0);
  const displayValue = `${count}${card.suffix || ''}`;

  return (
    <MetricCardShell accent={card.accent} delay={delay} title={card.description || card.title}>
      <div className="pr-metric-card-header">
        <div className="pr-metric-card-icon">
          <MetricIcon type={card.icon} />
        </div>
        <span className="pr-metric-card-label">{card.title}</span>
      </div>
      <div className="pr-metric-card-body">
        <div className="pr-metric-card-value-row">
          <span
            className={`pr-metric-card-value${card.valueColor ? ' is-green' : ''}`}
            style={card.valueColor ? { color: card.valueColor } : undefined}
          >
            {displayValue}
          </span>
        </div>
        <div className="pr-metric-card-footer">
          {card.thresholdLegend && (
            <span className="pr-metric-card-threshold-legend">{card.thresholdLegend}</span>
          )}
        </div>
      </div>
    </MetricCardShell>
  );
}

function CountCard({ card, delay }) {
  const count = useCountUp(card.value, 900);

  return (
    <MetricCardShell accent={card.accent} delay={delay} title={card.description || card.title}>
      <div className="pr-metric-card-header">
        <div className="pr-metric-card-icon">
          <MetricIcon type={card.icon} />
        </div>
        <span className="pr-metric-card-label">{card.title}</span>
      </div>
      <div className="pr-metric-card-body">
        <div className="pr-metric-card-value-row">
          <span className="pr-metric-card-value">{count}{card.suffix || ''}</span>
        </div>
        <div className="pr-metric-card-footer">
          {card.valueLabel && (
            <span className="pr-metric-card-caption">{card.valueLabel}</span>
          )}
        </div>
      </div>
    </MetricCardShell>
  );
}

function TimeCard({ card, delay }) {
  return (
    <MetricCardShell accent={card.accent} delay={delay} title={card.description || card.title}>
      <div className="pr-metric-card-header">
        <div className="pr-metric-card-icon">
          <MetricIcon type={card.icon} />
        </div>
        <span className="pr-metric-card-label">{card.title}</span>
      </div>
      <div className="pr-metric-card-body">
        <div className="pr-metric-card-value-row">
          <span className="pr-metric-card-value">{card.meanValue}</span>
        </div>
        <div className="pr-metric-card-footer">
          <span className="pr-metric-card-caption">{card.medianLabel}: {card.medianValue}</span>
        </div>
      </div>
    </MetricCardShell>
  );
}

function TrendArrow({ direction }) {
  if (direction === 'down') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function KpiCard({ card, delay }) {
  const count = useCountUp(card.value, 900, card.decimals || 0);
  const displayValue = `${count}${card.suffix || ''}`;

  return (
    <MetricCardShell accent={card.accent} delay={delay} title={card.description || card.title}>
      <div className="pr-metric-card-header">
        <div className="pr-metric-card-icon">
          <MetricIcon type={card.icon} />
        </div>
        <span className="pr-metric-card-label">{card.title}</span>
      </div>
      <div className="pr-metric-card-body">
        <div className="pr-metric-card-value-row">
          <span className="pr-metric-card-value">{displayValue}</span>
        </div>
        <div className="pr-metric-card-footer">
          {card.caption && <span className="pr-metric-card-caption">{card.caption}</span>}
          {card.trend && (
            <span className={`pr-metric-card-trend ${card.trend.direction}`}>
              <TrendArrow direction={card.trend.direction} />
              {card.trend.value} {card.trend.label}
            </span>
          )}
        </div>
      </div>
    </MetricCardShell>
  );
}

function MetricCard({ card, delay }) {
  switch (card.type) {
    case 'availability':
      return <AvailabilityCard card={card} delay={delay} />;
    case 'count':
      return <CountCard card={card} delay={delay} />;
    case 'time':
      return <TimeCard card={card} delay={delay} />;
    case 'kpi':
      return <KpiCard card={card} delay={delay} />;
    default:
      return null;
  }
}

function MonthlyMetricsCards({ cards }) {
  const row1 = cards.slice(0, 4);
  const row2 = cards.slice(4, 8);

  const renderRow = (rowCards, rowOffset) => (
    <div className="pr-metrics-row">
      {rowCards.map((card, index) => (
        <MetricCard key={card.title} card={card} delay={60 + (rowOffset + index) * 40} />
      ))}
    </div>
  );

  return (
    <div className="pr-metrics-grid">
      {renderRow(row1, 0)}
      {renderRow(row2, 4)}
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
              </div>

              <MonthlyMetricsCards cards={metricCards} />
            </div>
          </section>

          <TrendingCharts charts={charts} colors={colors} />
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

const XYZ = () => (
  <>
    <style>{DASHBOARD_STYLES}</style>
    <style>{TRENDING_CHARTS_STYLES}</style>
    <DashboardContent data={productResiliencyData} />
  </>
);

export default XYZ;
