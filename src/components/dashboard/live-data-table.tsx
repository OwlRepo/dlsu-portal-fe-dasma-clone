import React from 'react';
import CustomTable from '../custom/CustomTable';
import { liveDataHeaders } from '@/lib/column-headers';
import { Button } from '../ui/button';
import { FileX, Filter, Flame } from 'lucide-react';
import { ScanProps } from '@/lib/types';

interface LiveData {
  data: ScanProps[];
}

export function LiveDataTable({ data }: LiveData) {
  const liveData = data.map((row) => ({
    STATUS: row,
    ID: row.user.user_id ? row.user.user_id : "N/A",
    NAME: row.user.name ? row.user.name : "N/A",
    ACTIVITY: "N/A",
  }));


  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Flame />
              <h2 className="text-lg font-medium">Live Data</h2>
            </div>

            <p className="text-base text-muted-foreground">
              Real-Time Entry and Exit Stats
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-green-500 border-green-500 hover:text-green-500 hover:bg-white"
            >
              <Filter />
              Filter
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-2 border"
            >
              <FileX />
              Clear
            </Button>
          </div>
        </div>
      </div>

      <CustomTable columns={liveDataHeaders} data={liveData} isLive />
    </div>
  );
}
