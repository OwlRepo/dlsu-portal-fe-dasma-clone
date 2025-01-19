'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import { ScreenSaverUpload } from './screen-saver-upload';
import { TimePicker } from './time-picker';

export function OperationSettings() {
  const [syncing, setSyncing] = useState(false);
  const [morning, setMorning] = useState('6:00 AM');
  const [evening, setEvening] = useState('6:00 PM');
  const [showTimePicker, setShowTimePicker] = useState<
    'morning' | 'evening' | null
  >(null);

  const handleSync = async () => {
    setSyncing(true);
    // TODO: Implement sync functionality
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSyncing(false);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="max-h-[300px]">
        <CardHeader>
          <CardTitle>Scheduled Syncing</CardTitle>
          <CardDescription>
            Configure automatic synchronization times.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-24">{morning}</div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowTimePicker('morning')}
            >
              Set
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-24">{evening}</div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowTimePicker('evening')}
            >
              Set
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <Button className="w-full" onClick={handleSync} disabled={syncing}>
            {syncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              'Sync Now'
            )}
          </Button>
        </CardContent>
      </Card>

      <ScreenSaverUpload />

      <Card className="">
        <CardHeader>
          <CardTitle className="text-red-600">Delete user</CardTitle>
          <CardDescription>
            Upload a CSV file containing the list of users to be deleted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csv">CSV File</Label>
            <Input id="csv" type="file" accept=".csv" />
          </div>
          <Button
            variant="outline"
            className="w-full max-w-sm border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload CSV file
          </Button>
        </CardContent>
      </Card>

      <Card className="">
        <CardHeader>
          <CardTitle>Test</CardTitle>
          <CardDescription>Test</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4"></CardContent>
      </Card>

      {showTimePicker && (
        <TimePicker
          defaultValue={showTimePicker === 'morning' ? morning : evening}
          onSave={(time) => {
            if (showTimePicker === 'morning') {
              setMorning(time);
            } else {
              setEvening(time);
            }
            setShowTimePicker(null);
          }}
          onClose={() => setShowTimePicker(null)}
        />
      )}
    </div>
  );
}
