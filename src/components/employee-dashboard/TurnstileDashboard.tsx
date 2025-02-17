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
  const [bsSessionId, setBsSessionId] = useState("");
  const [user, setUser] = useState<UserProps>({
    user_id: "",
    name: "",
    photo_exist: false,
  });
  const [device, setDevice] = useState<DeviceProps>({ id: "", name: "" });
  const [datetime, setDatetime] = useState("");
  const [remarks, setRemarks] = useState<string | undefined>(undefined);
  const [remarksFetched, setRemarksFetched] = useState(false);
  const [name, setName] = useState("");
  const [scanDetail, setScanDetail] = useState<ScanProps>({
    user: {
      user_id: "",
      name: "",
      photo_exist: false,
    },
    device: {
      id: "",
      name: "",
    },
    datetime: "",
    remarks: undefined,
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
          const ws = new WebSocket(BIOSTAR2_WS_URI);

          ws.onopen = () => {
            // console.log('WebSocket connection established.');
            // Send the session ID to the WebSocket server
            ws.send(`bs-session-id=${response.data.bsSessionId}`);
            setBsSessionId(response.data.bsSessionId);

            // Optionally call the event API after WebSocket connection is established
            setTimeout(() => {
              fetchEventData(response.data.bsSessionId);
            }, 1000);
          };

          ws.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            if (eventData.Event) {
              const { user_id, device_id, datetime } = eventData.Event;
              if (user_id) setUser(user_id);
              if (device_id) setDevice(device_id);
              if (datetime) setDatetime(datetime);
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

  const fetchUserData = async (bsSessionId: string, user_id: string) => {
    try {
      const response = await axios.get("api/users", {
        headers: {
          "bs-session-id": bsSessionId,
        },
        params: {
          params: user_id,
        },
      });
      const remarksField = response.data.data.User.user_custom_fields.find(
        (field: CustomField) => field.custom_field.name === "Remarks"
      );

      if (response.data.data.User) {
        setName(response.data.data.User.name);
      }

      if (remarksField) {
        setRemarks(remarksField.item);
      } else {
        console.error("Remarks field not found");
      }

      setRemarksFetched(true);
    } catch (error) {
      console.error("Error fetching event data:", error);
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
    if (user.user_id && bsSessionId) {
      fetchUserData(bsSessionId, user.user_id);
    }
  }, [bsSessionId, user]);

  useEffect(() => {
    if (user && device && datetime) {
      setScanDetail({
        user: {
          user_id: user.user_id,
          name: name,
          photo_exist: user.photo_exist,
        },
        device,
        datetime,
        remarks: remarks || "",
      });
    }
  }, [user, device, datetime, remarks, remarksFetched, name]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScanDetail({
        user: { user_id: "", name: "", photo_exist: false },
        device: { id: "", name: "" },
        datetime: "",
        remarks: undefined,
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [scanDetail]);

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
        <Card className="flex-grow items-center justify-center">
          <CardHeader>
            <CardTitle>Access Overview</CardTitle>
            <CardDescription>Real-Time Entry</CardDescription>
          </CardHeader>
          <CardContent>
            <TurnstileGrid
              scanDetail={scanDetail}
              setScanDetail={setScanDetail}
              turnstileCount={4}
            />
          </CardContent>
        </Card>

        <EntriesLog />
      </div>
    </div>
  );
}
