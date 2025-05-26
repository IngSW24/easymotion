import { useApiClient } from "@easymotion/auth-context";
import { useQuery } from "@tanstack/react-query";

export const usePatientProfile = (id: string) => {
  const { apiClient } = useApiClient();
  return useQuery({
    queryKey: ["patientProfile", id],
    queryFn: () => apiClient.users.usersControllerFindPatient(id),
    enabled: !!id,
  });
};
