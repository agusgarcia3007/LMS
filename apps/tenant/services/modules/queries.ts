import { useQuery } from "@tanstack/react-query";
import { ModulesService, QUERY_KEYS, type ModuleListParams } from "./service";

export function useModules(params: ModuleListParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.MODULES_LIST(params),
    queryFn: () => ModulesService.list(params),
  });
}
