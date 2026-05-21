const EmptyState = ({ message = 'No records found', hint, icon = '📭' }) => (
  <div className="aep-empty-state">
    <span className="aep-empty-state-icon" aria-hidden>{icon}</span>
    <p className="aep-empty-state-message">{message}</p>
    {hint && <p className="aep-empty-state-hint">{hint}</p>}
  </div>
);

export default EmptyState;
