import { useState, useMemo } from 'react';
import TealiumLayout from '../../components/tealium/TealiumLayout';
import MiniSparkline from '../../components/charts/MiniSparkline';
import KpiGrid from '../../components/aep/KpiGrid';
import EmptyState from '../../components/aep/EmptyState';
import { tealiumSources } from '../../data/platformData';
import {
  supplyChainFlowSteps, landingZones, publishConnectors,
} from '../../data/tealiumData';
import {
  tealiumProducts, tealiumTimeRanges,
  TEALIUM_PRODUCT_OPTIONS, TEALIUM_TIME_OPTIONS,
  scaleVolume, scaleFlowNumber,
} from '../../data/dropdownData';

const DataSupplyChainPage = () => {
  const [product, setProduct] = useState('all');
  const [timeRange, setTimeRange] = useState('1h');

  const productConfig = tealiumProducts[product];
  const timeConfig = tealiumTimeRanges[timeRange];
  const scale = timeConfig.scale;

  const filteredSources = useMemo(
    () => tealiumSources.filter(productConfig.sourceFilter),
    [productConfig],
  );

  const summary = productConfig.summary;
  const flow = productConfig.flow;

  const flowValues = {
    sources: flow.sources,
    received: scaleFlowNumber(flow.received, scale),
    transformed: scaleFlowNumber(flow.transformed || flow.received, scale * 0.98),
    standardized: scaleFlowNumber(flow.standardized || flow.received, scale * 0.95),
    published: flow.published || flow.actions,
  };

  return (
    <TealiumLayout>
      <div className="tealium-page-hero stagger-1">
        <div>
          <div className="tealium-breadcrumb">Data Supply Chain &gt; <span>Pipeline overview</span></div>
          <h1 className="tealium-page-title">End-to-end data supply chain</h1>
          <p className="tealium-page-subtitle">
            Monitor ingestion, transformation, and standardization across batch and streaming pipelines.
          </p>
        </div>
      </div>

      <KpiGrid
        variant="summary"
        items={[
          { value: summary.success, label: 'Pipeline success' },
          { value: scaleFlowNumber(summary.events, scale), label: `Records (${timeConfig.label})` },
          { value: String(summary.connectors), label: 'Publish connectors' },
          { value: String(summary.jobs), label: 'Running jobs' },
        ]}
        className="aep-data-transition stagger-2"
        key={`summary-${product}-${timeRange}`}
      />

      <div className="tealium-page-header stagger-2">
        <div className="tealium-filters">
          {TEALIUM_PRODUCT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`tealium-pill${product === opt.id ? ' active' : ''}`}
              onClick={() => setProduct(opt.id)}
            >
              {opt.label}
            </button>
          ))}
          <select
            className="tealium-time-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            aria-label="Time range"
          >
            {TEALIUM_TIME_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="tealium-flow tealium-pipeline-flow aep-data-transition stagger-3" key={`flow-${product}-${timeRange}`}>
        {supplyChainFlowSteps.map((step, index) => (
          <div key={step.key} className="tealium-flow-item-wrap">
            <div className="tealium-flow-step">
              <div className="tealium-flow-icon">{step.icon}</div>
              <div className="tealium-flow-label">{step.label}</div>
              <div className="tealium-flow-value">{flowValues[step.key]}</div>
            </div>
            {index < supplyChainFlowSteps.length - 1 && (
              <div className="tealium-flow-arrow" aria-hidden>→</div>
            )}
          </div>
        ))}
      </div>

      <div className="tealium-quality-bar aep-data-transition stagger-4" key={`quality-${product}-${timeRange}`}>
        <span className="tealium-quality-label">Validation breakdown</span>
        <div className="tealium-inspected">
          <span className="green">{Math.round(flow.inspected.green * scale)} passed</span>
          <span className="yellow">{Math.round(flow.inspected.yellow * scale)} warnings</span>
          <span className="red">{scale === 1 ? flow.inspected.red : scaleFlowNumber(String(flow.inspected.red), scale)} failed</span>
        </div>
      </div>

      <div className="tealium-tables aep-data-transition stagger-5" key={`tables-${product}-${timeRange}`}>
        <div className="tealium-table-card">
          <div className="tealium-table-header">Ingestion sources · {productConfig.label}</div>
          <div className="tealium-table-subheader">
            <span>Source</span>
            <span>Volume · Trend</span>
          </div>
          <div className="tealium-table-body">
            {filteredSources.length === 0 ? (
              <EmptyState message="No sources for this filter" hint="Try All Pipelines or another time range." icon="🔍" />
            ) : filteredSources.map((src, i) => (
              <div key={src.name} className="tealium-table-row" style={{ '--row-index': i }}>
                <div className="tealium-row-name">
                  <span className="tealium-row-icon">{src.icon}</span>
                  <span className="tealium-row-text">{src.name}</span>
                </div>
                <div className="tealium-row-metrics">
                  <MiniSparkline data={src.sparkline} />
                  <span className="tealium-volume">{scaleVolume(src.volume, scale)}</span>
                  <span className={`tealium-trend${src.trend.startsWith('+') ? ' up' : ' down'}`}>{src.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tealium-table-card">
          <div className="tealium-table-header">Publish destinations</div>
          <div className="tealium-section-title">Landing zones</div>
          <div className="tealium-table-body">
            {landingZones.map((item, i) => (
              <div key={item.name} className="tealium-table-row" style={{ '--row-index': i }}>
                <div className="tealium-row-name">
                  <span className="tealium-row-icon">💾</span>
                  <div>
                    <div className="tealium-row-text">{item.name}</div>
                    {item.detail && <div className="tealium-row-detail">{item.detail}</div>}
                  </div>
                </div>
                <div className="tealium-row-metrics tealium-row-metrics-end">
                  <span className="tealium-status-enabled">{item.status}</span>
                  <span className="tealium-volume">{scaleVolume(item.volume, scale)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="tealium-section-title">Publish connectors</div>
          <div className="tealium-connector-header">
            <span>Connector</span>
            <span className="tealium-dot-green">Success</span>
            <span className="tealium-dot-red">Failed</span>
          </div>
          <div className="tealium-table-body">
            {publishConnectors.map((c, i) => (
              <div key={c.name} className="tealium-connector-row" style={{ '--row-index': i }}>
                <div className="tealium-row-name">
                  <span className="tealium-row-icon">{c.icon}</span>
                  <span className="tealium-row-text">{c.name}</span>
                </div>
                <span className="tealium-connector-stat">{scaleFlowNumber(c.success, scale)}</span>
                <span className="tealium-connector-stat tealium-connector-fail">{scaleFlowNumber(c.failed, scale)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TealiumLayout>
  );
};

export default DataSupplyChainPage;
