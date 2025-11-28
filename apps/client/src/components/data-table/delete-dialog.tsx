import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmValue: string;
  onConfirm: () => void;
  isPending?: boolean;
};

export function DeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  confirmValue,
  onConfirm,
  isPending,
}: DeleteDialogProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");

  const isConfirmDisabled = inputValue !== confirmValue || isPending;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setInputValue("");
    }
    onOpenChange(open);
  };

  const handleConfirm = () => {
    if (inputValue === confirmValue) {
      onConfirm();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="confirm-input">
            {confirmLabel ?? t("common.typeToConfirm", { value: confirmValue })}
          </Label>
          <Input
            id="confirm-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={confirmValue}
            autoComplete="off"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("common.cancel")}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            isLoading={isPending}
          >
            {t("common.delete")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
