import { Dashboard } from './dashboard';

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <Dashboard />
      </div>
    </div>
  );
}
