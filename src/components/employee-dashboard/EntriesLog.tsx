"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { ScanProps } from "@/lib/types";
import { useEffect } from "react";

interface LogEntry {
  queue: ScanProps[];
}

export default function EntriesLog({ queue }: LogEntry) {
  useEffect(() => {
    console.log(queue);
  }, [queue]);

  const getImageType = (base64: string) => {
    if (base64.startsWith("iVBORw0KGgo")) {
      return "image/png";
    } else if (base64.startsWith("R0lGODlh")) {
      return "image/gif";
    } else if (base64.startsWith("9j/4AAQSkZJRgABAQAAAQABAAD/")) {
      return "image/jpeg";
    }
    return "image/png"; // Default to PNG if undetectable
  };

  const updatedScanQueue = queue.map((queue) => {
    if (queue.userImage) {
      const imageType = getImageType(queue.userImage);
      const base64Data = `data:${imageType};base64,${queue.userImage}`;
      return { ...queue, userImage: base64Data };
    }
    return queue;
  });

  const getBorderColorClass = (remarks: string | undefined | null) => {
    if (!remarks) return 'border-2';
    return remarks === 'No remarks' ? 'border-4 border-green-500' : 'border-4 border-yellow-500';
  };

  return (
    <div className="flex-grow">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Recent Entries
      </h2>
      <div className="w-full max-w-2xl mx-auto">
        <ScrollArea className="h-[calc(100vh-200px)] max-w-lg pr-4">
          <div className="space-y-3">
            {updatedScanQueue.map((entry, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg p-4 ${getBorderColorClass(entry?.remarks)}`}
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={entry.userImage || "/default-user-icon.png"}
                    alt={entry.user.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-900">
                        {entry.user.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {entry.user.user_id}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Turnstile: {entry.device.id}
                    </p>
                    {entry.livedName && (
                      <p className="text-sm text-gray-600">
                        Lived Name: {entry.livedName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">
                    Remarks: {entry.remarks || "No remarks"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
