import { ClientDashboard } from './client-dashboard';

export default function DashboardPage() {

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <ClientDashboard />
      </div>
    </div>
  );
}
