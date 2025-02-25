import React, { useState } from 'react';
import CustomTable from '../custom/CustomTable';
import { liveDataHeaders } from '@/lib/column-headers';
import { Button } from '../ui/button';
import { FileX, Filter, Flame } from 'lucide-react';
import { ScanProps } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface LiveData {
  data: ScanProps[];
}

interface LiveDataRow {
  STATUS: ScanProps;
  ID: string;
  NAME: string;
  ACTIVITY: string;
}

export function LiveDataTable({ data}: LiveData) {
  const [selectedData, setSelectedData] = useState<LiveDataRow | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const liveData = data.map((row) => ({
    STATUS: row,
    ID: row.user.user_id ? row.user.user_id : "N/A",
    NAME: row.user.name ? row.user.name : "N/A",
    ACTIVITY: row.tnaKey ? row.tnaKey === "1" ? "IN" : "OUT" : "N/A",
  }));

  const handleRowClick = (row: LiveDataRow) => {
    setSelectedData(row);
    setIsDialogOpen(true);
  };

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

      <CustomTable columns={liveDataHeaders} data={liveData} isLive onRowClick={handleRowClick} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Live Data Details</DialogTitle>
          </DialogHeader>
          {selectedData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p>{selectedData.ID}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p>{selectedData.NAME}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Activity</p>
                  <p>{selectedData.ACTIVITY}</p>
                </div>
              </div>
              {/* <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="flex items-center gap-2">
                  <div 
                    className={`h-2 w-2 rounded-full ${
                      selectedData.STATUS.scanDetail?.status === 'GREEN' 
                        ? 'bg-green-500' 
                        : selectedData.STATUS.scanDetail?.status === 'YELLOW'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <p>{selectedData.STATUS.scanDetail?.status || 'N/A'}</p>
                </div>
              </div> */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
