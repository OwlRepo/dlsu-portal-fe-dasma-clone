import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { getStudentEntries, type StudentEntry } from "../../lib/dummyData";
import Image from "next/image";
import { Label } from "../ui/label";
import { DeviceProps, UserProps } from "@/lib/types";

type ScanProps = {
  user: UserProps;
  device: DeviceProps;
  datetime: string;
  remarks?: string | undefined | null;
  userImage?: string;
};

interface TurnstileGridProps {
  scanDetails: ScanProps[];
  setScanDetail: (scanDetail: ScanProps) => void;
  turnstileCount: number;
}

export default function TurnstileGrid({
  scanDetails,
}: TurnstileGridProps) {

  const fixedOrder = ["538203430", "538204298", "other_device_id_1", "other_device_id_2"];

  // Sort the scanDetails array based on the fixed order
  const sortedScanDetails = scanDetails.sort((a, b) => {
    const indexA = fixedOrder.indexOf(a.device.id);
    const indexB = fixedOrder.indexOf(b.device.id);
    return indexA - indexB;
  });

  const getImageType = (base64: string) => {
    if (base64.startsWith('iVBORw0KGgo')) {
      return 'image/png';
    } else if (base64.startsWith('R0lGODlh')) {
      return 'image/gif';
    } else if (base64.startsWith('9j/4AAQSkZJRgABAQAAAQABAAD/')) {
      return 'image/jpeg';
    }
    return 'image/png'; // Default to PNG if undetectable
  }

    // Map through scanDetails and convert userImage to base64 URL if it exists
    const updatedScanDetails = sortedScanDetails.map((scanDetail) => {
      if (scanDetail.userImage) {
        const imageType = getImageType(scanDetail.userImage);
        const base64Data = `data:${imageType};base64,${scanDetail.userImage}`;
        return { ...scanDetail, userImage: base64Data };
      }
      return scanDetail;
    });

  console.log(scanDetails)

  return (
    <>
      {updatedScanDetails.map((scanDetail) => (
         <Card
          key={scanDetail.device.id}
          className={`${
            scanDetail.remarks === ""
              ? ""
              : "border-4 " +
                (scanDetail.remarks === null || scanDetail.remarks === undefined
                  ? "border-green-500"
                  : "border-yellow-500")
          }`}
          style={{
            // flexBasis: "calc(15% - 1rem)",
            // flexGrow: 1,
            minWidth: "400px",
            maxWidth: "450px",
          }}
        >
          <CardHeader>
          <CardTitle>Gate {scanDetail.device.id}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center space-x-4">
              <Image
                src={scanDetail.userImage ? scanDetail.userImage : '/default-user-icon.png'}
                // src={'/default-user-icon.png'}
                alt={scanDetail.user.name}
                width={114}
                height={114}
                className="w-32 h-32 rounded-full"
                unoptimized
              />
              <div className="flex flex-col w-full gap-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Status: Student</p>
                </div>

                <p className="text-2xl font-bold">{scanDetail.user.name}</p>
                <p className="text-sm">Time: {scanDetail.datetime}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <div
                id="remarks"
                className="border border-gray-300 p-2 rounded-md text-muted-foreground"
                style={{ minHeight: "4rem", whiteSpace: "pre-wrap" }}
              >
                {scanDetail.remarks || undefined}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

{
  /* {Array.from({ length: turnstileCount }).map((_, index) => {
        const entry: StudentEntry = studentEntries[index];
        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle>Turnstile {index + 1} - Gate A</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center space-x-4">
                <Image
                  src={'/test-image-1.png'}
                  alt={entry.name}
                  width={114} // Specify the width
                  height={114} // Specify the height
                  className="w-32 h-32 rounded-full"
                />
                <div className="flex flex-col w-full gap-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm">ID: {entry.id}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: Student
                    </p>
                  </div>

                  <p className="text-2xl font-bold">{entry.name}</p>
                  <p className="text-sm">Time: {entry.timestamp}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea id="remarks" placeholder="Type your message here." />
              </div>
            </CardContent>
          </Card>
        );
      })} */
}
