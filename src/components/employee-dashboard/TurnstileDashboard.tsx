'use client';

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
import TurnstileGrid from './TurnstileGrid';
import EntriesLog from './EntriesLog';

export default function TurnstileDashboard() {
  // const [turnstileCount, setTurnstileCount] = useState(6);

  return (
    <div className="space-y-6">
      {/* <div className="flex justify-end">
        <Select
          value={turnstileCount.toString()}
          onValueChange={(value) => setTurnstileCount(Number.parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Number of Turnstiles" />
          </SelectTrigger>
          <SelectContent>
            {[4, 5, 6].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} Turnstiles
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}
      <div className="flex flex-col lg:flex-row gap-6">
        <TurnstileGrid turnstileCount={4} />
        <EntriesLog />
      </div>
    </div>
  );
}
