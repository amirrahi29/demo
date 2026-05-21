import { Link } from 'react-router-dom';
import StatusPill from './StatusPill';

const RecentPanel = ({ title, viewAllPath, items, renderMeta }) => (
  <div className="aep-recent-col">
    <div className="aep-recent-header">
      <h3>{title}</h3>
      {viewAllPath ? (
        <Link to={viewAllPath} className="aep-card-link">View all</Link>
      ) : (
        <span className="aep-card-link">View all</span>
      )}
    </div>
    {items.map((item, index) => (
      <div key={item.name} className="aep-recent-item" style={{ '--row-index': index }}>
        <span className="aep-item-icon">{item.icon}</span>
        <div className="aep-recent-item-body">
          <span className="aep-recent-name">{item.name}</span>
          <span className="aep-recent-meta">
            {renderMeta ? renderMeta(item) : item.meta}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export { StatusPill };
export default RecentPanel;
