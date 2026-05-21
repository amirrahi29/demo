import EmptyState from './EmptyState';
import StatusPill from './StatusPill';

const defaultColumns = [
  { key: 'name', label: 'Name', cellClass: 'aep-recent-name' },
  { key: 'status', label: 'Status', render: (row) => <StatusPill status={row.status} /> },
  { key: 'owner', label: 'Details' },
  { key: 'updated', label: 'Updated', cellClass: 'aep-recent-meta' },
];

const DataTable = ({
  columns = defaultColumns,
  rows = [],
  emptyMessage = 'No records found',
  emptyHint,
  rowKey = 'name',
  scroll = true,
  className = '',
  rowClassName = 'aep-section-table-row',
  headerClassName = 'aep-section-table-header',
}) => {
  if (!rows.length) {
    return <EmptyState message={emptyMessage} hint={emptyHint} />;
  }

  const table = (
    <div className={`aep-data-table aep-section-table${className ? ` ${className}` : ''}`}>
      <div className={`aep-data-table-header ${headerClassName}`}>
        {columns.map((col) => (
          <span key={col.key}>{col.label}</span>
        ))}
      </div>
      {rows.map((row, index) => (
        <div
          key={row[rowKey] ?? row.name}
          className={`aep-data-table-row ${rowClassName}`}
          style={{ '--row-index': index }}
        >
          {columns.map((col) => (
            <span key={col.key} className={col.cellClass || ''}>
              {col.render ? col.render(row) : row[col.key]}
            </span>
          ))}
        </div>
      ))}
    </div>
  );

  return scroll ? <div className="aep-table-scroll">{table}</div> : table;
};

export default DataTable;
