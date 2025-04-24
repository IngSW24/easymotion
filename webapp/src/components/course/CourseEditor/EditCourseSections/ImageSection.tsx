import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useMemo, useState } from "react";
import { useCourseImageUpload } from "../../../../hooks/useCourseImageUpload";
import ImageEditor from "../../../editors/ImageEditor/ImageEditor";
import { useFormContext } from "react-hook-form";
import { CourseFormData } from "../schema";
import { CourseDto } from "@easymotion/openapi";
import { getCourseImageUrl } from "../../../../utils/format";

export interface ImageSectionProps {
  course: CourseDto | null | undefined;
}

export default function ImageSection(props: ImageSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { watch } = useFormContext<CourseFormData>();
  const courseId = watch("id");

  const courseImageUrl = useMemo(() => {
    return props.course?.image_path
      ? getCourseImageUrl({ course: props.course })
      : undefined;
  }, [props.course]);

  const uploadImage = useCourseImageUpload();

  const handleImageReady = async (file: File) => {
    if (!courseId) {
      return;
    }

    setIsUploading(true);
    setImageError(false);

    try {
      await uploadImage.mutateAsync({ courseId, file });
    } catch (err) {
      console.error("Error uploading image:", err);
      setImageError(true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {!courseId && (
        <Alert severity="info">
          È necessario salvare il corso prima di poter caricare un'immagine
        </Alert>
      )}

      {courseId && (
        <>
          <Typography variant="body1" color="text.secondary">
            L'immagine apparirà nelle pagine del corso.
          </Typography>

          <ImageEditor
            initialImageUrl={courseImageUrl}
            aspectRatio={16 / 9} // 16:9 aspect ratio
            onImageReady={(file) => handleImageReady(file)}
            maxFileSize={5 * 1024 * 1024} // 5MB
            allowedFileTypes={["image/jpeg", "image/png"]}
          />

          {imageError && !isUploading && (
            <Alert severity="warning">
              Non è stato possibile caricare l'immagine del corso. Prova a
              caricarla nuovamente.
            </Alert>
          )}

          {isUploading && (
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Caricamento in corso...
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
