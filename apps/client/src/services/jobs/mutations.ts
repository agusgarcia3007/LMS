import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cleanupJobs } from "./service";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useCleanupJobs() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: cleanupJobs,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success(t("backoffice.jobs.cleanupSuccess", { count: data.deletedCount }));
    },
  });
}
