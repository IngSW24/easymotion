import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useApiClient } from "./useApiClient";
import { UpdateAuthUserDto } from "../client/Api";
import { useSnack } from "./useSnack";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { apiClient } = useApiClient();
  const { user, logout } = useAuth();
  const snack = useSnack();

  const get = useQuery({
    queryKey: ["profile", user?.id ?? ""],
    queryFn: async () => {
      const response = await apiClient.auth.authControllerGetUserProfile();
      return response.data;
    },
  });

  const update = useMutation({
    mutationFn: async (data: UpdateAuthUserDto) => {
      const response =
        await apiClient.auth.authControllerUpdateUserProfile(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", user?.id ?? ""],
      });
    },
    onError: (error) => snack.showError(error),
  });

  const remove = useMutation({
    mutationFn: async () => {
      await apiClient.auth.authControllerDeleteUserProfile();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", user?.id ?? ""],
      });
      logout();
    },
  });

  return { get, update, remove };
};
