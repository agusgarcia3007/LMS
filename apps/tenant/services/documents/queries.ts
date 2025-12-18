import { useQuery } from "@tanstack/react-query";
import { DocumentsService, QUERY_KEYS, type DocumentListParams } from "./service";

export function useDocuments(params: DocumentListParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.DOCUMENTS_LIST(params),
    queryFn: () => DocumentsService.list(params),
  });
}
