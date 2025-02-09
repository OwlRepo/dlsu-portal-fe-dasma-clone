import { ScrollArea } from '@/components/ui/scroll-area';
import { getLogEntries } from '../../lib/dummyData';
import Image from 'next/image';

export default function EntriesLog() {
  const recentLogs = getLogEntries(50);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recent Entries</h2>
      <div className="bg-background border rounded-lg p-4 w-full lg:w-80 xl:w-96">
        <ScrollArea className="h-[calc(100vh-200px)]">
          {recentLogs.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center space-x-4 py-2 border-b last:border-b-0"
            >
              <Image
                src={entry.imageUrl || '/placeholder.svg'}
                alt={entry.name}
                width={40} // Specify the width
                height={40} // Specify the height
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-grow">
                <p className="text-sm font-medium">
                  {entry.name} (ID: {entry.id})
                </p>
                <p className="text-xs text-muted-foreground">
                  Turnstile: {entry.turnstile}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
