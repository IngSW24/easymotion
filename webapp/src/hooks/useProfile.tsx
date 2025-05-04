import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@easymotion/auth-context";
import { useApiClient } from "@easymotion/auth-context";
import { AuthUserDto, UpdateAuthUserDto } from "@easymotion/openapi";
import { useSnack } from "./useSnack";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { apiClient } = useApiClient();
  const { user, logout, updateUser } = useAuth();
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
    onSuccess: (d: AuthUserDto) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", user?.id ?? ""],
      });
      updateUser(d);
    },
    onError: (error) => snack.showError(error),
  });

  const updatePhysiotherapistData = useMutation({
    mutationFn: async (data: UpdateAuthUserDto["physiotherapistData"]) => {
      const response = await apiClient.auth.authControllerUpdateUserProfile({
        physiotherapistData: data,
      });
      return response.data;
    },
    onSuccess: (d: AuthUserDto) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", user?.id ?? ""],
      });
      updateUser(d);
    },
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

  return { get, update, remove, updatePhysiotherapistData };
};
