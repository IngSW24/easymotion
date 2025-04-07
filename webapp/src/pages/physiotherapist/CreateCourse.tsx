import React, { useState, useCallback, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
  DialogContentText,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Stack,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { CreateCourseDto } from "@easymotion/openapi";
import { useSnack } from "../../hooks/useSnack";
import { useCourses } from "../../hooks/useCourses";
import { defaultCourse } from "../../data/defaults";
import { useNavigate } from "react-router";
import { PaymentType } from "./CreateCourseComponents/PaymentOptions";
import SchedulePicker from "./CreateCourseComponents/SchedulePicker";
import TagsInput from "./CreateCourseComponents/TagsInput";
import PaymentOptions from "./CreateCourseComponents/PaymentOptions";
import { courseCategories, courseLevels } from "../../data/courseEnumerations";
import {
  Add,
  ArrowBack,
  Save,
  Cancel,
  Title,
  Description,
  Place,
  Category,
  FitnessCenter,
  Person,
  EventNote,
  LocalOffer,
  School,
  PriorityHigh,
  InfoOutlined,
  CreateOutlined,
} from "@mui/icons-material";
import { CourseSession } from "./CreateCourseComponents/SchedulePickerComponents/types";

// Memoize components for better performance
const MemoizedSchedulePicker = React.memo(SchedulePicker);
const MemoizedTagsInput = React.memo(TagsInput);
const MemoizedPaymentOptions = React.memo(PaymentOptions);

// Create optimized, memoized input components to reduce re-renders
const MemoizedTextField = React.memo(
  ({
    icon,
    multiline,
    ...props
  }: { icon?: React.ReactNode; multiline?: boolean } & React.ComponentProps<
    typeof TextField
  >) => (
    <TextField
      {...props}
      multiline={multiline}
      InputProps={{
        ...props.InputProps,
        startAdornment: icon && !multiline && (
          <Box
            component="span"
            sx={{
              display: "flex",
              mr: 1,
              color: "text.secondary",
              "& > svg": { fontSize: "1.2rem" }, // Reduce icon size for better performance
            }}
          >
            {icon}
          </Box>
        ),
      }}
      sx={
        multiline
          ? {
              "& .MuiInputBase-root": {
                alignItems: "flex-start",
                "& textarea": {
                  whiteSpace: "pre-wrap",
                },
              },
              ...props.sx,
            }
          : props.sx
      }
    />
  )
);

// Create a dedicated memoized component for the description field
const MemoizedTextArea = React.memo(
  ({
    icon,
    ...props
  }: { icon?: React.ReactNode } & React.ComponentProps<typeof TextField>) => (
    <Box sx={{ display: "flex", width: "100%" }}>
      {icon && (
        <Box
          sx={{
            pt: 2,
            pr: 1.5,
            color: "text.secondary",
            "& > svg": { fontSize: "1.2rem" },
          }}
        >
          {icon}
        </Box>
      )}
      <TextField
        {...props}
        multiline
        fullWidth
        sx={{
          "& .MuiInputBase-root": {
            alignItems: "flex-start",
          },
          "& .MuiInputBase-inputMultiline": {
            whiteSpace: "pre-wrap",
          },
          ...props.sx,
        }}
      />
    </Box>
  )
);

// Memoize section card to reduce re-renders
const SectionCard = React.memo(
  ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <Card elevation={1}>
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="span"
              sx={{ mr: 1, color: "primary.main", display: "flex" }}
            >
              {icon}
            </Box>
            <Typography variant="h6">{title}</Typography>
          </Box>
        }
        sx={{
          bgcolor: "rgba(0, 0, 0, 0.02)",
          pb: 1,
          "& .MuiCardHeader-content": { overflow: "hidden" },
        }}
      />
      <CardContent>{children}</CardContent>
    </Card>
  )
);

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

type EditCourse = {
  title: string;
  shortDescription: string;
  description: string;
  location: string;
  instructorName: string;
  category: typeof defaultCourse.category;
  level: typeof defaultCourse.level;
  sessions: CourseSession[];
  tags: string[];
  paymentType: PaymentType;
  cost: number | undefined;
  numPayments: number | undefined;
};

export function CreateCourseModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { create } = useCourses();
  const navigate = useNavigate();
  const snack = useSnack();
  const [confirmClose, setConfirmClose] = useState(false);

  const [editCourse, setEditCourse] = useState<EditCourse>({
    title: "",
    shortDescription: "",
    description: "",
    location: "",
    instructorName: "",
    category: defaultCourse.category,
    level: defaultCourse.level,
    sessions: [],
    tags: [],
    paymentType: "free",
    cost: undefined,
    numPayments: undefined,
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Memoize handlers to prevent unnecessary re-renders
  const handleChange = useCallback(
    (e: ChangeEvent) =>
      setEditCourse((prev) => ({ ...prev, [e.target.name]: e.target.value })),
    []
  );

  const setTags = useCallback(
    (tags: string[]) => setEditCourse((prev) => ({ ...prev, tags })),
    []
  );

  const setSchedule = useCallback(
    (sessions: CourseSession[]) =>
      setEditCourse((prev) => ({
        ...prev,
        sessions,
      })),
    []
  );

  const setPaymentType = useCallback(
    (paymentType: PaymentType) =>
      setEditCourse((prev) => ({ ...prev, paymentType })),
    []
  );

  const setNumPayments = useCallback(
    (numPayments: number | undefined) =>
      setEditCourse((prev) => ({ ...prev, numPayments })),
    []
  );

  const setCost = useCallback(
    (cost: number | undefined) => setEditCourse((prev) => ({ ...prev, cost })),
    []
  );

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!editCourse.title.trim()) newErrors.title = "Il titolo è obbligatorio";
    if (!editCourse.shortDescription.trim())
      newErrors.shortDescription = "La descrizione breve è obbligatoria";
    if (!editCourse.description.trim())
      newErrors.description = "La descrizione è obbligatoria";
    if (editCourse.sessions.length === 0)
      newErrors.schedule = "È necessario selezionare almeno una data";
    if (!editCourse.instructorName.trim())
      newErrors.instructorName = "Il nome dell'istruttore è obbligatorio";

    if (
      editCourse.paymentType !== "free" &&
      (editCourse.cost === undefined || editCourse.cost <= 0)
    ) {
      newErrors.cost = "Il prezzo deve essere maggiore di zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [editCourse]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    try {
      // Prepare the course data
      const newCourse: Omit<CreateCourseDto, "session_duration"> = {
        name: editCourse.title,
        short_description: editCourse.shortDescription,
        description: editCourse.description,
        location: editCourse.location,
        schedule: editCourse.sessions.map((x) => x.startTime.toString()),
        instructors: [editCourse.instructorName], // Simplified for now, using only the name
        category: editCourse.category,
        level: editCourse.level,
        frequency: editCourse.sessions.length > 1 ? "WEEKLY" : "SINGLE_SESSION", // Simplify by just checking if multiple sessions
        availability: "ACTIVE",
        tags: editCourse.tags,
        cost: editCourse.cost,
        num_registered_members: 0,
      };

      // await create.mutateAsync(newCourse);

      snack.showSuccess("Corso creato con successo!");
      onClose();
      navigate("/physiotherapist"); // Return to the dashboard
    } catch (error) {
      snack.showError(
        "Si è verificato un errore durante la creazione del corso"
      );
      console.error(error);
    }
  }, [validateForm, editCourse, snack, onClose, navigate]);

  // Memoize category and level menu items to prevent re-renders
  const categoryMenuItems = useMemo(
    () =>
      courseCategories.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      )),
    []
  );

  const levelMenuItems = useMemo(
    () =>
      courseLevels.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      )),
    []
  );

  // Handle the close attempt
  const handleCloseAttempt = useCallback(() => {
    // Check if the user has entered any data
    const hasChanges =
      editCourse.title.trim() !== "" ||
      editCourse.shortDescription.trim() !== "" ||
      editCourse.description.trim() !== "" ||
      editCourse.location.trim() !== "" ||
      editCourse.instructorName.trim() !== "" ||
      editCourse.sessions.length > 0 ||
      editCourse.tags.length > 0 ||
      editCourse.paymentType !== "free" ||
      editCourse.cost !== undefined ||
      editCourse.numPayments !== undefined;

    if (hasChanges) {
      setConfirmClose(true);
    } else {
      onClose();
    }
  }, [editCourse, onClose]);

  // Confirm discard changes
  const handleConfirmClose = useCallback(() => {
    setConfirmClose(false);
    onClose();
  }, [onClose]);

  // Cancel close attempt
  const handleCancelClose = useCallback(() => {
    setConfirmClose(false);
  }, []);

  // Memoize form sections to prevent unnecessary re-renders
  const BasicInfoSection = useMemo(
    () => (
      <SectionCard title="Informazioni di base" icon={<InfoOutlined />}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MemoizedTextField
              fullWidth
              label="Titolo"
              name="title"
              value={editCourse.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              required
              icon={<Title />}
            />
          </Grid>
          <Grid item xs={12}>
            <MemoizedTextField
              fullWidth
              label="Descrizione breve"
              name="shortDescription"
              value={editCourse.shortDescription}
              onChange={handleChange}
              error={!!errors.shortDescription}
              helperText={errors.shortDescription}
              required
              icon={<Description />}
            />
          </Grid>
          <Grid item xs={12}>
            <MemoizedTextArea
              label="Descrizione completa"
              name="description"
              value={editCourse.description}
              onChange={handleChange}
              rows={5}
              error={!!errors.description}
              helperText={errors.description}
              required
              placeholder="Scrivi una descrizione dettagliata del corso..."
            />
          </Grid>
          <Grid item xs={12}>
            <MemoizedTextField
              fullWidth
              label="Luogo"
              value={editCourse.location}
              name="location"
              onChange={handleChange}
              placeholder="Indirizzo o nome della struttura"
              icon={<Place />}
            />
          </Grid>
        </Grid>
      </SectionCard>
    ),
    [
      editCourse.title,
      editCourse.shortDescription,
      editCourse.description,
      editCourse.location,
      errors.title,
      errors.shortDescription,
      errors.description,
      handleChange,
    ]
  );

  const CategoryLevelSection = useMemo(
    () => (
      <SectionCard title="Categoria e Livello" icon={<Category />}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MemoizedTextField
              select
              fullWidth
              label="Categoria"
              name="category"
              value={editCourse.category}
              onChange={handleChange}
              required
              icon={<School />}
            >
              {categoryMenuItems}
            </MemoizedTextField>
          </Grid>
          <Grid item xs={12}>
            <MemoizedTextField
              select
              fullWidth
              label="Livello"
              name="level"
              value={editCourse.level}
              onChange={handleChange}
              required
              icon={<FitnessCenter />}
            >
              {levelMenuItems}
            </MemoizedTextField>
          </Grid>
          <Grid item xs={12}>
            <MemoizedTextField
              fullWidth
              label="Nome istruttore"
              value={editCourse.instructorName}
              name="instructorName"
              onChange={handleChange}
              error={!!errors.instructorName}
              helperText={errors.instructorName}
              required
              icon={<Person />}
            />
          </Grid>
        </Grid>
      </SectionCard>
    ),
    [
      editCourse.category,
      editCourse.level,
      editCourse.instructorName,
      errors.instructorName,
      handleChange,
      categoryMenuItems,
      levelMenuItems,
    ]
  );

  const PaymentSection = useMemo(
    () => (
      <SectionCard title="Opzioni di pagamento" icon={<PriorityHigh />}>
        <MemoizedPaymentOptions
          cost={editCourse.cost}
          onCostChange={setCost}
          paymentType={editCourse.paymentType}
          onPaymentTypeChange={setPaymentType}
          numPayments={editCourse.numPayments}
          onNumPaymentsChange={setNumPayments}
        />
      </SectionCard>
    ),
    [
      editCourse.cost,
      editCourse.paymentType,
      editCourse.numPayments,
      setCost,
      setPaymentType,
      setNumPayments,
    ]
  );

  const ScheduleSection = useMemo(
    () => (
      <SectionCard title="Calendario" icon={<EventNote />}>
        <MemoizedSchedulePicker
          initialSchedule={editCourse.sessions}
          onScheduleChange={setSchedule}
        />
        {errors.schedule && (
          <Typography
            color="error"
            variant="caption"
            sx={{ display: "flex", alignItems: "center", mt: 1 }}
          >
            <PriorityHigh fontSize="small" sx={{ mr: 0.5 }} />
            {errors.schedule}
          </Typography>
        )}
      </SectionCard>
    ),
    [editCourse.sessions, errors.schedule, setSchedule]
  );

  const TagsSection = useMemo(
    () => (
      <SectionCard title="Tags" icon={<LocalOffer />}>
        <MemoizedTagsInput value={editCourse.tags} onChange={setTags} />
      </SectionCard>
    ),
    [editCourse.tags, setTags]
  );

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        variant="temporary"
        onClose={(_event, reason) => {
          // Only handle close via the explicit buttons
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
        }}
        ModalProps={{
          keepMounted: false, // Don't keep the component mounted when closed
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: "90%", md: "80%", lg: "70%" },
            boxSizing: "border-box",
            bgcolor: "#f5f7fa",
          },
        }}
      >
        <AppBar
          position="sticky"
          color="default"
          elevation={1}
          sx={{
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            bgcolor: "background.paper",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseAttempt}
              aria-label="close"
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ ml: 2, flex: 1, display: "flex", alignItems: "center" }}
            >
              <CreateOutlined sx={{ mr: 1 }} /> Crea nuovo corso
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={handleCloseAttempt}
                startIcon={<Cancel />}
              >
                Annulla
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={create.isPending}
                startIcon={<Save />}
              >
                {create.isPending ? "Creazione in corso..." : "Crea corso"}
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            p: { xs: 2, md: 3 },
            overflow: "auto",
            height: "calc(100% - 64px)",
          }}
        >
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              {BasicInfoSection}
            </Grid>

            {/* Categories and Level */}
            <Grid item xs={12} md={6}>
              {CategoryLevelSection}
            </Grid>

            {/* Payment Options */}
            <Grid item xs={12} md={6}>
              {PaymentSection}
            </Grid>

            {/* Schedule */}
            <Grid item xs={12}>
              {ScheduleSection}
            </Grid>

            {/* Tags */}
            <Grid item xs={12}>
              {TagsSection}
            </Grid>
          </Grid>
        </Box>
      </Drawer>

      {/* Confirmation dialog */}
      <Dialog
        open={confirmClose}
        onClose={handleCancelClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PriorityHigh color="error" sx={{ mr: 1 }} />
            Sei sicuro di voler annullare?
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tutte le modifiche non salvate andranno perse.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose}>Continua</Button>
          <Button onClick={handleConfirmClose} variant="outlined" autoFocus>
            Esci
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function CreateCourseButton() {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        size="small"
        onClick={handleOpen}
      >
        Crea corso
      </Button>
      <CreateCourseModal open={open} onClose={handleClose} />
    </>
  );
}
