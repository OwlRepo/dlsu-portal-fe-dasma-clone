"use client";

import TurnstileGrid from "./TurnstileGrid";
import EntriesLog from "./EntriesLog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  CustomField,
  DeviceProps,
  ReportData,
  // ReportData,
  ScanProps,
  UserProps,
} from "@/lib/types";
import useUserToken from "@/hooks/useUserToken";
import { checkExpiry } from "@/lib/checkExpiry";

export default function TurnstileDashboard() {
  const { token } = useUserToken();
  const [devicesData, setDevicesData] = useState<{ [key: string]: ScanProps }>(
    {}
  );
  const [deviceQueue, setDeviceQueue] = useState<ScanProps[]>([]);

  const WS_HOST = "wss://127.0.0.1:4431";
  const BIOSTAR2_WS_URI = `${WS_HOST}/wsapi`;

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
                  datetime,
                  tna_key
                );
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

      } catch (error) {
        console.error("Error logging in:", error);
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

      setDevicesData((prevData) => ({
        ...prevData,
        [device.id]: {
          user: userData,
          device: deviceData,
          datetime,
          remarks: remarks ?? "No remarks",
          livedName,
          userImage,
          disabled,
          expiryDate,
          tnaKey: tna_key,
        },
      }));

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDevicesData({});
    }, 5000);

    return () => clearTimeout(timer);
  }, [devicesData]);

    const getEntryStatus = (scan: ScanProps): string => {
      const isDisabled = scan.disabled === "true";
      const isExpired = checkExpiry(scan.expiryDate);
      const hasRemarks = scan.remarks !== "No remarks";
  
      if (isDisabled || isExpired) {
        return "RED;cannot enter with or without remarks";
      }
  
      if (hasRemarks) {
        return "YELLOW;can enter with remarks";
      }
  
      return "GREEN;can enter without remarks";
    };

  useEffect(() => {
    const sendReport = async (reportData: ReportData) => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/reports`,
          reportData,
          {
            headers: {
              accept: "*/*",
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        console.log("Report sent successfully:", response.data);
      } catch (error) {
        console.error("Error sending report:", error);
      }
    };

    // Get the latest scan from devicesData
    const latestScan = Object.values(devicesData)[0];

    if (latestScan) {
      const reportData: ReportData = {
        datetime: latestScan.datetime,
        type: latestScan.tnaKey!,
        user_id: latestScan.user.user_id,
        name: latestScan.user.name,
        remarks: latestScan.remarks || "No remarks",
        status: getEntryStatus(latestScan),
        activity: latestScan.tnaKey === '1' ? "IN" : "OUT",
      };

      sendReport(reportData);
    }
    // include getEntryStatus if failing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devicesData, token]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="min-w-[75%] max-w-[75%]">
          <CardHeader>
            <CardTitle>Access Overview</CardTitle>
            <CardDescription>Real-Time Entry</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row justify-center flex-wrap gap-4">
            <TurnstileGrid
              scanDetails={Object.values(devicesData)}
              setScanDetail={(newScanDetail) => {
                setDevicesData((prevData) => ({
                  ...prevData,
                  [newScanDetail.device.id]: newScanDetail,
                }));
              }}
              turnstileCount={4}
            />
          </CardContent>
        </Card>

        <EntriesLog queue={deviceQueue} />
      </div>
    </div>
  );
}
