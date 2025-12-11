import { QueryClient } from "@tanstack/react-query";
import { catchAxiosError } from "./utils";

let queryClient: QueryClient | null = null;

export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 10,
        },
        mutations: {
          onError: catchAxiosError,
        },
      },
    });
  }
  return queryClient;
}
