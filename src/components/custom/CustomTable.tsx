'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface PaginatedTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
    cell?: (item: T) => React.ReactNode;
  }[];
  initialItemsPerPage?: number;
}

function CustomTable<T extends Record<string, unknown>>({
  data,
  columns,
  initialItemsPerPage = 10,
}: PaginatedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const roleColors: Record<string, string> = {
    admin: 'bg-green-100 text-green-600',
    employee: 'bg-purple-100 text-purple-600',
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm ">
          <thead>
            <tr className="bg-muted/50 text-slate-800">
              {columns.map((column, index) => (
                <th key={index} className="p-3 text-left font-semibold">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-muted/50'}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="p-3">
                    {column.accessor === 'ROLE' ? (
                      <Badge
                        className={`${
                          roleColors[row[column.accessor] as string]
                        } rounded-lg font-normal hover:${
                          roleColors[row[column.accessor] as string]
                        }`}
                      >
                        {(row[column.accessor] as string).toUpperCase()}
                      </Badge>
                    ) : column.cell ? (
                      column.cell(row)
                    ) : (
                      (row[column.accessor] as React.ReactNode)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min(startIndex + 1, data.length)} to{' '}
          {Math.min(endIndex, data.length)} of {data.length} items
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default CustomTable;
