const ChartContainer = ({ children, size = 'md', className = '' }) => {
  const sizeClass = {
    sm: 'aep-chart-container--sm',
    md: 'aep-chart-container--md',
    lg: 'aep-chart-container--lg',
  }[size];

  return (
    <div className={`aep-widget-chart aep-chart-container ${sizeClass}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
};

export default ChartContainer;
