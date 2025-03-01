"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, LoaderCircle } from "lucide-react";

interface ExportSettings {
  includePhoto: boolean;
  dateFrom: string;
  dateTo: string;
}

interface CustomExportProps {
  onExport: (settings: ExportSettings) => void;
  loading?: boolean;
}

export default function CustomExport({ onExport, loading }: CustomExportProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    includePhoto: false,
    dateFrom: "",
    dateTo: "",
  });

  // Toggle export container
  const toggleExportContainer = () => {
    setIsExportOpen(!isExportOpen);
  };

  // Update export settings
  const updateExportSettings = (
    field: keyof ExportSettings,
    value: boolean | string
  ) => {
    setExportSettings((prevSettings) => ({
      ...prevSettings,
      [field]: value,
    }));
  };

  // Clear all export settings
  const clearExportSettings = () => {
    setExportSettings({
      includePhoto: false,
      dateFrom: "",
      dateTo: "",
    });
  };

  // Initiate export
  const initiateExport = () => {
    onExport(exportSettings);
    setIsExportOpen(false); // Close the export settings after initiating export
    setExportSettings({
      includePhoto: false,
      dateFrom: "",
      dateTo: "",
    });
  };

  // Check if any export setting is applied
  const isSettingApplied =
    exportSettings.includePhoto ||
    exportSettings.dateFrom ||
    exportSettings.dateTo;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Button
        onClick={toggleExportContainer}
        className="flex items-center gap-2"
      >
        {loading ? (
          <span className="animate-spin mr-2">
            <LoaderCircle className="h-4 w-4" />
          </span>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Export
            {isSettingApplied && (
              <Badge variant="secondary" className="ml-1">
                {Object.values(exportSettings).filter(Boolean).length}
              </Badge>
            )}
          </>
        )}
      </Button>

      {isExportOpen && (
        <Card className="absolute right-12 mt-2 p-4 max-h-[80vh] overflow-y-auto z-50 shadow-lg w-[300px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Export Settings</h3>
              {isSettingApplied && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearExportSettings}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Include Photo Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-photo"
                checked={exportSettings.includePhoto}
                onCheckedChange={(checked) =>
                  updateExportSettings("includePhoto", checked as boolean)
                }
              />
              <Label htmlFor="include-photo">Include Photo</Label>
            </div>

            {/* Date Range Picker */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <p className="text-red-600 text-sm">
                Date range cannot exceed 6 months
              </p>
              <div className="flex flex-col gap-2">
                <div>
                  <Label
                    htmlFor="date-from"
                    className="text-xs text-muted-foreground"
                  >
                    From
                  </Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={exportSettings.dateFrom}
                    onChange={(e) =>
                      updateExportSettings("dateFrom", e.target.value)
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="date-to"
                    className="text-xs text-muted-foreground"
                  >
                    To
                  </Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={exportSettings.dateTo}
                    onChange={(e) =>
                      updateExportSettings("dateTo", e.target.value)
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Export Button */}
            <Button onClick={initiateExport} className="w-full">
              Export
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
