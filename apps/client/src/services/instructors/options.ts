import {
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { i18n } from "@/i18n";
import {
  InstructorsService,
  QUERY_KEYS,
  type InstructorListParams,
  type InviteInstructorRequest,
  type UpdateInstructorRequest,
  type PromoteInstructorRequest,
} from "./service";

export const instructorsListOptions = (params: InstructorListParams = {}) =>
  queryOptions({
    queryFn: () => InstructorsService.list(params),
    queryKey: QUERY_KEYS.INSTRUCTORS_LIST(params),
  });

export const instructorOptions = (id: string) =>
  queryOptions({
    queryFn: () => InstructorsService.getById(id),
    queryKey: QUERY_KEYS.INSTRUCTOR(id),
    enabled: !!id,
  });

export const useInviteInstructorOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: (payload: InviteInstructorRequest) =>
      InstructorsService.invite(payload),
    onSuccess: (data) => {
      if (!data.userExists) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INSTRUCTORS });
        toast.success(i18n.t("instructors.invite.success"));
      }
    },
  });
};

export const usePromoteInstructorOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: (payload: PromoteInstructorRequest) =>
      InstructorsService.promote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INSTRUCTORS });
      toast.success(i18n.t("instructors.promote.success"));
    },
  });
};

export const useUpdateInstructorOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: ({
      id,
      ...payload
    }: { id: string } & UpdateInstructorRequest) =>
      InstructorsService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INSTRUCTORS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INSTRUCTOR(id) });
      toast.success(i18n.t("instructors.edit.success"));
    },
  });
};

export const useDeleteInstructorOptions = () => {
  const queryClient = useQueryClient();
  return mutationOptions({
    mutationFn: InstructorsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INSTRUCTORS });
      toast.success(i18n.t("instructors.delete.success"));
    },
  });
};
