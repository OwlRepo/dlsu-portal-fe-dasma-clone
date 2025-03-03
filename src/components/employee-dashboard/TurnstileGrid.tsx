import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { getStudentEntries, type StudentEntry } from "../../lib/dummyData";
import Image from "next/image";
import { Label } from "../ui/label";
import {
  ScanDetailStatus,
  TurnstileGridProps,
} from "@/lib/types";
import { useGetEmployeeDetails } from "@/hooks/useGetEmployeeDetails";
import useUserToken from "@/hooks/useUserToken";

export default function TurnstileGrid({
  scanDetails = [],
  turnstileCount = 6,
}: TurnstileGridProps) {
  const { username, token } = useUserToken();
  const { data } = useGetEmployeeDetails({
    username: username || "",
    token: token || "",
  });
  const actualTurnstileCount = turnstileCount || 4;

  // const fixedOrder = data?.device_id
  //   ? [...data.device_id]
  //   : Array.from(
  //       { length: actualTurnstileCount },
  //       (_, index) => `device_${index + 1}`
  //     );

  const baseOrder = Array.from(
    { length: actualTurnstileCount },
    (_, index) => `device_${index + 1}`
  );
  
  // If we have device_id data, merge it into the base array
  const fixedOrder = data?.device_id
    ? baseOrder.map((placeholder, index) => 
        // Use real device ID if available, otherwise keep placeholder
        data.device_id[index] || placeholder
      )
    : baseOrder;

  // Sort the scanDetails array based on the fixed order
  const sortedScanDetails = scanDetails.sort((a, b) => {
    const indexA = fixedOrder.indexOf(a.device.id);
    const indexB = fixedOrder.indexOf(b.device.id);
    return indexA - indexB;
  });

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

  // Map through scanDetails and convert userImage to base64 URL if it exists
  const updatedScanDetails = sortedScanDetails.map((scanDetail) => {
    if (scanDetail.userImage) {
      const imageType = getImageType(scanDetail.userImage);
      const base64Data = `data:${imageType};base64,${scanDetail.userImage}`;
      return { ...scanDetail, userImage: base64Data };
    }
    return scanDetail;
  });

  const scanDetailsMap = new Map(
    updatedScanDetails.map((scanDetail) => [scanDetail.device.id, scanDetail])
  );

  const checkExpiry = (expiryDate: string | undefined) => {
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const today = new Date();
      return today > expiry;
    }
    return false;
  };

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      {fixedOrder.map((deviceId, index) => {
        const scanDetail = scanDetailsMap.get(deviceId);
        const borderClass = getBorderColorClass(scanDetail);

        return (
          <Card
            key={deviceId}
            className={`bg-white rounded-lg ${borderClass}`}
            style={{
              minWidth: "650px",
              maxWidth: "650px",
              minHeight: "320px",
            }}
          >
            <CardHeader>
              {/* <CardTitle>Gate {String.fromCharCode(65 + index)} - {deviceId}</CardTitle> */}
              <CardTitle>
                Turnstile {index + 1} - {deviceId}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* {scanDetail ? (
                <> */}
              <div className="flex items-center space-x-4">
                <Image
                  src={scanDetail?.userImage || "/default-user-icon.png"}
                  alt={scanDetail?.user.name || "default-user"}
                  width={114}
                  height={114}
                  className="w-32 h-32 rounded-full"
                />
                {scanDetail ? (
                  <div className="flex flex-col w-full gap-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">
                        ID: {scanDetail?.user.user_id || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {scanDetail?.user.name || "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        LN: {scanDetail?.livedName || "N/A"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      No data available
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`remarks-${deviceId}`}>Remarks</Label>
                <div
                  id={`remarks-${deviceId}`}
                  className="p-2 rounded-md shadow-sm text-muted-foreground bg-gray-100"
                  style={{ minHeight: "4rem", whiteSpace: "pre-wrap" }}
                >
                  {scanDetail?.remarks || undefined}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
