import { useApiClient } from "@easymotion/auth-context";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";

export interface UseDebouncedSearchProps {
  query: string;
}

export const useDebouncedSearch = (props: UseDebouncedSearchProps) => {
  const { query } = props;
  const debouncedQuery = useDebounce(query, 300);

  const { apiClient } = useApiClient();

  return useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () =>
      apiClient.search.searchControllerSearchAll({ query: debouncedQuery }),
    enabled: debouncedQuery.length > 0,
  });
};
