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
  FileText,
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
  useDocuments,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  type Document,
  type DocumentStatus,
} from "@/services/documents";

const documentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

type DocumentFormData = z.infer<typeof documentSchema>;

const STATUS_VARIANTS: Record<DocumentStatus, "default" | "secondary"> = {
  published: "default",
  draft: "secondary",
};

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const { t } = useTranslation();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editDocument, setEditDocument] = useState<Document | null>(null);
  const [deleteDocument, setDeleteDocument] = useState<Document | null>(null);

  const { data, isLoading } = useDocuments();
  const createMutation = useCreateDocument();
  const updateMutation = useUpdateDocument();
  const deleteMutation = useDeleteDocument();

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (editDocument) {
      form.reset({
        title: editDocument.title,
        description: editDocument.description ?? "",
        status: editDocument.status,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        status: "draft",
      });
    }
  }, [editDocument, form]);

  const handleOpenCreate = () => {
    setEditDocument(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (document: Document) => {
    setEditDocument(document);
    setEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setEditorOpen(false);
    setEditDocument(null);
    form.reset();
  };

  const handleSubmit = (values: DocumentFormData) => {
    if (editDocument) {
      updateMutation.mutate(
        { id: editDocument.id, ...values },
        { onSuccess: handleCloseEditor }
      );
    } else {
      createMutation.mutate(values, { onSuccess: handleCloseEditor });
    }
  };

  const handleDelete = () => {
    if (!deleteDocument) return;
    deleteMutation.mutate(deleteDocument.id, {
      onSuccess: () => setDeleteDocument(null),
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const documents = data?.documents ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("documents.title")}</h1>
          <p className="text-muted-foreground">{t("documents.description")}</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="size-4" />
          {t("documents.create.button")}
        </Button>
      </div>

      {isLoading ? (
        <DocumentsTableSkeleton />
      ) : documents.length === 0 ? (
        <EmptyState onCreateClick={handleOpenCreate} />
      ) : (
        <div className="rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t("documents.columns.title")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t("documents.columns.file")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t("documents.columns.status")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t("documents.columns.createdAt")}
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr key={document.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{document.title}</div>
                      {document.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {document.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {document.fileName ? (
                      <div className="text-sm">
                        <div className="text-muted-foreground truncate max-w-[150px]">
                          {document.fileName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(document.fileSize)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANTS[document.status]}>
                      {t(`documents.statuses.${document.status}`)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(document.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-md hover:bg-accent">
                        <DotsThree className="size-5" weight="bold" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEdit(document)}>
                          <Pencil className="mr-2 size-4" />
                          {t("common.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteDocument(document)}
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
              {editDocument ? t("documents.edit.title") : t("documents.create.title")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("documents.form.title")}</Label>
              <Input
                id="title"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("documents.form.description")}</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("documents.form.status")}</Label>
              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{t("documents.statuses.draft")}</SelectItem>
                      <SelectItem value="published">{t("documents.statuses.published")}</SelectItem>
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
                {editDocument ? t("common.save") : t("common.create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteDocument} onOpenChange={(open) => !open && setDeleteDocument(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("documents.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("documents.delete.description", { name: deleteDocument?.title })}
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
        <FileText className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{t("documents.empty.title")}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("documents.empty.description")}
      </p>
      <Button onClick={onCreateClick} className="mt-4 gap-2">
        <Plus className="size-4" />
        {t("documents.create.button")}
      </Button>
    </div>
  );
}

function DocumentsTableSkeleton() {
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
              <td className="px-4 py-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </td>
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
