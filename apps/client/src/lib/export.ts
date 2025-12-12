import Papa from "papaparse";
import * as XLSX from "xlsx";

export type ExportColumn<T> = {
  key: string;
  header: string;
  accessor?: (row: T) => string | number | boolean | null | undefined;
};

function getValueFromRow<T>(row: T, column: ExportColumn<T>): string {
  if (column.accessor) {
    const value = column.accessor(row);
    return value !== null && value !== undefined ? String(value) : "";
  }

  const keys = column.key.split(".");
  let value: unknown = row;

  for (const key of keys) {
    if (value === null || value === undefined) return "";
    value = (value as Record<string, unknown>)[key];
  }

  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

export function toCSV<T>(data: T[], columns: ExportColumn<T>[]): string {
  const headers = columns.map((col) => col.header);
  const rows = data.map((row) =>
    columns.map((col) => getValueFromRow(row, col))
  );

  return Papa.unparse({
    fields: headers,
    data: rows,
  });
}

export function toExcel<T>(data: T[], columns: ExportColumn<T>[]): Blob {
  const headers = columns.map((col) => col.header);
  const rows = data.map((row) =>
    columns.map((col) => getValueFromRow(row, col))
  );

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  const columnWidths = columns.map((col, i) => {
    const maxLength = Math.max(
      col.header.length,
      ...rows.map((row) => String(row[i]).length)
    );
    return { wch: Math.min(maxLength + 2, 50) };
  });
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  return new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function downloadFile(
  content: Blob | string,
  filename: string,
  type?: string
): void {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV<T>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string
): void {
  const csv = toCSV(data, columns);
  downloadFile(csv, `${filename}.csv`, "text/csv;charset=utf-8;");
}

export function exportToExcel<T>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string
): void {
  const blob = toExcel(data, columns);
  downloadFile(blob, `${filename}.xlsx`);
}
