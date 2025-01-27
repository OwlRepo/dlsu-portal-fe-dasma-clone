'use client';

import { useState, useEffect } from 'react';
import { useIdleTimer } from '../hooks/useIdleTimer';
import Image from 'next/image';
import axios from 'axios';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';

export function IdleScreensaver() {
  const pathname = usePathname();
  const [showScreensaver, setShowScreensaver] = useState(false);
  const [screensaverUrl, setScreensaverUrl] = useState('');
  const isIdle = useIdleTimer(180000); // 3 minutes

  useEffect(() => {
    setShowScreensaver(isIdle);
  }, [isIdle]);

  useEffect(() => {
    if (pathname === '/login') {
      return;
    }

    try {
      const user = Cookies.get('user');
      const token = user ? JSON.parse(user).token : null;

      const fetchData = async () => {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/screensaver`,
          {
            headers: {
              Authorization: token,
            },
          },
        );

        if (res.status === 200) {
          setScreensaverUrl(res.data.data.url);
        }
      };

      fetchData();
    } catch (err) {
      console.error(err);
    }
  }, [pathname]);

  const handleActivity = () => {
    setShowScreensaver(false);
  };

  if (!showScreensaver) return null;

  return (
    <div
      className="fixed inset-0 w-full h-full z-[9999]"
      onClick={handleActivity}
      onMouseMove={handleActivity}
      onKeyDown={handleActivity}
    >
      <Image
        src={screensaverUrl}
        alt="Screensaver"
        layout="fill"
        objectFit="cover"
        priority
      />
    </div>
  );
}
