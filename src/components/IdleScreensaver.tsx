"use client";

import { useState, useEffect } from "react";
import { useIdleTimer } from "../hooks/useIdleTimer";
import Image from "next/image";
import Cookies from "js-cookie";
// import axios from '@/lib/axios-interceptor';
import { usePathname } from "next/navigation";
import axios from "axios";

export function IdleScreensaver() {
  const pathname = usePathname();
  const user = Cookies.get("user");
  const token = user ? JSON.parse(user).token : null;

  const [showScreensaver, setShowScreensaver] = useState(false);
  const [screensaverUrl, setScreensaverUrl] = useState("");
  const [interval, setInterval] = useState<string>("");

  const handleActivity = () => {
    setShowScreensaver(false);
  };

  useEffect(() => {
    const interval = localStorage.getItem("screensaverInterval");
    setInterval(interval ?? "60000");
  }, []);

  const isIdle = useIdleTimer(parseInt(interval, 10));

  useEffect(() => {
    setShowScreensaver(isIdle);
  }, [isIdle]);

  useEffect(() => {
    if (
      pathname === "/login" ||
      pathname === "/login/employee" ||
      pathname === "/employee-dashboard" ||
      !token
    ) {
      return;
    }

    try {
      const fetchData = async () => {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/screensaver`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        console.log(res);

        if (res.status === 200 && res.data.data !== null) {
          setScreensaverUrl(res.data.data.url);
        } else {
          setScreensaverUrl("");
        }
      };

      fetchData();
    } catch (err) {
      console.error(err);
    }
  }, [pathname, token]);

  if (!showScreensaver || !screensaverUrl || screensaverUrl === '') return null;

  return (
    <div
      className="fixed inset-0 w-full h-full z-[9999]"
      onClick={handleActivity}
      onMouseMove={handleActivity}
      onKeyDown={handleActivity}
    >
      {screensaverUrl && (
        <Image
          src={screensaverUrl}
          alt="Screensaver"
          layout="fill"
          objectFit="cover"
          priority
        />
      )}
    </div>
  );
}
