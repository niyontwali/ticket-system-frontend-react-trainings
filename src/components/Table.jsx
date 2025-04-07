import { Loader2 } from "lucide-react";

const DataTable = ({
  data,
  columns,
  isLoading,
  isError,
  errorMessage = "Error loading data",
  emptyMessage = "No data found"
}) => {
  if (isLoading) {
    return <div className="py-8 flex justify-center space-x-2">
      <Loader2 className="animate-spin" />
      <span>Loading data...</span>
    </div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-600">{errorMessage}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={column.style || {}}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={`${row.id || rowIndex}-${column.key}`}
                  className={column.cellClassName || "px-6 py-4 whitespace-nowrap text-sm text-gray-900"}
                >
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;