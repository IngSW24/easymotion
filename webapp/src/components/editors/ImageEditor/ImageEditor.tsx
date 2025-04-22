import { useState, useRef, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
} from "@mui/material";
import { CloudUpload, Close, Save } from "@mui/icons-material";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export interface ImageEditorProps {
  /**
   * Initial image URL (if editing an existing image)
   */
  initialImageUrl?: string;

  /**
   * Aspect ratio for crop (width/height), e.g. 1 for square, 16/9 for widescreen
   * If not provided, free-form cropping is allowed
   */
  aspectRatio?: number;

  /**
   * Maximum file size in bytes
   * Default: 5MB
   */
  maxFileSize?: number;

  /**
   * Allowed file types
   * Default: ['image/jpeg', 'image/png', 'image/gif']
   */
  allowedFileTypes?: string[];

  /**
   * Callback when image is uploaded and cropped
   * @param file The cropped image as a File object
   * @param dataUrl The cropped image as a data URL
   */
  onImageReady?: (file: File, dataUrl: string) => void;

  /**
   * Width the component should take
   * Default: 100%
   */
  width?: string | number;

  /**
   * Height the component should take
   * Default: auto
   */
  height?: string | number;
}

const DEFAULT_ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageEditor({
  initialImageUrl,
  aspectRatio,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  allowedFileTypes = DEFAULT_ALLOWED_FILE_TYPES,
  onImageReady,
  width = "100%",
  height = "auto",
}: ImageEditorProps) {
  const theme = useTheme();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);

  // Handle initial image URL
  useEffect(() => {
    if (initialImageUrl) {
      setImagePreview(initialImageUrl);
      setImageLoadError(false);
    } else {
      setImagePreview(null);
    }
  }, [initialImageUrl]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setImageLoadError(false);

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!allowedFileTypes.includes(file.type)) {
        setError(
          `Il tipo ${file.type} non è supportato. Tipi supportati: ${allowedFileTypes.join(", ")}`
        );
        return;
      }

      if (file.size > maxFileSize) {
        setError(
          `La dimensione del file supera il massimo consentito di ${
            maxFileSize / (1024 * 1024)
          }MB`
        );
        return;
      }

      setOriginalFile(file);
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        setIsCropDialogOpen(true);
      });

      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;

      // Initialize with centered crop
      let initialCrop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 90,
          },
          aspectRatio || width / height,
          width,
          height
        ),
        width,
        height
      );

      setCrop(initialCrop);
    },
    [aspectRatio]
  );

  const handleImageError = useCallback(() => {
    setImageLoadError(true);
  }, []);

  const generateCroppedImage = useCallback(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return;

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob || !originalFile) return;

        const croppedImageUrl = URL.createObjectURL(blob);

        // Create a new File from the blob
        const croppedFile = new File([blob], originalFile.name, {
          type: originalFile.type,
        });

        if (onImageReady) {
          onImageReady(croppedFile, croppedImageUrl);
        }

        setImagePreview(croppedImageUrl);
        resolve(croppedImageUrl);
      }, originalFile?.type);
    });
  }, [completedCrop, originalFile, onImageReady]);

  const handleCropComplete = useCallback((crop: Crop) => {
    setCompletedCrop(crop);
  }, []);

  const handleSaveCrop = useCallback(async () => {
    await generateCroppedImage();
    setIsCropDialogOpen(false);
  }, [generateCroppedImage]);

  const handleTriggerFileInput = () => {
    inputRef.current?.click();
  };

  const handleCloseCropDialog = () => {
    setIsCropDialogOpen(false);

    // If we're uploading for the first time and cancel, clear the preview
    if (!initialImageUrl && imagePreview) {
      setImagePreview(initialImageUrl || null);
      setOriginalFile(null);
    }
  };

  return (
    <Box sx={{ width, height }}>
      <input
        type="file"
        accept={allowedFileTypes.join(",")}
        onChange={onSelectFile}
        ref={inputRef}
        style={{ display: "none" }}
      />

      {imagePreview && !imageLoadError ? (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "300px",
              position: "relative",
            }}
          >
            <img
              ref={previewImgRef}
              src={imagePreview}
              alt="Preview"
              onError={handleImageError}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
          </Box>

          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={handleTriggerFileInput}
          >
            Cambia immagine
          </Button>
        </Paper>
      ) : (
        <Paper
          elevation={1}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
            borderStyle: "dashed",
            borderWidth: 2,
            borderColor: theme.palette.divider,
            bgcolor: theme.palette.background.default,
            cursor: "pointer",
          }}
          onClick={handleTriggerFileInput}
        >
          <>
            <CloudUpload
              sx={{
                fontSize: 64,
                color: theme.palette.text.secondary,
                mb: 2,
              }}
            />
            <Typography variant="h6" align="center" color="textSecondary">
              Clicca per caricare un'immagine
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="textSecondary"
              sx={{ mt: 1 }}
            >
              {allowedFileTypes.map((type) => type.split("/")[1]).join(", ")}{" "}
              supportati
            </Typography>
            <Typography variant="body2" align="center" color="textSecondary">
              Massimo: {maxFileSize / (1024 * 1024)}MB
            </Typography>
          </>
        </Paper>
      )}

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Dialog
        open={isCropDialogOpen}
        onClose={handleCloseCropDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Ritaglio immagine
          <IconButton
            aria-label="close"
            onClick={handleCloseCropDialog}
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
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            {imagePreview && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
                aspect={aspectRatio}
                keepSelection
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={imagePreview}
                  style={{ maxHeight: "70vh", maxWidth: "100%" }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
          </Box>

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseCropDialog}>Annulla</Button>
          <Button
            onClick={handleSaveCrop}
            variant="contained"
            startIcon={<Save />}
            disabled={!completedCrop?.width || !completedCrop?.height}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
