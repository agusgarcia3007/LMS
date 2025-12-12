import { useState, useCallback, useMemo } from "react";
import type { RowSelectionState, OnChangeFn } from "@tanstack/react-table";

type UseBulkSelectionConfig<T> = {
  data: T[];
  getRowId: (row: T) => string;
};

type UseBulkSelectionReturn<T> = {
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  selectedRows: T[];
  selectedIds: string[];
  selectedCount: number;
  hasSelection: boolean;
  clearSelection: () => void;
  selectAll: () => void;
};

export function useBulkSelection<T>({
  data,
  getRowId,
}: UseBulkSelectionConfig<T>): UseBulkSelectionReturn<T> {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection]
  );

  const selectedRows = useMemo(() => {
    const idSet = new Set(selectedIds);
    return data.filter((row) => idSet.has(getRowId(row)));
  }, [data, selectedIds, getRowId]);

  const selectedCount = selectedIds.length;
  const hasSelection = selectedCount > 0;

  const clearSelection = useCallback(() => {
    setRowSelection({});
  }, []);

  const selectAll = useCallback(() => {
    const newSelection: RowSelectionState = {};
    data.forEach((row) => {
      newSelection[getRowId(row)] = true;
    });
    setRowSelection(newSelection);
  }, [data, getRowId]);

  return {
    rowSelection,
    onRowSelectionChange: setRowSelection,
    selectedRows,
    selectedIds,
    selectedCount,
    hasSelection,
    clearSelection,
    selectAll,
  };
}
