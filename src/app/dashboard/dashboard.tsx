'use client';

import { LogOut, LogIn, University } from 'lucide-react';
import { StatisticsCard } from '@/components/dashboard/statistics-card';
import { GateAccessStats } from '@/components/dashboard/gate-access-stats';
import { LiveDataTable } from '@/components/dashboard/live-data-table';
// import useUserToken from '@/hooks/useUserToken';
// import { useEffect } from 'react';
// import axios from 'axios';

export function Dashboard() {
  // const { role } = useUserToken();

  // const API_HOST = 'https://202.128.57.226:4430'; // BioStar 2 IP and HTTPS port
  // const BIOSTAR2_WS_URI = `${API_HOST}/wsapi`;
  // const BIOSTAR2_WS_EVENT_START_URI = `${API_HOST}/api/users/2123456`;

  // const bsSessionId = '1a089fc5956b42e29d5726c164c89334';

  // useEffect(() => {
  //   if (!bsSessionId) {
  //     console.error(
  //       'Session ID is missing. Cannot establish WebSocket connection.',
  //     );
  //     return;
  //   }

  //   const ws = new WebSocket(BIOSTAR2_WS_URI);

  //   ws.onopen = () => {
  //     console.log('WebSocket connection established.');
  //     // Send the session ID to the WebSocket server
  //     ws.send(`bs-session-id=${bsSessionId}`);

  //     // Optionally call the event API after WebSocket connection is established
  //     setTimeout(() => {
  //       fetchEventData();
  //     }, 1000);
  //   };

  //   ws.onmessage = (event) => {
  //     console.log('WebSocket message received:', event.data);
  //   };

  //   ws.onerror = (error) => {
  //     console.error('WebSocket error:', error);
  //   };

  //   ws.onclose = () => {
  //     console.log('WebSocket connection closed.');
  //   };

  //   // Cleanup on component unmount
  //   return () => {
  //     if (ws.readyState === WebSocket.OPEN) {
  //       ws.close();
  //     }
  //   };

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [bsSessionId]);

  // const payload = {
  //   Query: {
  //     limit: 51,
  //     conditions: [
  //       {
  //         column: 'datetime',
  //         operator: 3,
  //         values: ['2019-07-30T15:00:00.000Z'],
  //       },
  //     ],
  //     orders: [
  //       {
  //         column: 'datetime',
  //         descending: false,
  //       },
  //     ],
  //   },
  // };

  // const fetchEventData = async () => {
  //   try {
  //     const response = await axios.get(BIOSTAR2_WS_EVENT_START_URI, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'bs-session-id': bsSessionId,
  //       },
  //       data: JSON.stringify(payload),
  //     });

  //     console.log('Fetched event data:', response.data);
  //   } catch (error) {
  //     console.error('Error fetching event data:', error);
  //   }
  // };

  return (
    <div className="p-6">
      <div>
        <h2 className="mb-4 text-lg font-medium">Access Counts Overview</h2>

        <div className="mb-6 grid grid-cols-12 gap-4">
          {/* Stats and Gate Access in same row */}
          <div className="col-span-6 grid grid-cols-3 gap-4">
            <StatisticsCard
              icon={<University className="h-10 w-10 text-[#00bc65]" />}
              count={15482}
              label="On Premise"
            />
            <StatisticsCard
              icon={
                <LogIn className="h-10 w-10 text-[#4fd1c5] transform rotate-180" />
              }
              count={20000}
              label="Entry"
            />
            <StatisticsCard
              icon={<LogOut className="h-10 w-10 text-[#ee5f62]" />}
              count={4518}
              label="Exit"
            />
          </div>

          {/* Gate Access Stats */}
          <div className="col-span-6 rounded-lg p-6">
            <h2 className="mb-4 text-lg font-medium">Gate Access Stats</h2>
            <GateAccessStats />
          </div>
        </div>

        {/* Live Data Table */}
        <LiveDataTable />
      </div>
    </div>
  );
}
