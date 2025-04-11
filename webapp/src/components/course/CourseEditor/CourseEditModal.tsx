import { useMemo, useCallback } from "react";
import { Drawer, Box, MenuItem, Grid2 } from "@mui/material";
import { useSnack } from "../../../hooks/useSnack";
import { courseLevels } from "../../../data/course-levels";
import { useCourseCategory } from "../../../hooks/useCourseCategories";
import { useAuth } from "@easymotion/auth-context";
import BasicInfoSection from "./EditCourseSections/BasicInfoSection";
import CategoryLevelSection from "./EditCourseSections/CategoryLevelSection";
import PaymentSection from "./EditCourseSections/PaymentSection";
import TagsSection from "./EditCourseSections/TagsSection";
import PublicationStatusSection from "./EditCourseSections/PublicationStatusSection";
import ScheduleSection from "./EditCourseSections/ScheduleSection";
import { useCourseForm } from "./hooks/useCourseForm";
import { useCloseHandling } from "./hooks/useCloseHandling";
import ModalHeader from "./ModalHeader";
import { CourseDto } from "@easymotion/openapi";
import { usePhysiotherapistCourses } from "../../../hooks/usePhysiotherapistCourses";

export interface CourseEditModalProps {
  open: boolean;
  onClose: () => void;
  course?: CourseDto;
}

export default function CourseEditModal(props: CourseEditModalProps) {
  const { open, onClose, course } = props;

  const { user } = useAuth();
  const {
    getAll: categories,
    create: createCategory,
    remove: removeCategory,
  } = useCourseCategory();
  const { update, create } = usePhysiotherapistCourses({ fetch: false });
  const snack = useSnack();

  // Use the extracted form hook
  const {
    editCourse,
    errors,
    handleChange,
    setTags,
    setSchedule,
    setPaymentType,
    setPrice,
    setNumPayments,
    handleMaxSubscribersToggle,
    handleMaxSubscribersChange,
    setIsPublished,
    setSubscriptionsOpen,
    validateForm,
    getCourseData,
    isFormValid,
    getMissingFields,
  } = useCourseForm({
    open,
    courseId: course?.id,
    initialData: course,
    user,
    categories: categories.data || [],
  });

  // Use the extracted close handling hook
  const { handleCloseAttempt } = useCloseHandling({
    editCourse,
    onClose,
  });

  const handleCategoryRemoval = useCallback(
    async (categoryName: string): Promise<string | null> => {
      if (!categoryName) {
        snack.showError("Inserisci un nome per la categoria da rimuovere.");
        return null;
      }

      const targetCategory = categories.data?.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      if (!targetCategory || !targetCategory.id) {
        snack.showError("Categoria non trovata o non valida.");
        return null;
      }

      try {
        await removeCategory.mutateAsync(targetCategory.id);
        snack.showSuccess("Categoria rimossa con successo!");
        return null;
      } catch (error: any) {
        snack.showError(
          `Errore nella rimozione della categoria: ${error.message || error}`
        );
        return error.message || "Errore sconosciuto";
      }
    },
    [categories.data, removeCategory, snack]
  );

  const handleCategoryCreation = useCallback(
    async (categoryName: string) => {
      if (!categoryName) {
        snack.showError("Inserisci un nome per la nuova categoria.");
        return null;
      }

      try {
        if (
          categories.data?.some(
            (cat) =>
              cat.name.trim().toLowerCase() ===
              categoryName.trim().toLowerCase()
          )
        ) {
          snack.showError("Categoria già esistente.");
          return null;
        } else {
          const newCategory = await createCategory.mutateAsync({
            name: categoryName,
          });
          snack.showSuccess("Categoria creata con successo!");
          return newCategory.id;
        }
        {
          const newCategory = await createCategory.mutateAsync({
            name: categoryName,
          });
          snack.showSuccess("Categoria creata con successo!");
          return newCategory.id;
        }
      } catch (error: any) {
        snack.showError(
          `Errore nella creazione della categoria: ${error.message || error}`
        );
        return null;
      }
    },
    [categories.data, createCategory, snack]
  );

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    if (!editCourse.categoryId) return;

    try {
      const courseData = getCourseData();

      console.log("update course", courseData);

      if (course) {
        await update.mutateAsync({ courseId: course.id, courseData });
        snack.showSuccess("Corso aggiornato con successo!");
      } else {
        await create.mutateAsync(courseData);
        snack.showSuccess("Corso creato con successo!");
      }
    } catch (error) {
      console.error("Error during course operation:", error);
      snack.showError(
        `Si è verificato un errore durante ${course ? "l'aggiornamento" : "la creazione"} del corso`
      );
    } finally {
      onClose();
    }
  }, [
    validateForm,
    editCourse.categoryId,
    getCourseData,
    course,
    update,
    snack,
    create,
    onClose,
  ]);

  // Get the tooltip message for the submit button
  const getSubmitButtonTooltip = useCallback(() => {
    if (create.isPending || update.isPending) {
      return "Operazione in corso...";
    }

    const missingFields = getMissingFields();
    return missingFields.length > 0
      ? `Campi obbligatori mancanti: ${missingFields.join(", ")}`
      : "";
  }, [create.isPending, update.isPending, getMissingFields]);

  // Prepare level menu items
  const levelMenuItems = useMemo(
    () =>
      courseLevels.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      )),
    []
  );

  // Memoize props for each section
  const basicInfoProps = useMemo(
    () => ({
      title: editCourse.title,
      shortDescription: editCourse.shortDescription,
      description: editCourse.description,
      location: editCourse.location,
      errors: {
        title: errors.title,
        shortDescription: errors.shortDescription,
        description: errors.description,
      },
      onFieldChange: handleChange,
    }),
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

  const categoryLevelProps = useMemo(
    () => ({
      categoryId: editCourse.categoryId,
      level: editCourse.level,
      instructorName: editCourse.instructorName,
      onFieldChange: handleChange,
      onCreation: handleCategoryCreation,
      onRemoval: handleCategoryRemoval,
      categories: categories.data || [],
      isCategoriesLoading: !!categories.isLoading,
      levelMenuItems,
    }),
    [
      editCourse.categoryId,
      editCourse.level,
      editCourse.instructorName,
      handleCategoryCreation,
      handleCategoryRemoval,
      handleChange,
      categories.data,
      categories.isLoading,
      levelMenuItems,
    ]
  );

  const paymentSectionProps = useMemo(
    () => ({
      price: editCourse.price,
      isFree: editCourse.isFree,
      numPayments: editCourse.numPayments,
      maxSubscribers: editCourse.maxSubscribers,
      errors: { maxSubscribers: errors.maxSubscribers },
      onCostChange: setPrice,
      onPaymentTypeChange: setPaymentType,
      onNumPaymentsChange: setNumPayments,
      onMaxSubscribersToggle: handleMaxSubscribersToggle,
      onMaxSubscribersChange: handleMaxSubscribersChange,
    }),
    [
      editCourse.price,
      editCourse.isFree,
      editCourse.numPayments,
      editCourse.maxSubscribers,
      errors.maxSubscribers,
      setPrice,
      setPaymentType,
      setNumPayments,
      handleMaxSubscribersToggle,
      handleMaxSubscribersChange,
    ]
  );

  const tagsProps = useMemo(
    () => ({
      tags: editCourse.tags,
      onTagsChange: setTags,
    }),
    [editCourse.tags, setTags]
  );

  const publicationStatusProps = useMemo(
    () => ({
      isPublished: editCourse.isPublished,
      subscriptionsOpen: editCourse.subscriptionsOpen,
      onIsPublishedChange: setIsPublished,
      onSubscriptionsOpenChange: setSubscriptionsOpen,
    }),
    [
      editCourse.isPublished,
      editCourse.subscriptionsOpen,
      setIsPublished,
      setSubscriptionsOpen,
    ]
  );

  const scheduleProps = useMemo(
    () => ({
      sessions: editCourse.sessions,
      onSessionsChange: setSchedule,
      isCreateMode: !course,
    }),
    [editCourse.sessions, setSchedule, course]
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      variant="temporary"
      onClose={(_event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
      ModalProps={{
        keepMounted: false,
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: "90%", md: "80%", lg: "70%" },
          boxSizing: "border-box",
          bgcolor: "#f5f7fa",
        },
      }}
    >
      {/* Use the new ModalHeader component */}
      <ModalHeader
        course={course}
        isPending={create.isPending || update.isPending}
        isFormValid={isFormValid()}
        onClose={handleCloseAttempt}
        onSubmit={handleSubmit}
        tooltipMessage={getSubmitButtonTooltip()}
      />

      <Box
        sx={{
          p: { xs: 2, md: 3 },
          overflow: "auto",
          height: "calc(100% - 64px)",
        }}
      >
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12 }}>
            <BasicInfoSection {...basicInfoProps} />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <CategoryLevelSection {...categoryLevelProps} />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <PublicationStatusSection {...publicationStatusProps} />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <ScheduleSection {...scheduleProps} />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <PaymentSection {...paymentSectionProps} />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TagsSection {...tagsProps} />
          </Grid2>
        </Grid2>
      </Box>
    </Drawer>
  );
}
