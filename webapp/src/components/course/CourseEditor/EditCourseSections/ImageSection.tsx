import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useCourseImageUpload } from "../../../../hooks/useCourseImageUpload";
import ImageEditor from "../../../editors/ImageEditor/ImageEditor";
import { useFormContext } from "react-hook-form";
import { CourseFormData } from "../schema";
import { DateTime } from "luxon";

const getStaticUrl = (courseId: string) => {
  const timestamp = DateTime.now().toMillis();
  return `${import.meta.env.VITE_STATIC_URL}/course/${courseId}?t=${timestamp}`;
};

export interface ImageSectionProps {}

export default function ImageSection() {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const { watch } = useFormContext<CourseFormData>();
  const courseId = watch("id");

  const uploadImage = useCourseImageUpload();

  // Determine the initial course image URL if available
  useEffect(() => {
    if (!courseId) return;

    const abortController = new AbortController();
    setImageError(false);

    const prefetchUrl = async () => {
      const url = getStaticUrl(courseId);
      try {
        await fetch(url, {
          method: "HEAD",
          signal: abortController?.signal,
          mode: "no-cors",
        });

        setPreviewUrl(url);
        setImageError(false);
      } catch (error) {
        setPreviewUrl(null);
        setImageError(true);
      }
    };

    prefetchUrl();

    return () => abortController.abort();
  }, [courseId]);

  const handleImageReady = async (file: File) => {
    if (!courseId) {
      return;
    }

    setIsUploading(true);
    setImageError(false);

    try {
      await uploadImage.mutateAsync({ courseId, file });
      // After successful upload, update the preview URL with a new timestamp to force reload
      setPreviewUrl(getStaticUrl(courseId));
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
            L'immagine apparirà nelle pagine del corso. Si consiglia di
            utilizzare un'immagine con proporzioni 16:9.
          </Typography>

          <ImageEditor
            initialImageUrl={previewUrl || undefined}
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
