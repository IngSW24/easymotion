import React from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Button,
  Stack,
  Avatar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EuroIcon from "@mui/icons-material/Euro";
import { DateTime } from "luxon";
import { getCourseLevelName } from "../../../data/course-levels";
import {
  InfoOutlined,
  CategoryOutlined,
  GroupOutlined,
  Delete,
  Done,
  QuestionAnswer,
} from "@mui/icons-material";
import { CourseDto } from "@easymotion/openapi";
import { calculateDuration } from "../../../utils/format";
import { useSubscribeButton } from "./useSubscribeButton";
import { getPaymentRecurrenceName } from "../../../data/payment-type";
import { useAuth } from "@easymotion/auth-context";
import { Link } from "react-router";

export interface CourseDetailProps {
  course: CourseDto;
  hideTitle?: boolean;
}

const CourseDetail: React.FC<CourseDetailProps> = (
  props: CourseDetailProps
) => {
  const { course, hideTitle = false } = props;
  const { isAuthenticated, isPhysiotherapist } = useAuth();
  const subscribeButton = useSubscribeButton({ course });

  const getPaymentDetails = () => {
    if (course.price === 0) return "Gratuito";
    return `Pagamento ${getPaymentRecurrenceName(course.payment_recurrence)}: €${course.price?.toFixed(2)}`;
  };

  return (
    <>
      {!hideTitle && (
        <Box textAlign="center" mb={5}>
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            color="primary"
            sx={{
              fontSize: {
                xs: "2rem",
                sm: "3rem",
                md: "3.75rem",
              },
            }}
          >
            {course.name}
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.5rem",
                md: "1.5rem",
              },
            }}
          >
            {course.short_description}
          </Typography>
        </Box>
      )}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={6} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                justifyContent="end"
              >
                {course.tags?.map((tag, idx) => (
                  <Chip key={idx} label={tag} color="info" variant="outlined" />
                ))}
              </Stack>
              <Box
                sx={{ gap: 2, display: "flex", flexDirection: "column", mt: 2 }}
              >
                <Typography variant="h5" fontWeight="bold">
                  Descrizione
                </Typography>
                <Typography variant="body1">{course.description}</Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Sessioni
                </Typography>
                <List>
                  {course.sessions.map((session, idx) => {
                    const start = DateTime.fromISO(session.start_time);
                    const end = DateTime.fromISO(session.end_time);
                    return (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            <EventIcon />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={`${start.toLocaleString(DateTime.DATE_FULL)} – ${end.toLocaleString(DateTime.TIME_SIMPLE)}`}
                          secondary={calculateDuration(start, end)}
                          slotProps={{
                            primary: {
                              sx: {
                                fontSize: "1.1rem",
                                fontWeight: "medium",
                                mb: 0.5,
                              },
                            },
                            secondary: {
                              sx: {
                                fontSize: "0.9rem",
                              },
                            },
                          }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: "center" }}>
                {isAuthenticated && !isPhysiotherapist && (
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: "block",
                      color: "primary.dark",
                      fontSmooth: "antialiased",
                      fontWeight: "bold",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <QuestionAnswer />
                      Vuoi partecipare?
                    </Box>
                  </Typography>
                )}
                {!isAuthenticated && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      component={Link}
                      to="/login"
                      variant="body1"
                      sx={{
                        textDecoration: "none",
                        color: "primary.main",
                        fontWeight: "bold",
                        "&:hover": {
                          color: "primary.dark",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Accedi
                    </Typography>
                    <Typography component="span" sx={{ mx: 1 }}>
                      oppure
                    </Typography>
                    <Typography
                      component={Link}
                      to="/signup"
                      variant="body1"
                      sx={{
                        textDecoration: "none",
                        color: "primary.main",
                        fontWeight: "bold",
                        "&:hover": {
                          color: "primary.dark",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Entra a far parte di EasyMotion!
                    </Typography>
                  </Box>
                )}
                {isAuthenticated && !subscribeButton.isHidden && (
                  <Button
                    startIcon={
                      subscribeButton.subscribed ? <Delete /> : <Done />
                    }
                    variant="contained"
                    color={subscribeButton.subscribed ? "error" : "primary"}
                    disabled={subscribeButton.isDisabled}
                    size="large"
                    onClick={() =>
                      subscribeButton.subscribed
                        ? subscribeButton.handleUnsubscribe()
                        : subscribeButton.handleSubscribe()
                    }
                  >
                    {subscribeButton.subscribed
                      ? "Annulla iscrizione"
                      : "Iscriviti"}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {[
              {
                icon: <PersonIcon />,
                label:
                  course.instructors.length > 1 ? "Istruttori" : "Istruttore",
                value: course.instructors?.join(", "),
              },
              {
                icon: <LocationOnIcon />,
                label: "Luogo",
                value: course.location?.toString(),
              },
              {
                icon: <EuroIcon />,
                label: "Prezzo",
                value: getPaymentDetails(),
              },
              {
                icon: <CategoryOutlined />,
                label: "Categoria",
                value: course.category.name,
              },
              {
                icon: <InfoOutlined />,
                label: "Livello",
                value: getCourseLevelName(course.level),
              },
              {
                icon: <GroupOutlined />,
                label: "Massimo partecipanti",
                value: course.max_subscribers ?? "Illimitato",
              },
            ].map((detail, idx) => (
              <Paper
                key={idx}
                elevation={4}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  borderLeft: "5px solid",
                  borderColor: "primary.light",
                }}
              >
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  {detail.icon}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {detail.label}
                  </Typography>
                  <Typography variant="body1">{detail.value}</Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default CourseDetail;
