import { useState, useCallback } from "react";
import {
  type ExportColumn,
  exportToCSV as exportCSV,
  exportToExcel as exportExcel,
} from "@/lib/export";

type UseExportConfig<T> = {
  data: T[];
  columns: ExportColumn<T>[];
  filename: string;
};

type UseExportReturn = {
  exportToCSV: () => void;
  exportToExcel: () => void;
  exportSelectedToCSV: <T>(selectedData: T[]) => void;
  exportSelectedToExcel: <T>(selectedData: T[]) => void;
  isExporting: boolean;
};

export function useExport<T>({
  data,
  columns,
  filename,
}: UseExportConfig<T>): UseExportReturn {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = useCallback(() => {
    setIsExporting(true);
    try {
      exportCSV(data, columns, filename);
    } finally {
      setIsExporting(false);
    }
  }, [data, columns, filename]);

  const exportToExcel = useCallback(() => {
    setIsExporting(true);
    try {
      exportExcel(data, columns, filename);
    } finally {
      setIsExporting(false);
    }
  }, [data, columns, filename]);

  const exportSelectedToCSV = useCallback(
    <U>(selectedData: U[]) => {
      setIsExporting(true);
      try {
        exportCSV(selectedData, columns as ExportColumn<U>[], filename);
      } finally {
        setIsExporting(false);
      }
    },
    [columns, filename]
  );

  const exportSelectedToExcel = useCallback(
    <U>(selectedData: U[]) => {
      setIsExporting(true);
      try {
        exportExcel(selectedData, columns as ExportColumn<U>[], filename);
      } finally {
        setIsExporting(false);
      }
    },
    [columns, filename]
  );

  return {
    exportToCSV,
    exportToExcel,
    exportSelectedToCSV,
    exportSelectedToExcel,
    isExporting,
  };
}
