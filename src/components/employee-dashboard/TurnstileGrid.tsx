import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStudentEntries, type StudentEntry } from '../../lib/dummyData';
import Image from 'next/image';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface TurnstileGridProps {
  turnstileCount: number;
}

export default function TurnstileGrid({ turnstileCount }: TurnstileGridProps) {
  const studentEntries = getStudentEntries(turnstileCount);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 flex-grow">
      {Array.from({ length: turnstileCount }).map((_, index) => {
        const entry: StudentEntry = studentEntries[index];
        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle>Turnstile {index + 1} - Gate A</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center space-x-4">
                <Image
                  src={'/test-image-1.png'}
                  alt={entry.name}
                  width={114} // Specify the width
                  height={114} // Specify the height
                  className="w-32 h-32 rounded-full"
                />
                <div className="flex flex-col w-full gap-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm">ID: {entry.id}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: Student
                    </p>
                  </div>

                  <p className="text-2xl font-bold">{entry.name}</p>
                  <p className="text-sm">Time: {entry.timestamp}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea id="remarks" placeholder="Type your message here." />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
