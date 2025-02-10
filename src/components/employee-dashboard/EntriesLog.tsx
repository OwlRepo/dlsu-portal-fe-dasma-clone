import { ScrollArea } from '@/components/ui/scroll-area';
import { getLogEntries } from '../../lib/dummyData';
import Image from 'next/image';

export default function EntriesLog() {
  const recentLogs = getLogEntries(10);

  return (
    <div className="flex-grow">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Recent Entries
      </h2>
      <div className="w-full max-w-2xl mx-auto">
        <ScrollArea className="h-[calc(100vh-200px)] max-w-lg mx-auto pr-4">
          <div className="space-y-3">
            {recentLogs.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg border-2 p-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={entry.imageUrl || '/placeholder.svg'}
                    alt={entry.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-900">{entry.name}</p>
                      <p className="text-sm text-gray-500">ID: {entry.id}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Turnstile: {entry.turnstile}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-500">
                    Remarks: {'No remarks'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
