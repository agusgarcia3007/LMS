import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Check, Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonArrow } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetCategories, useCreateCategory } from "@/services/categories";

interface CategoryComboboxProps {
  value?: string | null;
  onChange: (categoryId: string | null) => void;
  disabled?: boolean;
}

export function CategoryCombobox({
  value,
  onChange,
  disabled = false,
}: CategoryComboboxProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const { data, isLoading } = useGetCategories({
    limit: 100,
    search: search || undefined,
  });
  const createMutation = useCreateCategory();

  const categories = data?.categories ?? [];
  const selectedCategory = categories.find((c) => c.id === value);

  const handleSelect = useCallback(
    (categoryId: string) => {
      onChange(categoryId === value ? null : categoryId);
      setOpen(false);
      setSearch("");
    },
    [onChange, value]
  );

  const handleCreate = useCallback(async () => {
    if (!newName.trim()) return;

    createMutation.mutate(
      { name: newName.trim() },
      {
        onSuccess: (data) => {
          onChange(data.category.id);
          setIsCreating(false);
          setNewName("");
          setOpen(false);
        },
      }
    );
  }, [newName, createMutation, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newName.trim()) {
      e.preventDefault();
      handleCreate();
    }
    if (e.key === "Escape") {
      setIsCreating(false);
      setNewName("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          mode="input"
          placeholder={!value}
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          {selectedCategory ? (
            <Badge variant="secondary" appearance="outline">
              {selectedCategory.name}
            </Badge>
          ) : (
            <span className="text-muted-foreground">
              {t("courses.form.categoryPlaceholder")}
            </span>
          )}
          <ButtonArrow />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popper-anchor-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={t("courses.form.searchCategory")}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <ScrollArea className="max-h-[200px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : categories.length === 0 ? (
                <CommandEmpty>{t("courses.form.noCategories")}</CommandEmpty>
              ) : (
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.id}
                      onSelect={handleSelect}
                    >
                      <Badge variant="secondary" appearance="outline">
                        {category.name}
                      </Badge>
                      {value === category.id && (
                        <Check className="ml-auto size-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </ScrollArea>
          </CommandList>
          <CommandSeparator />
          <CommandGroup>
            {isCreating ? (
              <div className="flex items-center gap-2 p-1">
                <Input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("courses.form.categoryName")}
                  className="h-8"
                  disabled={createMutation.isPending}
                />
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={!newName.trim() || createMutation.isPending}
                  isLoading={createMutation.isPending}
                >
                  {t("common.add")}
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start font-normal px-2"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="size-4" />
                {t("courses.form.createCategory")}
              </Button>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
