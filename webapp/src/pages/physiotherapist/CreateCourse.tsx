import React, { useState, useCallback, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { CourseEntity, CreateCourseDto } from "@easymotion/openapi";
import { useSnack } from "../../hooks/useSnack";
import { useCourses } from "../../hooks/useCourses";
import { defaultCourse } from "../../data/defaults";
import { useNavigate } from "react-router";
import { PaymentType } from "./CreateCourseComponents/PaymentOptions";
import SchedulePicker from "./CreateCourseComponents/SchedulePicker";
import TagsInput from "./CreateCourseComponents/TagsInput";
import PaymentOptions from "./CreateCourseComponents/PaymentOptions";
import { courseCategories, courseLevels } from "../../data/courseEnumerations";
import { Add } from "@mui/icons-material";

// Memoize components for better performance
const MemoizedSchedulePicker = React.memo(SchedulePicker);
const MemoizedTagsInput = React.memo(TagsInput);
const MemoizedPaymentOptions = React.memo(PaymentOptions);

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

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

  // Course data
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [category, setCategory] = useState(defaultCourse.category);
  const [level, setLevel] = useState(defaultCourse.level);
  const [schedule, setSchedule] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // Payment options
  const [paymentType, setPaymentType] = useState<PaymentType>("free");
  const [cost, setCost] = useState<number | undefined>(0);
  const [numPayments, setNumPayments] = useState<number>(2);

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Memoize handlers to prevent unnecessary re-renders
  const handleTitleChange = useCallback(
    (e: ChangeEvent) => setTitle(e.target.value),
    []
  );

  const handleShortDescriptionChange = useCallback(
    (e: ChangeEvent) => setShortDescription(e.target.value),
    []
  );

  const handleDescriptionChange = useCallback(
    (e: ChangeEvent) => setDescription(e.target.value),
    []
  );

  const handleLocationChange = useCallback(
    (e: ChangeEvent) => setLocation(e.target.value),
    []
  );

  const handleInstructorNameChange = useCallback(
    (e: ChangeEvent) => setInstructorName(e.target.value),
    []
  );

  const handleCategoryChange = useCallback(
    (e: ChangeEvent) => setCategory(e.target.value as CourseEntity["category"]),
    []
  );

  const handleLevelChange = useCallback(
    (e: ChangeEvent) => setLevel(e.target.value as CourseEntity["level"]),
    []
  );

  const handleScheduleChange = useCallback(
    (newSchedule: string[]) => setSchedule(newSchedule),
    []
  );

  const handleTagsChange = useCallback(
    (newTags: string[]) => setTags(newTags),
    []
  );

  const handlePaymentTypeChange = useCallback(
    (newType: PaymentType) => setPaymentType(newType),
    []
  );

  const handleCostChange = useCallback(
    (newCost: number | undefined) => setCost(newCost),
    []
  );

  const handleNumPaymentsChange = useCallback(
    (newNumPayments: number) => setNumPayments(newNumPayments),
    []
  );

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Il titolo è obbligatorio";
    if (!shortDescription.trim())
      newErrors.shortDescription = "La descrizione breve è obbligatoria";
    if (!description.trim())
      newErrors.description = "La descrizione è obbligatoria";
    if (schedule.length === 0)
      newErrors.schedule = "È necessario selezionare almeno una data";
    if (!instructorName.trim())
      newErrors.instructorName = "Il nome dell'istruttore è obbligatorio";

    if (paymentType !== "free" && (cost === undefined || cost <= 0)) {
      newErrors.cost = "Il prezzo deve essere maggiore di zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    title,
    shortDescription,
    description,
    schedule,
    instructorName,
    paymentType,
    cost,
  ]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    try {
      // Prepare the course data
      const newCourse: CreateCourseDto = {
        name: title,
        short_description: shortDescription,
        description,
        location: location || undefined,
        schedule,
        instructors: [instructorName], // Simplified for now, using only the name
        category,
        level,
        frequency: schedule.length > 1 ? "WEEKLY" : "SINGLE_SESSION", // Simplify by just checking if multiple sessions
        session_duration: "PT1H", // Fixed for now - could be enhanced to use actual duration
        availability: "ACTIVE",
        tags,
        num_registered_members: 0,
      };

      // Handle payment options
      if (paymentType !== "free" && cost !== undefined) {
        newCourse.cost = cost;
      }

      await create.mutateAsync(newCourse);

      snack.showSuccess("Corso creato con successo!");
      onClose();
      navigate("/physiotherapist"); // Return to the dashboard
    } catch (error) {
      snack.showError(
        "Si è verificato un errore durante la creazione del corso"
      );
      console.error(error);
    }
  }, [
    validateForm,
    title,
    shortDescription,
    description,
    location,
    schedule,
    instructorName,
    category,
    level,
    tags,
    paymentType,
    cost,
    create,
    snack,
    onClose,
    navigate,
  ]);

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Crea nuovo corso</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Informazioni di base
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Titolo"
                  value={title}
                  onChange={handleTitleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrizione breve"
                  value={shortDescription}
                  onChange={handleShortDescriptionChange}
                  error={!!errors.shortDescription}
                  helperText={errors.shortDescription}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrizione completa"
                  value={description}
                  onChange={handleDescriptionChange}
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Luogo"
                  value={location}
                  onChange={handleLocationChange}
                  placeholder="Indirizzo o nome della struttura"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Categories and Level */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Categoria e Livello
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Categoria"
                  value={category}
                  onChange={handleCategoryChange}
                  required
                >
                  {categoryMenuItems}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Livello"
                  value={level}
                  onChange={handleLevelChange}
                  required
                >
                  {levelMenuItems}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome istruttore"
                  value={instructorName}
                  onChange={handleInstructorNameChange}
                  error={!!errors.instructorName}
                  helperText={errors.instructorName}
                  required
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Payment Options */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Opzioni di pagamento
            </Typography>
            <MemoizedPaymentOptions
              cost={cost}
              onCostChange={handleCostChange}
              paymentType={paymentType}
              onPaymentTypeChange={handlePaymentTypeChange}
              numPayments={numPayments}
              onNumPaymentsChange={handleNumPaymentsChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Schedule */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Calendario
            </Typography>
            <MemoizedSchedulePicker
              value={schedule}
              onChange={handleScheduleChange}
            />
            {errors.schedule && (
              <Typography color="error" variant="caption">
                {errors.schedule}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Tags */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <MemoizedTagsInput value={tags} onChange={handleTagsChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={create.isPending}
        >
          {create.isPending ? "Creazione in corso..." : "Crea corso"}
        </Button>
      </DialogActions>
    </Dialog>
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
