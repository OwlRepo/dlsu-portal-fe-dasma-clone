'use client';

import { LogOut, LogIn, University } from 'lucide-react';
import { StatisticsCard } from '@/components/dashboard/statistics-card';
import { GateAccessStats } from '@/components/dashboard/gate-access-stats';
import { LiveDataTable } from '@/components/dashboard/live-data-table';
// import useUserToken from '@/hooks/useUserToken';
import { useEffect } from 'react';
import axios from 'axios';

export function Dashboard() {
  // const { role } = useUserToken();
  // const [bsSessionId, setBsSessionId] = useState('');

  const BIOSTAR_URI = 'https://202.128.57.226:4430'; // BioStar 2 IP and HTTPS port
  // const API_HOST = '/api/proxy';
  const BIOSTAR2_WS_URI = `${BIOSTAR_URI}/wsapi`;
  // const BIOSTAR2_WS_EVENT_START_URI = `${API_HOST}/api/users/2123456`;

  // const bsSessionId = '1a089fc5956b42e29d5726c164c89334';

  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const response = await axios.post(
          '/api/login',
          {
            User: {
              login_id: 'admin',
              password: 'ELIDtech1234',
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response) {
          // setBsSessionId(response.data.bsSessionId);
          const ws = new WebSocket(BIOSTAR2_WS_URI);

          ws.onopen = () => {
            console.log('WebSocket connection established.');
            // Send the session ID to the WebSocket server
            ws.send(`bs-session-id=${response.data.bsSessionId}`);

            // Optionally call the event API after WebSocket connection is established
            setTimeout(() => {
              fetchEventData(response.data.bsSessionId);
            }, 1000);
          };

          ws.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
          };

          ws.onerror = (error) => {
            console.error('WebSocket error:', error);
          };

          ws.onclose = () => {
            console.log('WebSocket connection closed.');
          };

          // Cleanup on component unmount
          return () => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.close();
            }
          };
        } else {
          console.error(
            'Session ID is missing. Cannot establish WebSocket connection.',
          );
          return;
        }

        // console.log('Login response:', response.data);
      } catch (error) {
        console.error('Error logging in:', error);
      }
    };

    fetchSessionId();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const fetchEventData = async (bsSessionId: string) => {
    console.log(bsSessionId);
    try {
      const response = await axios.get('api/users', {
        headers: {
          'bs-session-id': bsSessionId,
        },
        params: {
          params: '2123456',
        },
      });

      console.log('Fetched event data:', response.data);
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };

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

// const fetchSessionId = async () => {
//   try {
//     const response = await axios.post(
//       `${API_HOST}/api/login`,
//       {
//         login_id: 'admin',
//         password: 'ELIDtech1234',
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       },
//     );

//     console.log(response);
//     if (response) {
//       setBsSessionId(response.data);
//       const ws = new WebSocket(BIOSTAR2_WS_URI);

//       ws.onopen = () => {
//         console.log('WebSocket connection established.');
//         ws.send(`bs-session-id=${response.data}`);

//         setTimeout(() => {
//           fetchEventData();
//         }, 1000);
//       };

//       ws.onmessage = (event) => {
//         console.log('WebSocket message received:', event.data);
//       };

//       ws.onerror = (error) => {
//         console.error('WebSocket error:', error);
//       };

//       ws.onclose = () => {
//         console.log('WebSocket connection closed.');
//       };

//       return () => {
//         if (ws.readyState === WebSocket.OPEN) {
//           ws.close();
//         }
//       };
//     } else {
//       console.error(
//         'Session ID is missing. Cannot establish WebSocket connection.',
//       );
//       return;
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//   }
// };
