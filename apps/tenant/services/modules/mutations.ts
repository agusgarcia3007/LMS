import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ModulesService, QUERY_KEYS, type CreateModuleRequest, type UpdateModuleRequest } from "./service";

export function useCreateModule() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateModuleRequest) => ModulesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES });
      toast.success(t("modules.create.success"));
    },
  });
}

export function useUpdateModule() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: UpdateModuleRequest) => ModulesService.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES });
      toast.success(t("modules.edit.success"));
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => ModulesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES });
      toast.success(t("modules.delete.success"));
    },
  });
}
