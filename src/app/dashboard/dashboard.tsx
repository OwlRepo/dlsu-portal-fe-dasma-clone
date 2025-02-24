'use client';

import { LogOut, LogIn, University } from 'lucide-react';
import { StatisticsCard } from '@/components/dashboard/statistics-card';
import { GateAccessStats } from '@/components/dashboard/gate-access-stats';
import { LiveDataTable } from '@/components/dashboard/live-data-table';
// import useUserToken from '@/hooks/useUserToken';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CustomField, DeviceProps, ScanProps, UserProps } from '@/lib/types';

export function Dashboard() {
  // const { role } = useUserToken();
    const [deviceQueue, setDeviceQueue] = useState<ScanProps[]>([]);

  // const BIOSTAR_URI = 'https://127.0.0.1:4431'; // BioStar 2 IP and HTTPS port
  const WS_HOST ='wss://127.0.0.1:4431'
  // const API_HOST = '/api/proxy';
  const BIOSTAR2_WS_URI = `${WS_HOST}/wsapi`;;

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
            const eventData = JSON.parse(event.data);
            if (eventData.Event) {
              const { user_id, device_id, datetime, tna_key } = eventData.Event;
              if (user_id && device_id && datetime) {
                fetchUserData(
                  response.data.bsSessionId,
                  user_id,
                  device_id,
                  tna_key,
                  datetime
                );
              }
            }
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

  const fetchUserData = async (
    bsSessionId: string,
    user: UserProps,
    device: DeviceProps,
    tna_key: string,
    datetime: string
  ) => {
    try {
      const response = await axios.get("api/users", {
        headers: {
          "bs-session-id": bsSessionId,
        },
        params: {
          params: user.user_id,
        },
      });

      console.log("Fetched user data:", response.data);

      const userImage = response.data.data.User.photo
        ? response.data.data.User.photo
        : undefined;

      const remarksField = response.data.data.User.user_custom_fields.find(
        (field: CustomField) => field.custom_field.name === "Remarks"
      );

      const livedNameField = response.data.data.User.user_custom_fields.find(
        (field: CustomField) => field.custom_field.name === "Lived Name"
      );

      const userData: UserProps = {
        user_id: response.data.data.User.user_id,
        name: response.data.data.User.name,
        photo_exist: response.data.data.User.photo_exist,
      };

      const deviceData: DeviceProps = {
        id: device.id,
        name: `Device ${device.id}`,
      };

      const remarks = remarksField ? (remarksField.item as string) : undefined;
      const livedName = livedNameField
        ? (livedNameField.item as string)
        : undefined;

      const disabled = response.data.data.User.disabled;
      const expiryDate = response.data.data.User.expiry_datetime;

      setDeviceQueue((prevQueue) => {
        const newDeviceData = {
          user: userData,
          device: deviceData,
          datetime,
          remarks: remarks ?? "No remarks",
          livedName,
          userImage,
          disabled,
          expiryDate,
          tnaKey: tna_key,
        };
        const newQueue = [...prevQueue, newDeviceData];
        // Remove first item if queue length exceeds 10
        return newQueue.length > 25 ? newQueue.slice(1) : newQueue;
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchEventData = async (bsSessionId: string) => {
    try {
      const response = await axios.post(
        '/api/events',
        {
          Query: {
            limit: 51,
            conditions: [
              {
                column: 'datetime',
                operator: 3,
                values: [new Date().toISOString()],
              },
            ],
            orders: [
              {
                column: 'datetime',
                descending: false,
              },
            ],
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'bs-session-id': bsSessionId,
          },
        },
      );

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
            <GateAccessStats data={deviceQueue} />
          </div>
        </div>

        {/* Live Data Table */}
        <LiveDataTable data={deviceQueue} />
      </div>
    </div>
  );
}
