'use client';
import React, { useState } from 'react';
import CustomTable from '../custom/CustomTable';
import { headers } from '@/lib/column-headers';
import { mockData } from '@/lib/mock-data';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Download, Filter } from 'lucide-react';

const ReportsPageContainer = () => {
  const [search, setSearch] = useState<string>('');

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
      <div className="flex items-center justify-between mb-8">
        <div className="w-[500px]">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button className="flex items-center gap-2 text-green-500 bg-white border-[1px] border-green-500 ">
            <Filter />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <Download />
            Export
          </Button>
        </div>
      </div>
      <CustomTable headers={headers} data={data} />
    </div>
  );
};

export default ReportsPageContainer;
