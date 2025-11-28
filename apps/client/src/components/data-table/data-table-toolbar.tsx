import { useCallback, useState, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DataTableToolbarProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
  actions?: ReactNode;
};

export function DataTableToolbar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder,
  children,
  actions,
}: DataTableToolbarProps) {
  const { t } = useTranslation();
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      onSearchChange?.(value);
    },
    [onSearchChange]
  );

  const clearSearch = useCallback(() => {
    setLocalSearch("");
    onSearchChange?.("");
  }, [onSearchChange]);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-1">
        {onSearchChange && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder ?? t("dataTable.search")}
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 w-64"
            />
            {localSearch && (
              <Button
                mode="icon"
                variant="ghost"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={clearSearch}
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>
        )}
        {children}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
