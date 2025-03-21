"use client";

import { LogOut, LogIn, University } from "lucide-react";
import { StatisticsCard } from "@/components/dashboard/statistics-card";
import { GateAccessStats } from "@/components/dashboard/gate-access-stats";
import { LiveDataTable } from "@/components/dashboard/live-data-table";
import { useCallback, useEffect, useState } from "react";
// import axios from "axios";
import axios from "@/lib/axios-interceptor";
import {
  CustomField,
  DeviceProps,
  EventProps,
  // ReportData,
  ScanProps,
  UserProps,
} from "@/lib/types";
import debounce from "lodash/debounce";
// import { checkExpiry } from "@/lib/checkExpiry";
// import useUserToken from "@/hooks/useUserToken";
import { useReportsSocket } from "@/hooks/useReportSocket";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  // const { token } = useUserToken();
  const { stats } = useReportsSocket();
  const [tableQueue, setTableQueue] = useState<ScanProps[]>([]);
  const [processedEvents, setProcessedEvents] = useState(new Set());
  // const [devicesData, setDevicesData] = useState<{ [key: string]: ScanProps }>(
  //   {}
  // );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [stats, setStats] = useState<GateStats | null>(null);
  // const [socket, setSocket] = useState<Socket | null>(null);

  // const WS_HOST = 'wss://192.168.0.22:8888';
  // const BIOSTAR2_WS_URI = `${WS_HOST}/wsapi`;
  const BIOSTAR2_WS_URI = `${process.env.NEXT_PUBLIC_WS_HOST}/wsapi`;
  // const SOCKET_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
  // const SOCKET_URL = `http://localhost:9580/`;

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
              const { user_id, device_id, datetime, tna_key, event_type_id } = eventData.Event;

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
                    datetime,
                    event_type_id
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchUserData = useCallback(
    debounce(
      (
        bsSessionId: string,
        user: UserProps,
        device: DeviceProps,
        tna_key: string,
        datetime: string,
        event_type_id: EventProps
      ) => {
        fetchUserData(bsSessionId, user, device, tna_key, datetime, event_type_id);
      },
      300, // 300ms delay
      { leading: true, trailing: false } // Only process the first call in the wait period
    ),
    []
  );

  const fetchUserData = async (
    bsSessionId: string,
    user: UserProps,
    device: DeviceProps,
    tna_key: string,
    datetime: string,
    event_type_id: EventProps
  ) => {
       // Skip UPDATE events
       if (event_type_id.name.includes("UPDATE")) {
        return;
      }
  
      // // Skip tna_key of 2 (OUT events)
      // if (tna_key === "2") {
      //   return;
      // }
    
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

      const userCustomFields = response.data.data.User.user_custom_fields || [];

      const remarksField = userCustomFields.find(
        (field: CustomField) => field.custom_field.name === "Remarks"
      );

      const livedNameField = userCustomFields.find(
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

      // setDevicesData((prevData) => ({
      //   ...prevData,
      //   [device.id]: {
      //     user: userData,
      //     device: deviceData,
      //     datetime,
      //     remarks: remarks ?? "No remarks",
      //     livedName,
      //     userImage,
      //     disabled,
      //     expiryDate,
      //     tnaKey: tna_key,
      //   },
      // }));

      // Update table queue with length limit
      setTableQueue((prevQueue) => {
        const newQueue = [...prevQueue, newDeviceData];
        return newQueue.length > 25 ? newQueue.slice(1) : newQueue;
      });

      // Update stats queue without limit
      // setDeviceQueue((prevQueue) => [...prevQueue, newDeviceData]);
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

  // const getEntryStatus = (scan: ScanProps): string => {
  //   const isDisabled = scan.disabled === "true";
  //   const isExpired = checkExpiry(scan.expiryDate);
  //   const hasRemarks = scan.remarks !== "No remarks";

  //   if (isDisabled || isExpired) {
  //     return "RED;cannot enter with or without remarks";
  //   }

  //   if (hasRemarks) {
  //     return "YELLOW;can enter with remarks";
  //   }

  //   return "GREEN;can enter without remarks";
  // };

  const handleClear = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleConfirmClear = useCallback(() => {
    setTableQueue([]);
    setIsDialogOpen(false);
  }, []);

  const handleCancelClear = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  // Clean up the debounced function
  useEffect(() => {
    return () => {
      debouncedFetchUserData.cancel();
    };
  }, [debouncedFetchUserData]);

  // calculate counts from deviceQueue
  // useEffect(() => {
  //   const entry = deviceQueue.filter((item) => item.tnaKey === "1").length;
  //   const exit = deviceQueue.filter((item) => item.tnaKey === "2").length;
  //   const onPremise = entry - exit;

  //   setAccessCounts({
  //     entry,
  //     exit,
  //     onPremise: onPremise >= 0 ? onPremise : 0, // Ensure it doesn't go negative
  //   });
  // }, [deviceQueue]);

  // useEffect(() => {
  //   const sendReport = async (reportData: ReportData) => {
  //     try {
  //       const response = await axios.post(
  //         `${process.env.NEXT_PUBLIC_API_URL}/reports`,
  //         reportData,
  //         {
  //           headers: {
  //             accept: "*/*",
  //             "Content-Type": "application/json",
  //             Authorization: `${token}`,
  //           },
  //         }
  //       );
  //       console.log("Report sent successfully:", response.data);
  //     } catch (error) {
  //       console.error("Error sending report:", error);
  //     }
  //   };

  //   // Get the latest scan from devicesData
  //   const latestScan = Object.values(devicesData)[0];

  //   console.log("latestScan", latestScan);

  //   if (latestScan) {
  //     const reportData: ReportData = {
  //       datetime: latestScan.datetime,
  //       // type: latestScan.tnaKey === '1' ? "IN" : "OUT",
  //       type: latestScan.tnaKey!,
  //       user_id: latestScan.user.user_id,
  //       name: latestScan.user.name,
  //       remarks: latestScan.remarks || "No remarks",
  //       status: getEntryStatus(latestScan),
  //       activity: latestScan.tnaKey === "1" ? "IN" : "OUT",
  //     };

  //     sendReport(reportData);
  //   }
  //   // include getEntryStatus if failing
  // }, [devicesData, token]);

  return (
    <div className="p-6">
      <div>
        <h2 className="mb-4 text-lg font-medium">Access Counts Overview</h2>

        <div className="mb-6 grid grid-cols-12 gap-4">
          {/* Stats and Gate Access in same row */}
          {
            <div className="col-span-6 grid grid-cols-3 gap-4">
              <StatisticsCard
                icon={<University className="h-10 w-10 text-[#00bc65]" />}
                count={stats?.onPremise}
                label="On Premise"
              />
              <StatisticsCard
                icon={
                  <LogIn className="h-10 w-10 text-[#4fd1c5] transform rotate-180" />
                }
                count={stats?.entry}
                label="Entry"
              />
              <StatisticsCard
                icon={<LogOut className="h-10 w-10 text-[#ee5f62]" />}
                count={stats?.exit}
                label="Exit"
              />
            </div>
          }

          {/* Gate Access Stats */}
          <div className="col-span-6 rounded-lg px-4">
            <h2 className="mb-4 text-lg font-medium">Gate Access Stats</h2>
            <GateAccessStats data={stats?.gateAccessStats} />
          </div>
        </div>

        {/* Live Data Table */}
        <LiveDataTable data={tableQueue} handleClear={handleClear} />
      </div>
      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Live Data</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all entries from the live data
              table?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelClear}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmClear}>
                Clear Data
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
