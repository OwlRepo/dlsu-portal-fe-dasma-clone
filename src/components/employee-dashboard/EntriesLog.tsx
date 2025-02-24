"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { ScanDetailStatus, ScanProps } from "@/lib/types";

interface LogEntry {
  queue: ScanProps[];
}

export default function EntriesLog({ queue }: LogEntry) {
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


  const checkExpiry = (expiryDate: string | undefined) => {
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const today = new Date();
      return today > expiry;
    }
    return false;
  }

  const getBorderColorClass = (scanDetail?: ScanDetailStatus): string => {
    if (!scanDetail) return 'border-2';
    
    const isExpired = checkExpiry(scanDetail.expiryDate);
    const isDisabled = scanDetail.disabled === "true";
    const hasRemarks = scanDetail.remarks !== "No remarks" && scanDetail.remarks !== null;
    
    // Hardcoded border classes
    if (isExpired || isDisabled) return 'border-4 border-red-500';
    if (!isExpired && scanDetail.disabled === "false" && hasRemarks) return 'border-4 border-yellow-500';
    if (scanDetail.remarks === "No remarks" || scanDetail.remarks === null) return 'border-4 border-green-500';
    
    return 'border-2';
};

  return (
    <div className="flex-grow">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Recent Entries
      </h2>
      <div className="w-full max-w-2xl mx-auto">
        <ScrollArea className="h-[calc(100vh-200px)] max-w-lg pr-4">
          {updatedScanQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
              <p className="text-lg font-medium">No entries yet</p>
              <p className="text-sm">Recent entries will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...updatedScanQueue].reverse().map((entry, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg p-4 ${getBorderColorClass(entry
                  )}`}
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
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
