"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  DotsThree,
  Pencil,
  Trash,
  Stack,
  SpinnerGap,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useModules,
  useCreateModule,
  useUpdateModule,
  useDeleteModule,
  type Module,
  type ModuleStatus,
} from "@/services/modules";

const moduleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

const STATUS_VARIANTS: Record<ModuleStatus, "default" | "secondary"> = {
  published: "default",
  draft: "secondary",
};

export default function ModulesPage() {
  const { t } = useTranslation();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editModule, setEditModule] = useState<Module | null>(null);
  const [deleteModule, setDeleteModule] = useState<Module | null>(null);

  const { data, isLoading } = useModules();
  const createMutation = useCreateModule();
  const updateMutation = useUpdateModule();
  const deleteMutation = useDeleteModule();

  const form = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (editModule) {
      form.reset({
        title: editModule.title,
        description: editModule.description ?? "",
        status: editModule.status,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        status: "draft",
      });
    }
  }, [editModule, form]);

  const handleOpenCreate = () => {
    setEditModule(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (module: Module) => {
    setEditModule(module);
    setEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setEditorOpen(false);
    setEditModule(null);
    form.reset();
  };

  const handleSubmit = (values: ModuleFormData) => {
    if (editModule) {
      updateMutation.mutate(
        { id: editModule.id, ...values },
        { onSuccess: handleCloseEditor }
      );
    } else {
      createMutation.mutate(values, { onSuccess: handleCloseEditor });
    }
  };

  const handleDelete = () => {
    if (!deleteModule) return;
    deleteMutation.mutate(deleteModule.id, {
      onSuccess: () => setDeleteModule(null),
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const modules = data?.modules ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("modules.title")}</h1>
          <p className="text-muted-foreground">{t("modules.description")}</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="size-4" />
          {t("modules.create.button")}
        </Button>
      </div>

      {isLoading ? (
        <ModulesTableSkeleton />
      ) : modules.length === 0 ? (
        <EmptyState onCreateClick={handleOpenCreate} />
      ) : (
        <div className="rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t("modules.columns.title")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t("modules.columns.items")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t("modules.columns.status")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t("modules.columns.createdAt")}
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{module.title}</div>
                      {module.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {module.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="gap-1">
                      <Stack className="size-3" />
                      {module.itemsCount}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANTS[module.status]}>
                      {t(`modules.statuses.${module.status}`)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(module.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-md hover:bg-accent">
                        <DotsThree className="size-5" weight="bold" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEdit(module)}>
                          <Pencil className="mr-2 size-4" />
                          {t("common.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteModule(module)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 size-4" />
                          {t("common.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={editorOpen} onOpenChange={(open) => !open && handleCloseEditor()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editModule ? t("modules.edit.title") : t("modules.create.title")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("modules.fields.title")}</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder={t("modules.fields.titlePlaceholder")}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("modules.fields.description")}</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("modules.columns.status")}</Label>
              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{t("modules.statuses.draft")}</SelectItem>
                      <SelectItem value="published">{t("modules.statuses.published")}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseEditor}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <SpinnerGap className="mr-2 size-4 animate-spin" />}
                {editModule ? t("common.save") : t("common.create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteModule} onOpenChange={(open) => !open && setDeleteModule(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("modules.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("modules.delete.description", { name: deleteModule?.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <SpinnerGap className="mr-2 size-4 animate-spin" />
              )}
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Stack className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{t("modules.empty.title")}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("modules.empty.description")}
      </p>
      <Button onClick={onCreateClick} className="mt-4 gap-2">
        <Plus className="size-4" />
        {t("modules.create.button")}
      </Button>
    </div>
  );
}

function ModulesTableSkeleton() {
  return (
    <div className="rounded-lg border border-border">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left"><Skeleton className="h-4 w-20" /></th>
            <th className="px-4 py-3 text-left"><Skeleton className="h-4 w-16" /></th>
            <th className="px-4 py-3 text-left"><Skeleton className="h-4 w-16" /></th>
            <th className="px-4 py-3 text-left"><Skeleton className="h-4 w-24" /></th>
            <th className="w-12 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </td>
              <td className="px-4 py-3"><Skeleton className="h-5 w-12" /></td>
              <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
              <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
              <td className="px-4 py-3"><Skeleton className="size-8" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
