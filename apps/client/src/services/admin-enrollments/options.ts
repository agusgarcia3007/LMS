import {
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { i18n } from "@/i18n";
import {
  AdminEnrollmentsService,
  QUERY_KEYS,
  type AdminEnrollmentListParams,
  type CreateEnrollmentRequest,
  type BulkEnrollRequest,
  type UpdateStatusRequest,
} from "./service";

export const adminEnrollmentsListOptions = (
  params: AdminEnrollmentListParams = {}
) =>
  queryOptions({
    queryFn: () => AdminEnrollmentsService.list(params),
    queryKey: QUERY_KEYS.ADMIN_ENROLLMENTS_LIST(params),
  });

export const adminEnrollmentOptions = (id: string) =>
  queryOptions({
    queryFn: () => AdminEnrollmentsService.getById(id),
    queryKey: QUERY_KEYS.ADMIN_ENROLLMENT(id),
    enabled: !!id,
  });

export const useCreateEnrollmentOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: (payload: CreateEnrollmentRequest) =>
      AdminEnrollmentsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ADMIN_ENROLLMENTS,
      });
      toast.success(i18n.t("dashboard.enrollments.enroll.success"));
    },
  });
};

export const useBulkEnrollOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: (payload: BulkEnrollRequest) =>
      AdminEnrollmentsService.bulkCreate(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ADMIN_ENROLLMENTS,
      });
      toast.success(
        i18n.t("dashboard.enrollments.enroll.bulkSuccess", {
          count: data.created,
        })
      );
    },
  });
};

export const useUpdateEnrollmentStatusOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({
      id,
      ...payload
    }: { id: string } & UpdateStatusRequest) =>
      AdminEnrollmentsService.updateStatus(id, payload),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ADMIN_ENROLLMENTS,
      });
      const key =
        status === "cancelled"
          ? "dashboard.enrollments.cancel.success"
          : "dashboard.enrollments.reactivate.success";
      toast.success(i18n.t(key));
    },
  });
};
