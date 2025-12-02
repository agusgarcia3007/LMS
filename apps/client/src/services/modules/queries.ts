import { useQuery } from "@tanstack/react-query";
import { modulesListOptions, moduleOptions } from "./options";
import type { ModuleListParams } from "./service";

export const useGetModules = (
  params: ModuleListParams = {},
  options?: { enabled?: boolean }
) => useQuery({ ...modulesListOptions(params), ...options });

export const useGetModule = (
  id: string,
  options?: { enabled?: boolean }
) => useQuery({ ...moduleOptions(id), ...options });
