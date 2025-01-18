import React from 'react';
import { mockData } from '@/lib/mock-data';
import CustomTable from '../custom/CustomTable';
import { headers } from '@/lib/column-headers';

export function LiveDataTable() {
  const data = mockData.liveData.map((row) => ({
    AT: (
      <div
        className={`h-2 w-2 rounded-full ${
          row.status === 'allowed'
            ? 'bg-[#00C853]'
            : row.status === 'remarks'
            ? 'bg-[#FFB300]'
            : 'bg-[#F44336]'
        }`}
      />
    ),
    ID: row.id,
    NAME: row.name,
    TYPE: row.type,
    GATE: row.gate,
    ACTIVITY: row.activity,
  }));

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
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

      <CustomTable headers={headers} data={data} />

      {/* <div className="mt-4 flex items-center justify-between">
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
      </div> */}
    </div>
  );
}
