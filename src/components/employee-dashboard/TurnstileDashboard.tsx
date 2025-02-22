"use client";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
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
import { CustomField, DeviceProps, ScanProps, UserProps } from "@/lib/types";

export default function TurnstileDashboard() {

  const [devicesData, setDevicesData] = useState<{ [key: string]: ScanProps }>(
    {}
  );

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
          const ws = new WebSocket(BIOSTAR2_WS_URI);

          ws.onopen = () => {
            // console.log('WebSocket connection established.');
            // Send the session ID to the WebSocket server
            ws.send(`bs-session-id=${response.data.bsSessionId}`);

            // Optionally call the event API after WebSocket connection is established
            setTimeout(() => {
              fetchEventData(response.data.bsSessionId);
            }, 1000);
          };

          // ws.onmessage = (event) => {
          //   const eventData = JSON.parse(event.data);
          //   if (eventData.Event) {
          //     const { user_id, device_id, datetime } = eventData.Event;
          //     if (user_id) setUser(user_id);
          //     if (device_id) setDevice(device_id);
          //     if (datetime) setDatetime(datetime);
          //   }
          // };

          ws.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            if (eventData.Event) {
              const { user_id, device_id, datetime } = eventData.Event;
              if (user_id && device_id && datetime) {
                fetchUserData(
                  response.data.bsSessionId,
                  user_id,
                  device_id,
                  datetime
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

        // console.log('Login response:', response.data);
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
    datetime: string
  ) => {
    console.log(user);
    try {
      const response = await axios.get("api/users", {
        headers: {
          "bs-session-id": bsSessionId,
        },
        params: {
          params: user.user_id,
        },
      });

      const userImage = response.data.data.User.photo ? response.data.data.User.photo : undefined;

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

      setDevicesData((prevData) => ({
        ...prevData,
        [device.id]: {
          user: userData,
          device: deviceData,
          datetime,
          remarks,
          livedName,
          userImage,
        },
      }));
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
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDevicesData({});
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, [devicesData]);

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
        <Card className="min-w-[75%]">
          <CardHeader>
            <CardTitle>Access Overview</CardTitle>
            <CardDescription>Real-Time Entry</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row flex-wrap gap-4">
            {Object.keys(devicesData).map((deviceId) => (
              <div key={deviceId} className="mb-4">
                <TurnstileGrid
                  key={deviceId}
                  scanDetails={[devicesData[deviceId]]}
                  setScanDetail={(newScanDetail) => {
                    setDevicesData((prevData) => ({
                      ...prevData,
                      [deviceId]: newScanDetail,
                    }));
                  }}
                  turnstileCount={4}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <EntriesLog />
      </div>
    </div>
  );
}
