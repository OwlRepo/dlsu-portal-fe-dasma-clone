'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

interface TimePickerProps {
  defaultValue?: string;
  onSave: (time: string) => void;
  onClose: () => void;
}

export function TimePicker({
  defaultValue = '12:00 AM',
  onSave,
  onClose,
}: TimePickerProps) {
  const [hour, setHour] = useState(defaultValue.split(':')[0]);
  const [minute, setMinute] = useState(
    defaultValue.split(':')[1].split(' ')[0],
  );
  const [period, setPeriod] = useState(defaultValue.split(' ')[1]);

  const handleSave = () => {
    onSave(`${hour}:${minute} ${period}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-[300px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Set Time</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-2">
            <Select value={hour} onValueChange={setHour}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) =>
                  (i + 1).toString().padStart(2, '0'),
                ).map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xl">:</span>
            <Select value={minute} onValueChange={setMinute}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 60 }, (_, i) =>
                  i.toString().padStart(2, '0'),
                ).map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={handleSave}
          >
            Save
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
