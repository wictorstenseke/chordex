import { useState } from "react";

import { Download } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { exportLibrary } from "@/lib/export";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ExportButton = () => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!user?.uid || isExporting) return;
    setIsExporting(true);
    try {
      const blob = await exportLibrary(user.uid);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chordex-library-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  if (!user?.uid) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleExport}
          disabled={isExporting}
          aria-label="Export library"
        >
          <Download className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Export library</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{isExporting ? "Exporting..." : "Export library as ZIP"}</p>
      </TooltipContent>
    </Tooltip>
  );
};
