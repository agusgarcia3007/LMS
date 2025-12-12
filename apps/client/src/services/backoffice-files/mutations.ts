import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS, updateBackofficeTenant } from "./service";

export function useUpdateBackofficeTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateBackofficeTenant>[1] }) =>
      updateBackofficeTenant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tenants() });
    },
  });
}
