// Table component
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

const Table = ({ 
  columns, 
  data, 
  sortable = false, 
  onSort, 
  sortConfig, 
  className = '',
  striped = true,
  hover = true 
}) => {
  const handleSort = (key) => {
    if (sortable && onSort) {
      onSort(key);
    }
  };

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <div className={`overflow-x-auto scrollbar-hide ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                  ${sortable && column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                `}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.title}</span>
                  {sortable && column.sortable && (
                    <span className="text-gray-400">
                      {getSortIcon(column.key)}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`bg-white divide-y divide-gray-200 ${striped ? 'divide-y' : ''}`}>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`
                ${hover ? 'hover:bg-gray-50' : ''} 
                ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                transition-colors duration-200
              `}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
};

export default Table;
