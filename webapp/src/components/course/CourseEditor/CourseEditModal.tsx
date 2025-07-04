import { useCallback, useEffect } from "react";
import { Drawer, Box, Grid, Typography, Paper, SxProps } from "@mui/material";
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
import ImageSection from "./EditCourseSections/ImageSection";

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
    mode: "all",
  });

  useEffect(() => {
    // reset form if creating new course
    if (!course) {
      methods.reset({
        ...defaultCourse,
        // assumes instructor is the current user and defaults course with their name
        instructors: [formatUserName(user)],
      });
      return;
    }

    // apply course to data form if editing
    methods.reset({ ...course, categoryId: course.category.id });
  }, [course, methods, user]);

  const onSubmit: SubmitHandler<CourseFormData> = useCallback(
    async (data) => {
      try {
        if (course) {
          await update.mutateAsync({
            courseId: course.id,
            courseData: data,
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
            onClose={onClose}
            onSubmit={methods.handleSubmit(onSubmit)}
          />

          <Box
            sx={{
              p: { xs: 2, md: 3 },
              overflow: "auto",
              height: "calc(100% - 64px)",
            }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Box sx={sectionCardStyle}>
                    <InfoIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      Immagine
                    </Typography>
                  </Box>
                  <ImageSection course={course} />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Box sx={sectionCardStyle}>
                    <InfoIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      Informazioni base
                    </Typography>
                  </Box>
                  <BasicInfoSection />
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Box sx={sectionCardStyle}>
                    <CategoryIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      Categoria e livello
                    </Typography>
                  </Box>
                  <CategoryLevelSection />
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Box sx={sectionCardStyle}>
                    <PublicIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      Stato pubblicazione
                    </Typography>
                  </Box>
                  <PublicationStatusSection />
                </Paper>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Box sx={sectionCardStyle}>
                    <EventIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      Calendario appuntamenti
                    </Typography>
                  </Box>
                  <ScheduleSection />
                </Paper>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Box sx={sectionCardStyle}>
                    <EuroIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      Pagamento
                    </Typography>
                  </Box>
                  <PaymentSection />
                </Paper>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Box sx={sectionCardStyle}>
                    <LocalOfferIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      Tag
                    </Typography>
                  </Box>
                  <TagsSection />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </form>
      </FormProvider>
    </Drawer>
  );
}
