import { useQuery } from "@tanstack/react-query";
import { usersListOptions, userOptions } from "./options";
import type { UserListParams } from "./service";

export const useGetUsers = (params: UserListParams = {}) =>
  useQuery(usersListOptions(params));

export const useGetUser = (id: string) => useQuery(userOptions(id));
