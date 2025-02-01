'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FolderClosed, SlidersHorizontal, Upload, X } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDropzone } from 'react-dropzone';

export function ScreenSaverUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [showConfigure, setShowConfigure] = useState(false);
  const [defaultScreensaverUrl, setDefaultScreensaverUrl] = useState<
    string | null
  >(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      handleImageUpload(acceptedFiles);
    },
  });
  const [interval, setInterval] = useState<string>('60000');

  const user = Cookies.get('user');
  const token = user ? JSON.parse(user).token : null;

  const handleImageUpload = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/screensaver/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        },
      );

      const data = await response.data;
      setImage(data.url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleIntervalChange = () => {
    if (interval) {
      localStorage.setItem('screensaverInterval', interval.toString());
    }
  };

  useEffect(() => {
    const interval = localStorage.getItem('screensaverInterval');
    if (interval) {
      setInterval(interval);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/screensaver`,
          {
            headers: {
              Authorization: token,
            },
          },
        );

        if (res.status === 200) {
          setDefaultScreensaverUrl(res.data.data.url);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Screen Saver</CardTitle>
      </CardHeader>
      <CardContent>
        {!image && !showConfigure ? (
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 cursor-pointer"
            >
              <input {...getInputProps()} />
              {image || defaultScreensaverUrl ? (
                <Image
                  src={image || defaultScreensaverUrl || '/placeholder.svg'}
                  alt="Screensaver"
                  width={400}
                  height={400}
                  className="h-auto object-cover rounded-lg"
                />
              ) : (
                <>
                  <Upload className="mb-5 h-[4.5rem] w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag or Drop to upload image
                  </p>
                </>
              )}
            </div>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(Array.from(e.target.files || []))
                }
                className="absolute inset-0 cursor-pointer opacity-0"
              />

              {!defaultScreensaverUrl && (
                <Button className="flex items-center gap-2 w-full mb-2">
                  <FolderClosed className="h-5 w-5" />
                  Choose an image
                </Button>
              )}
            </div>
            {!image && defaultScreensaverUrl && (
              <Button
                className="flex items-center gap-2 w-full"
                onClick={() => setShowConfigure(true)}
              >
                <SlidersHorizontal className="h-5 w-5" />
                Configure
              </Button>
            )}
          </div>
        ) : showConfigure ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium">Configure</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowConfigure(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Select
              onValueChange={(value) => {
                setInterval(value);
              }}
              value={interval}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60000">Every 1 minute</SelectItem>
                <SelectItem value="300000">Every 5 minutes</SelectItem>
                <SelectItem value="6000000">Every 10 minutes</SelectItem>
                <SelectItem value="9000000">Every 15 minutes</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleIntervalChange} className="w-full">
              Save
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-auto overflow-hidden">
              <Image
                src={image || '/placeholder.svg'}
                alt="Screen saver preview"
                width={300}
                height={300}
                className="h-auto object-cover rounded-lg mx-auto"
              />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowConfigure(true)}
            >
              Configure
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
