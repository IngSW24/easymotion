import { useApiClient } from "@easymotion/auth-context";
import { useQuery } from "@tanstack/react-query";

export const usePhysiotherapistProfile = (id: string) => {
  const { apiClient } = useApiClient();
  return useQuery({
    queryKey: ["physiotherapistProfile", id],
    queryFn: () => apiClient.users.usersControllerFindPhysiotherapist(id),
    enabled: !!id,
  });
};
