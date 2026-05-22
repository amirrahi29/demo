import React, { useEffect, useState } from 'react';
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

const CHART_KEYS = ['mttd', 'mtte', 'mttr'];
const CHART_DELAYS = { mttd: 450, mtte: 520, mttr: 590 };

export const TRENDING_CHARTS_STYLES = `
  @keyframes tc-fade-up {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
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
    background: #0000ab;
    flex-shrink: 0;
  }

  .pr-charts-heading p {
    margin: 2px 0 0 11px;
    font-size: 11px;
    color: #667085;
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
    animation: tc-fade-up 0.5s ease both;
    overflow: hidden;
    min-width: 0;
    position: relative;
    isolation: isolate;
    --chart-accent: #0000ab;
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

  .pr-chart-panel:hover::after { opacity: 1; }

  .pr-chart-mttd { --chart-accent: #2563eb; }
  .pr-chart-mtte { --chart-accent: #7c3aed; }
  .pr-chart-mttr { --chart-accent: #0d9488; }

  .pr-stat-row {
    display: flex;
    border-bottom: 1px solid #eaecf0;
    position: relative;
    z-index: 1;
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

  .pr-stat-cell.orange {
    background: #0000ab;
    color: #fff;
    border-right: 1px solid #000080;
  }

  .pr-stat-cell.orange:last-child,
  .pr-stat-cell.gray:last-child { border-right: none; }

  .pr-chart-title {
    text-align: center;
    font-weight: 600;
    font-size: clamp(11px, 1.2vw, 12px);
    padding: 10px 8px 8px;
    border-bottom: 1px solid #f2f4f7;
    color: #344054;
    background: #fff;
    position: relative;
    z-index: 1;
  }

  .pr-chart-panel:hover .pr-chart-title { color: var(--chart-accent); }

  .pr-chart-body {
    padding: 6px 10px 0;
    width: 100%;
    min-height: 220px;
    position: relative;
    z-index: 1;
    background: #fff;
  }

  .pr-chart-legend {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 4px;
    padding: 0 8px 4px;
    font-size: 11px;
    color: #667085;
    background: #fff;
    position: relative;
    z-index: 1;
  }

  .pr-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 6px;
  }

  .pr-legend-line {
    width: 24px;
    height: 2px;
    border-radius: 1px;
  }

  .pr-fytd {
    text-align: center;
    font-weight: 700;
    font-size: clamp(11px, 1.3vw, 14px);
    padding: 8px 8px 12px;
    background: #fff;
    border-top: 1px solid #f9fafb;
    position: relative;
    z-index: 1;
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

  .pr-tooltip-inner { padding: 12px 16px; }

  .pr-tooltip-label {
    font-weight: 700;
    font-size: 12px;
    color: #1d2939;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(16, 24, 40, 0.08);
  }

  .pr-tooltip-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 5px;
    font-size: 11px;
    color: #475467;
  }

  .pr-tooltip-row:first-of-type { margin-top: 0; }

  .pr-tooltip-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .pr-tooltip-name { font-weight: 600; color: #344054; }

  .pr-tooltip-value {
    margin-left: auto;
    font-weight: 800;
    color: #1d2939;
    font-size: 12px;
  }

  @media (max-width: 1400px) {
    .pr-charts-row { gap: 12px; }
  }

  @media (max-width: 1200px) {
    .pr-charts-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .pr-charts-row .pr-chart-panel:last-child { grid-column: 1 / -1; }
  }

  @media (max-width: 992px) {
    .pr-charts-row { grid-template-columns: 1fr; }
    .pr-charts-row .pr-chart-panel:last-child { grid-column: auto; }
    .pr-stat-cell { font-size: 10px; padding: 6px 8px; }
  }

  @media (max-width: 768px) {
    .pr-charts-row { gap: 12px; }
    .pr-chart-body { min-height: 210px; }
    .pr-stat-row { flex-direction: column; }
    .pr-stat-cell { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.15); }
    .pr-stat-cell.gray { border-bottom: 1px solid #d0d5dd; }
    .pr-stat-cell:last-child { border-bottom: none; }
  }

  @media (max-width: 576px) {
    .pr-chart-body { min-height: 200px; }
    .pr-chart-legend { gap: 12px; font-size: 10px; }
  }

  @media (max-width: 480px) {
    .pr-chart-title { font-size: 11px; }
    .pr-fytd { font-size: 12px; }
  }

  @media (hover: none) {
    .pr-chart-panel:hover { transform: none; box-shadow: none; }
  }
`;

function useChartResponsive() {
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

function ChartTooltip({ active, payload, label }) {
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
}

function ChartLegend({ colors }) {
  return (
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
}

function TrendChart({ config, colors, delay = 0, chartKey }) {
  const r = useChartResponsive();

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
}

export default function TrendingCharts({ charts, colors }) {
  return (
    <section className="pr-charts-section">
      <div className="pr-content-inner">
        <div className="pr-charts-heading">
          <div>
            <h2>Trend Analysis</h2>
            <p>Month-over-month resiliency performance vs goals</p>
          </div>
          <span className="pr-charts-tag">FY25 · FY26 · Goal</span>
        </div>
        <div className="pr-charts-row">
          {CHART_KEYS.map((key) => (
            <TrendChart
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
  );
}
