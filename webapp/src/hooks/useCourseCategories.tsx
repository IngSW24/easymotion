import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@easymotion/auth-context";
import { useSnack } from "./useSnack";

type UseCategoryProps = {
  fetchId?: string;
  page?: number;
  perPage?: number;
};

export const useCourseCategory = (props: UseCategoryProps = {}) => {
  const { fetchId = "" } = props;
  const { apiClient: api } = useApiClient();
  const snack = useSnack();
  const queryClient = useQueryClient();

  const getAll = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.categories.categoriesControllerFindAll();
      return response.data;
    },
  });

  const getSingle = useQuery({
    queryKey: ["categories", { fetchId }],
    queryFn: async () => {
      const response =
        await api.categories.categoriesControllerFindOne(fetchId);
      return response.data;
    },
    enabled: fetchId !== "",
  });

  const create = useMutation({
    mutationFn: async (categoryData: any) => {
      const response =
        await api.categories.categoriesControllerCreate(categoryData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      snack.showSuccess("La categoria è stata aggiunta");
    },
    onError: () => {
      snack.showError(
        "Si è verificato un errore: non è stato possibile creare la categoria"
      );
    },
  });

  const update = useMutation({
    mutationFn: async ({
      categoryId,
      categoryData,
    }: {
      categoryId: string;
      categoryData: any;
    }) => {
      const response = await api.categories.categoriesControllerUpdate(
        categoryId,
        categoryData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      snack.showSuccess("La categoria è stata aggiornata con successo");
    },
    onError: () => {
      snack.showError("Non è stato possible aggiornare la categoria");
    },
  });

  const remove = useMutation({
    mutationFn: async (categoryId: string) => {
      await api.categories.categoriesControllerRemove(categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      snack.showSuccess("Category eliminata con successo");
    },
    onError: () => {
      snack.showError("Non è stato possibile eliminare la categoria");
    },
  });

  return {
    getAll,
    getSingle,
    create,
    update,
    remove,
  };
};
