const VARIANT_CLASS = {
  mini: 'aep-mini-kpi-grid',
  quick: 'aep-quick-stats',
  kpi: 'aep-kpi-row',
  summary: 'tealium-summary-row',
};

const KpiGrid = ({ variant = 'mini', items = [], className = '' }) => {
  const gridClass = VARIANT_CLASS[variant] || VARIANT_CLASS.mini;

  if (variant === 'kpi') {
    return (
      <div className={`${gridClass}${className ? ` ${className}` : ''}`}>
        {items.map((item) => (
          <div key={item.label} className="aep-kpi-card">
            <div className="aep-kpi-top">
              <div className="aep-kpi-label">{item.label}</div>
              {item.trend != null && (
                <span className={`aep-kpi-trend${item.trendUp ? ' up' : ' down'}`}>{item.trend}</span>
              )}
            </div>
            <div className="aep-kpi-value">{item.value}</div>
            {item.link && <div className="aep-kpi-link">{item.link}</div>}
            {item.sub && <div className="aep-kpi-sub">{item.sub}</div>}
            {item.meta && <div className="aep-kpi-meta">{item.meta}</div>}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'quick') {
    return (
      <div className={`${gridClass}${className ? ` ${className}` : ''}`}>
        {items.map((item, i) => (
          <div key={item.label} className="aep-quick-stat" style={{ '--stat-index': i }}>
            <span className="aep-quick-stat-icon">{item.icon}</span>
            <div>
              <div className="aep-quick-stat-value">{item.value}</div>
              <div className="aep-quick-stat-label">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'summary') {
    return (
      <div className={`${gridClass}${className ? ` ${className}` : ''}`}>
        {items.map((item, i) => (
          <div key={item.label} className="tealium-summary-card" style={{ '--summary-index': i }}>
            <span className="tealium-summary-value">{item.value}</span>
            <span className="tealium-summary-label">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`${gridClass}${className ? ` ${className}` : ''}`}>
      {items.map((item) => (
        <div key={item.label} className="aep-mini-kpi">
          <div className="aep-mini-kpi-value">{item.value}</div>
          <div className="aep-mini-kpi-label">{item.label}</div>
          {item.change != null && (
            <div className={`aep-kpi-trend${Number(item.change) >= 0 ? ' up' : ' down'}`}>{item.change}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KpiGrid;
