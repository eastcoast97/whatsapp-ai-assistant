import React from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

export function Table<T extends { id: string }>({ data, columns, onRowClick }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#2a2a3e]">
        <thead className="bg-[#0a0a0f]">
          <tr>
            {columns.map(col => (
              <th
                key={String(col.key)}
                className="px-6 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[#12121a] divide-y divide-[#2a2a3e]">
          {data.map(item => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'cursor-pointer hover:bg-[#1a1a2e] transition-colors' : ''}
            >
              {columns.map(col => (
                <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap text-sm text-[#e2e8f0]">
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key as string] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-[#71717a]">No data available</div>
      )}
    </div>
  );
}
