import React from 'react';
import { mockData } from '@/lib/mock-data';

export function LiveDataTable() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Live Data</h2>
            <p className="text-sm text-muted-foreground">
              Real-Time Entry and Exit Stats
            </p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
              Filter
            </button>
            <button className="rounded-lg border px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
              Clear
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3 text-sm font-medium">AT</th>
              <th className="pb-3 text-sm font-medium">ID</th>
              <th className="pb-3 text-sm font-medium">NAME</th>
              <th className="pb-3 text-sm font-medium">TYPE</th>
              <th className="pb-3 text-sm font-medium">GATE</th>
              <th className="pb-3 text-sm font-medium">ACTIVITY</th>
            </tr>
          </thead>
          <tbody>
            {mockData.liveData.map((row, index) => (
              <tr key={index} className="border-b last:border-0">
                <td className="py-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      row.status === 'allowed'
                        ? 'bg-[#00C853]'
                        : row.status === 'remarks'
                        ? 'bg-[#FFB300]'
                        : 'bg-[#F44336]'
                    }`}
                  />
                </td>
                <td className="py-3 text-sm">{row.id}</td>
                <td className="py-3 text-sm font-medium text-[#1a73e8]">
                  {row.name}
                </td>
                <td className="py-3 text-sm">{row.type}</td>
                <td className="py-3 text-sm">{row.gate}</td>
                <td className="py-3 text-sm">{row.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">1-10 of 97</span>
          <select className="rounded-md border px-2 py-1 text-sm">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border px-3 py-1 text-sm" disabled>
            {'<'}
          </button>
          <span className="text-sm">1/10</span>
          <button className="rounded-md border px-3 py-1 text-sm">{'>'}</button>
        </div>
      </div>
    </div>
  );
}
