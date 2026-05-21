import { getStatusVariant } from '../../utils/status';

const StatusPill = ({ status, className = '' }) => (
  <span className={`aep-status-pill ${getStatusVariant(status)}${className ? ` ${className}` : ''}`}>
    {status}
  </span>
);

export default StatusPill;
