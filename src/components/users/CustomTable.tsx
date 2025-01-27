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
import {
  ChevronLeft,
  ChevronRight,
  KeyRound,
  PenSquare,
  Trash2,
  User,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { CustomDropdown } from './CustomDropdown';

interface PaginatedTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | string;
    cell?: (item: T) => React.ReactNode;
  }[];
  initialItemsPerPage?: number;
  onView?: (user: T) => void;
  onEdit?: () => void;
  onChangeRole?: () => void;
  onDelete?: () => void;
}

function CustomTable<T extends Record<string, unknown>>({
  data,
  columns,
  initialItemsPerPage = 10,
  onView,
  onEdit,
  onChangeRole,
  onDelete,
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
        <Table className="w-full text-sm ">
          <TableHeader>
            <TableRow className="bg-[#F4F7FCBF] text-slate-800 hover:bg-[#F4F7FCBF]">
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className="p-3 text-left font-semibold text-[#0F416D]"
                >
                  {column.header ? column.header.toUpperCase() : ''}
                </TableHead>
              ))}
              <TableHead className="p-3 text-left font-semibold">
                {/* Empty header for dropdown column */}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={`${
                    rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#F4F7FCBF]'
                  } hover:${
                    rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#F4F7FCBF]'
                  }`}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className="p-3 text-[#0F416D]">
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
                    </TableCell>
                  ))}
                  <TableCell className="p-3">
                    <CustomDropdown
                      actions={[
                        {
                          icon: <User className="h-4 w-4 text-gray-500" />,
                          label: 'View Profile',
                          onClick: () => onView && onView(row),
                        },
                        {
                          icon: <PenSquare className="h-4 w-4 text-gray-500" />,
                          label: 'Edit Details',
                          onClick: () => onEdit,
                        },
                        {
                          icon: <KeyRound className="h-4 w-4 text-gray-500" />,
                          label: 'Change Role',
                          onClick: () => onChangeRole,
                        },
                        {
                          icon: <Trash2 className="h-4 w-4 text-gray-500" />,
                          label: 'Delete User',
                          onClick: () => onDelete,
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="p-3 text-center text-[#0F416D]"
                >
                  No user found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium text-muted-foreground">
          {Math.min(startIndex + 1, data.length)}-
          {Math.min(endIndex, data.length)} of {data.length}
        </div>
        <div className="flex items-center space-x-2">
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
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft />
          </Button>
          <span className="text-sm">
            {currentPage}/{totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CustomTable;
