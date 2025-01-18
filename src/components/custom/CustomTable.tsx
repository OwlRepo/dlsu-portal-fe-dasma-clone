import React from 'react';

interface TableProps {
  headers: string[];
  data: Array<Record<string, unknown>>;
}

const CustomTable: React.FC<TableProps> = ({ headers, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            {headers.map((header, index) => (
              <th key={index} className="pb-3 text-sm font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
            >
              {headers.map((header, colIndex) => (
                <td key={colIndex} className="py-3 text-sm">
                  {row[header] as string | number | React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
