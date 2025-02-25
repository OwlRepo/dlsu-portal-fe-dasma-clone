"use client";

import { LogOut, LogIn, University } from "lucide-react";
import { StatisticsCard } from "@/components/dashboard/statistics-card";
import { GateAccessStats } from "@/components/dashboard/gate-access-stats";
import { LiveDataTable } from "@/components/dashboard/live-data-table";
// import useUserToken from '@/hooks/useUserToken';
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { CustomField, DeviceProps, ScanProps, UserProps } from "@/lib/types";
import debounce from "lodash/debounce";

export function Dashboard() {
  // const { role } = useUserToken();
  const [tableQueue, setTableQueue] = useState<ScanProps[]>([]);
  const [deviceQueue, setDeviceQueue] = useState<ScanProps[]>([]);
  const [processedEvents, setProcessedEvents] = useState(new Set());
  const [accessCounts, setAccessCounts] = useState({
    entry: 0,
    exit: 0,
    onPremise: 0,
  });

  const WS_HOST = "wss://127.0.0.1:4431";
  const BIOSTAR2_WS_URI = `${WS_HOST}/wsapi`;

  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const response = await axios.post(
          "/api/login",
          {
            User: {
              login_id: "admin",
              password: "ELIDtech1234",
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response) {
          // setBsSessionId(response.data.bsSessionId);
          const ws = new WebSocket(BIOSTAR2_WS_URI);

          ws.onopen = () => {
            console.log("WebSocket connection established.");
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

              // Check if we've already processed this event
              const eventKey = `${user_id}-${device_id}-${datetime}`;
              if (!processedEvents.has(eventKey)) {
                setProcessedEvents((prev) => new Set(prev).add(eventKey));

                if (user_id && device_id && datetime) {
                  debouncedFetchUserData(
                    response.data.bsSessionId,
                    user_id,
                    device_id,
                    tna_key,
                    datetime
                  );
                }
              }
            }
          };

          ws.onerror = (error) => {
            console.error("WebSocket error:", error);
          };

          ws.onclose = () => {
            console.log("WebSocket connection closed.");
          };

          // Cleanup on component unmount
          return () => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.close();
            }
          };
        } else {
          console.error(
            "Session ID is missing. Cannot establish WebSocket connection."
          );
          return;
        }

        // console.log('Login response:', response.data);
      } catch (error) {
        console.error("Error logging in:", error);
      }
    };

    fetchSessionId();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedFetchUserData = useCallback(
    debounce(
      (
        bsSessionId: string,
        user: UserProps,
        device: DeviceProps,
        tna_key: string,
        datetime: string
      ) => {
        fetchUserData(bsSessionId, user, device, tna_key, datetime);
      },
      300, // 300ms delay
      { leading: true, trailing: false } // Only process the first call in the wait period
    ),
     // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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

      console.log("WebSocket Event Received:", datetime); // Add this to track events

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

      // Update table queue with length limit
      setTableQueue((prevQueue) => {
        const newQueue = [...prevQueue, newDeviceData];
        return newQueue.length > 25 ? newQueue.slice(1) : newQueue;
      });

      // Update stats queue without limit
      setDeviceQueue((prevQueue) => [...prevQueue, newDeviceData]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchEventData = async (bsSessionId: string) => {
    try {
      const response = await axios.post(
        "/api/events",
        {
          Query: {
            limit: 51,
            conditions: [
              {
                column: "datetime",
                operator: 3,
                values: [new Date().toISOString()],
              },
            ],
            orders: [
              {
                column: "datetime",
                descending: false,
              },
            ],
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "bs-session-id": bsSessionId,
          },
        }
      );

      console.log("Fetched event data:", response.data);
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  const handleClear = useCallback(() => {
    setTableQueue([]);
  }, []);

  // Clean up the debounced function
  useEffect(() => {
    return () => {
      debouncedFetchUserData.cancel();
    };
  }, [debouncedFetchUserData]);

  // calculate counts from deviceQueue
  useEffect(() => {
    const entry = deviceQueue.filter((item) => item.tnaKey === "1").length;
    const exit = deviceQueue.filter((item) => item.tnaKey === "2").length;
    const onPremise = entry - exit;

    setAccessCounts({
      entry,
      exit,
      onPremise: onPremise >= 0 ? onPremise : 0, // Ensure it doesn't go negative
    });
  }, [deviceQueue]);

  return (
    <div className="p-6">
      <div>
        <h2 className="mb-4 text-lg font-medium">Access Counts Overview</h2>

        <div className="mb-6 grid grid-cols-12 gap-4">
          {/* Stats and Gate Access in same row */}
          <div className="col-span-6 grid grid-cols-3 gap-4">
            <StatisticsCard
              icon={<University className="h-10 w-10 text-[#00bc65]" />}
              count={accessCounts.onPremise}
              label="On Premise"
            />
            <StatisticsCard
              icon={
                <LogIn className="h-10 w-10 text-[#4fd1c5] transform rotate-180" />
              }
              count={accessCounts.entry}
              label="Entry"
            />
            <StatisticsCard
              icon={<LogOut className="h-10 w-10 text-[#ee5f62]" />}
              count={accessCounts.exit}
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
        <LiveDataTable data={tableQueue} onClear={handleClear} />
      </div>
    </div>
  );
}
