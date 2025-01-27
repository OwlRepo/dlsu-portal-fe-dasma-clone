'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FolderClosed, Upload, X } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import Cookies from 'js-cookie';

export function ScreenSaverUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [showConfigure, setShowConfigure] = useState(false);

  const user = Cookies.get('user');
  const token = user ? JSON.parse(user).token : null;

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = event.target.files?.[0];

      const formData = new FormData();
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);

        formData.append('file', file);
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Screen Saver</CardTitle>
      </CardHeader>
      <CardContent>
        {!image ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
              <Upload className="mb-5 h-[4.5rem] w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag or Drop to upload image
              </p>
            </div>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <Button className="flex items-center gap-2 w-full">
                <FolderClosed className="h-5 w-5" />
                Choose an image
              </Button>
            </div>
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
            <Select defaultValue="5">
              <SelectTrigger>
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Every 5 Seconds</SelectItem>
                <SelectItem value="10">Every 10 Seconds</SelectItem>
                <SelectItem value="15">Every 15 Seconds</SelectItem>
                <SelectItem value="30">Every 30 Seconds</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
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
