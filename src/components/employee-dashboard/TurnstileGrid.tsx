import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStudentEntries, type StudentEntry } from '../../lib/dummyData';
import Image from 'next/image';

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
              <CardTitle>Turnstile {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Image
                  src={entry.imageUrl}
                  alt={entry.name}
                  width={80} // Specify the width
                  height={80} // Specify the height
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">ID: {entry.id}</p>
                  <p className="text-sm">Name: {entry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Time: {entry.timestamp}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
