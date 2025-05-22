import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EuroIcon from "@mui/icons-material/Euro";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import { DateTime } from "luxon";
import { getCourseLevelName } from "../../../data/course-levels";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import { CourseDto } from "@easymotion/openapi";
import { calculateDuration } from "../../../utils/format";
import { getPaymentRecurrenceName } from "../../../data/payment-type";
import { useAuth } from "@easymotion/auth-context";
import { Link } from "react-router";
import SubscriptionRequestForm from "./SubscriptionRequest";
import SubscribeSection from "./SubscribeSection";
import MarkdownBlock from "../../atoms/MarkdownBlock/MarkdownBlock";

export interface CourseDetailProps {
  course: CourseDto;
  hideTitle?: boolean;
}

const CourseDetail: React.FC<CourseDetailProps> = (
  props: CourseDetailProps
) => {
  const { course, hideTitle = false } = props;

  const { isAuthenticated, isPhysiotherapist, user } = useAuth();

  const [openSubReqModal, setOpenSubReqModal] = useState(false);

  const startSubscriptionDate = new Date(
    Date.parse(course.subscriptionStartDate)
  );

  const endSubscriptionDate = new Date(Date.parse(course.subscriptionEndDate));

  const getPaymentDetails = () => {
    if (course.price === 0) return "Gratuito";
    return `Pagamento ${getPaymentRecurrenceName(course.paymentRecurrence)}: €${course.price?.toFixed(2)}`;
  };

  const getAvailableSubscriptions = () => {
    return (course.maxSubscribers ?? 0) == 0
      ? 0
      : (course.maxSubscribers ?? 0) - course.currentSubscribers;
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
            {course.shortDescription}
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
                <MarkdownBlock content={course.description} />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Sessioni
                </Typography>
                <List>
                  {course.sessions.map((session, idx) => {
                    const start = DateTime.fromISO(session.startTime);
                    const end = DateTime.fromISO(session.endTime);
                    return (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            <EventIcon />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={`${start.toLocaleString(DateTime.DATE_FULL, { locale: "it" })} – ${end.toLocaleString(DateTime.TIME_SIMPLE, { locale: "it" })}`}
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

              <Box>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                  Periodo d'iscrizione:
                </Typography>

                <Typography mb={3}>
                  Le iscrizioni cominciano a partire dal giorno{" "}
                  {startSubscriptionDate.toLocaleDateString()} alle ore{" "}
                  {startSubscriptionDate.toLocaleTimeString()}
                </Typography>
                <Typography mb={3}>
                  Le iscrizioni terminano il giorno{" "}
                  {endSubscriptionDate.toLocaleDateString()} alle ore{" "}
                  {endSubscriptionDate.toLocaleTimeString()}
                </Typography>

                {(course.maxSubscribers ?? 0) > 0 && (
                  <Box
                    sx={{
                      gap: 2,
                      display: "flex",
                      flexDirection: "column",
                      mt: 2,
                    }}
                  >
                    <Typography color="green" fontWeight="bold">
                      Posti ancora disponibili: {getAvailableSubscriptions()}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: "center" }}>
                {isAuthenticated && !isPhysiotherapist && (
                  <SubscribeSection
                    course={course}
                    onSubscribeClick={() => setOpenSubReqModal(true)}
                  />
                )}
                <SubscriptionRequestForm
                  open={openSubReqModal}
                  setOpen={setOpenSubReqModal}
                  numberSubscribers={course.currentSubscribers}
                  startSubscriptionDate={startSubscriptionDate.getTime()}
                  endSubscriptionDate={endSubscriptionDate}
                  maxSubscribers={course.maxSubscribers ?? 0}
                  price={getPaymentDetails()}
                  courseId={course.id}
                  userId={user?.id}
                />
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
                icon: <CalendarMonth />,
                label: "Periodo di iscrizione",
                value:
                  startSubscriptionDate.toLocaleDateString() +
                  " - " +
                  endSubscriptionDate.toLocaleDateString(),
              },
              {
                icon: <GroupOutlined />,
                label: "Numero massimo di partecipanti",
                value: course.maxSubscribers ?? "Illimitato",
              },
              {
                icon: <GroupOutlined />,
                label: "Numero di partecipanti",
                value: course.currentSubscribers,
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
