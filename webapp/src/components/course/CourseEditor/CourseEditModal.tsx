import { useCallback, useEffect } from "react";
import { Drawer, Box, Grid2, Typography, Paper, SxProps } from "@mui/material";
import { useSnack } from "../../../hooks/useSnack";
import BasicInfoSection from "./EditCourseSections/BasicInfoSection";
import CategoryLevelSection from "./EditCourseSections/CategoryLevelSection";
import PaymentSection from "./EditCourseSections/PaymentSection";
import TagsSection from "./EditCourseSections/TagsSection";
import PublicationStatusSection from "./EditCourseSections/PublicationStatusSection";
import ScheduleSection from "./EditCourseSections/ScheduleSection";
import ModalHeader from "./EditCourseSections/ModalHeader";
import { CourseDto } from "@easymotion/openapi";
import { usePhysiotherapistCourses } from "../../../hooks/usePhysiotherapistCourses";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseFormData, courseSchema, defaultCourse } from "./schema";
import InfoIcon from "@mui/icons-material/Info";
import CategoryIcon from "@mui/icons-material/Category";
import EventIcon from "@mui/icons-material/Event";
import EuroIcon from "@mui/icons-material/Euro";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PublicIcon from "@mui/icons-material/Public";
import { useAuth } from "@easymotion/auth-context";
import { formatUserName } from "../../../utils/format";

export interface CourseEditModalProps {
  open: boolean;
  onClose: () => void;
  course?: CourseDto;
}

const sectionCardStyle: SxProps = {
  display: "flex",
  alignItems: "center",
  mb: 3,
  pb: 2,
  borderBottom: "1px solid",
  borderColor: "divider",
};

export default function CourseEditModal(props: CourseEditModalProps) {
  const { open, onClose, course } = props;
  const { update, create } = usePhysiotherapistCourses({ fetch: false });
  const { user } = useAuth();
  const snack = useSnack();

  const methods = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: defaultCourse,
  });

  useEffect(() => {
    // reset form if creating new course
    if (!course) {
      methods.reset({ ...defaultCourse, instructors: [formatUserName(user)] });
      return;
    }

    // apply course to data form if editing
    methods.reset({ ...course, category_id: course.category.id });
  }, [course, methods, user]);

  const onSubmit: SubmitHandler<CourseFormData> = useCallback(
    async (data) => {
      // this is temporary until backend logic is changed according to proposal
      const dataToSubmit = {
        ...data,
        price: data.is_free ? null : data.price,
        number_of_payments: data.is_free ? null : data.number_of_payments,
      };

      try {
        if (course) {
          await update.mutateAsync({
            courseId: course.id,
            courseData: dataToSubmit,
          });
          snack.showSuccess("Corso aggiornato con successo!");
        } else {
          await create.mutateAsync(data);
          snack.showSuccess("Corso creato con successo!");
        }
        onClose();
      } catch (_e) {
        snack.showError(
          `Si è verificato un errore durante ${course ? "l'aggiornamento" : "la creazione"} del corso`
        );
      }
    },
    [course, onClose, update, snack, create]
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
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <ModalHeader
            course={course}
            isPending={create.isPending || update.isPending}
            isFormValid={methods.formState.isValid}
            onClose={onClose}
            onSubmit={methods.handleSubmit(onSubmit)}
            tooltipMessage={
              !methods.formState.isValid
                ? "Compila tutti i campi obbligatori"
                : ""
            }
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
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Box sx={sectionCardStyle}>
                    <InfoIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      Informazioni base
                    </Typography>
                  </Box>
                  <BasicInfoSection />
                </Paper>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Box sx={sectionCardStyle}>
                    <CategoryIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      Categoria e livello
                    </Typography>
                  </Box>
                  <CategoryLevelSection />
                </Paper>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Box sx={sectionCardStyle}>
                    <PublicIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      Stato pubblicazione
                    </Typography>
                  </Box>
                  <PublicationStatusSection />
                </Paper>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Box sx={sectionCardStyle}>
                    <EventIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      Calendario appuntamenti
                    </Typography>
                  </Box>
                  <ScheduleSection />
                </Paper>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Box sx={sectionCardStyle}>
                    <EuroIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      Pagamento
                    </Typography>
                  </Box>
                  <PaymentSection />
                </Paper>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Box sx={sectionCardStyle}>
                    <LocalOfferIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      Tag
                    </Typography>
                  </Box>
                  <TagsSection
                    value={methods.watch("tags")}
                    onChange={(tags) => methods.setValue("tags", tags)}
                  />
                </Paper>
              </Grid2>
            </Grid2>
          </Box>
        </form>
      </FormProvider>
    </Drawer>
  );
}
