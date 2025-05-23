import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@easymotion/auth-context";
import { useSnack } from "./useSnack";

interface UseCourseImageUploadOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useCourseImageUpload(
  options: UseCourseImageUploadOptions = {}
) {
  const { apiClient } = useApiClient();
  const queryClient = useQueryClient();
  const snack = useSnack();

  return useMutation({
    mutationFn: ({ courseId, file }: { courseId: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);

      return apiClient.courses.coursesControllerUploadCoursePicture(courseId, {
        file,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      snack.showSuccess("Immagine caricata con successo!");
      options.onSuccess?.();
    },
    onError: (error) => {
      snack.showError(
        "Si è verificato un errore durante il caricamento dell'immagine."
      );
      options.onError?.(error);
    },
  });
}
