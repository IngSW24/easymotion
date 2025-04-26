import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import ImageEditor from "../../editors/ImageEditor/ImageEditor";
import { useAuth } from "@easymotion/auth-context";

interface AvatarUploadDialogProps {
  open: boolean;
  onClose: () => void;
  avatarUrl?: string;
}

export default function AvatarUploadDialog({
  open,
  onClose,
  avatarUrl,
}: AvatarUploadDialogProps) {
  const auth = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageReady = async (file: File) => {
    setIsUploading(true);
    setImageError(false);

    try {
      await auth.updateProfilePicture(file);
    } catch (err) {
      console.error("Error uploading image:", err);
      setImageError(true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Aggiorna immagine del profilo
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Carica una nuova immagine del profilo. L'immagine sarà ritagliata in
          forma circolare.
        </Typography>
        <ImageEditor
          initialImageUrl={avatarUrl}
          aspectRatio={1} // Circular aspect ratio
          onImageReady={(file) => handleImageReady(file)}
          maxFileSize={5 * 1024 * 1024} // 5MB
          allowedFileTypes={["image/jpeg", "image/png"]}
        />
        {imageError && !isUploading && (
          <Box sx={{ mt: 2 }}>
            <Typography color="error">
              Si è verificato un errore durante il caricamento dell'immagine.
            </Typography>
          </Box>
        )}
        {isUploading && (
          <Box display="flex" alignItems="center" gap={1} mt={2}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Caricamento in corso...
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isUploading}>
          Chiudi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
