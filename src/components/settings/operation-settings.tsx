"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Moon,
  RefreshCw,
  Sun,
  Upload,
  UserMinus,
  X,
} from "lucide-react";
import { ScreenSaverUpload } from "./screen-saver-upload";
import { TimePicker } from "./time-picker";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { Input } from "../ui/input";

export function OperationSettings() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [morning, setMorning] = useState("");
  const [evening, setEvening] = useState("");
  const [showTimePicker, setShowTimePicker] = useState<
    "morning" | "evening" | null
  >(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isProcessingDeletion, setIsProcessingDeletion] = useState(false);

  const handleSync = async () => {
    const user = Cookies.get("user");
    const token = user ? JSON.parse(user).token : null;

    try {
      setSyncing(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/database-sync/sync`,
        {},
        {
          headers: {
            Authorization: `${token}`,
            Accept: "application/json",
          },
        }
      );
      setSyncing(false);
      if (res.data) {
        toast({
          title: "Success",
          description:
            "The database has been successfully synchronized manually.",
        });
      }
    } catch (error) {
      console.error(error);
      setSyncing(false);
      toast({
        title: "Error",
        description: "An error occurred while synchronizing the database.",
        variant: "destructive",
      });
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }

      setCsvFile(file);
      setFileName(file.name);
    }
  };

  const handleClearFile = () => {
    setCsvFile(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle delete users
  const handleDeleteUsers = async () => {
    if (!csvFile) {
      toast({
        title: "No file selected",
        description: "Please upload a CSV file first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingDeletion(true);
    try {
      const user = Cookies.get("user");
      const token = user ? JSON.parse(user).token : null;

      const formData = new FormData();
      formData.append("file", csvFile);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/database-sync/delete-users`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res) {
        console.log(res);
        toast({
          title: "Success",
          description: `Users have been deleted successfully.`,
        });
      }

      // Reset state after successful deletion
      handleClearFile();
    } catch (error) {
      // Use type narrowing to check if this is an Axios error
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          // Handle 400 Bad Request errors specifically
          const errorMessage =
            error.response.data.message ||
            "The server couldn't process the CSV file. Please check the format and try again.";

          toast({
            title: "Invalid CSV Format",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          // Handle other types of errors
          toast({
            title: "Error",
            description: "Failed to delete users. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // Handle non-Axios errors
        console.error("Unknown error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessingDeletion(false);
    }
  };

  useEffect(() => {
    const user = Cookies.get("user");
    const token = user ? JSON.parse(user).token : null;

    try {
      const fetchSchedule = async () => {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/database-sync/schedules`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (res.data.length !== 0) {
          // Handle array of schedules
          res.data.forEach(
            (schedule: { scheduleNumber: number; time: string }) => {
              if (schedule.scheduleNumber === 1) {
                setMorning(schedule.time);
              } else if (schedule.scheduleNumber === 2) {
                setEvening(schedule.time);
              }
            }
          );
        }
      };
      fetchSchedule();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Syncing</CardTitle>
          <CardDescription>
            Configure automatic synchronization times.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between bg-gray-100 py-2 px-4 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="flex items-center w-32 gap-4 text-gray-500">
                <Sun />
                {morning}
              </div>
            </div>
            <Button onClick={() => setShowTimePicker("morning")}>Set</Button>
          </div>
          <div className="flex items-center justify-between bg-gray-100 py-2 px-4 rounded-md">
            <div className="flex items-center space-x-4">
              <div className="flex items-center w-32 gap-4 text-gray-500">
                <Moon />
                {evening}
              </div>
            </div>
            <Button onClick={() => setShowTimePicker("evening")}>Set</Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 py-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <Button className="w-full" onClick={handleSync} disabled={syncing}>
            {syncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5" />
                Sync Now
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <ScreenSaverUpload />

      <Card className="">
        <CardHeader>
          <CardTitle>Delete user</CardTitle>
          <CardDescription>
            Upload a CSV file containing the list of users to be deleted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            {fileName ? (
              <div className="flex items-center justify-between p-2 bg-gray-50 border rounded-md">
                <span className="text-sm truncate max-w-[200px]">
                  {fileName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFile}
                  className="h-8 w-8 p-0"
                >
                  <span className="sr-only">Remove file</span>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleButtonClick}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV file
              </Button>
            )}
            <Input
              id="csv"
              type="file"
              accept=".csv"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          <Button
            variant="destructive"
            className="w-full"
            disabled={!csvFile || isProcessingDeletion}
            onClick={handleDeleteUsers}
          >
            {isProcessingDeletion ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <UserMinus className="h-4 w-4 mr-2" />
                Proceed to deletion
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* <Card className="">
        <CardHeader>
          <CardTitle>Test</CardTitle>
          <CardDescription>Test</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4"></CardContent>
      </Card> */}

      {showTimePicker && (
        <TimePicker
          defaultValue={showTimePicker === "morning" ? morning : evening}
          time={showTimePicker}
          onSave={(time) => {
            if (showTimePicker === "morning") {
              setMorning(time);
            } else {
              setEvening(time);
            }
            setShowTimePicker(null);
          }}
          onClose={() => setShowTimePicker(null)}
        />
      )}
    </div>
  );
}
