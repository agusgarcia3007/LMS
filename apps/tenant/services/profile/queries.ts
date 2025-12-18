"use client";

import { useQuery, queryOptions } from "@tanstack/react-query";
import { ProfileService, QUERY_KEYS } from "./service";
import { isClient } from "@/lib/utils";

export const profileOptions = () =>
  queryOptions({
    queryFn: ProfileService.get,
    queryKey: QUERY_KEYS.PROFILE,
    enabled: isClient() && !!localStorage.getItem("accessToken"),
    retry: false,
  });

export const useGetProfile = () => useQuery(profileOptions());
