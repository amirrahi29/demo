const AnalyticsWidget = ({
  title,
  action,
  controls,
  children,
  className = '',
}) => (
  <div className={`aep-widget${className ? ` ${className}` : ''}`}>
    {(title || action) && (
      <div className="aep-widget-header">
        {title && <span className="aep-card-title">{title}</span>}
        {action}
      </div>
    )}
    {controls && <div className="aep-widget-controls">{controls}</div>}
    {children}
  </div>
);

export default AnalyticsWidget;
