import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Typography,
  Grid,
  Button,
  Tooltip,
} from "@mui/material";
import useSubscriptions from "../../hooks/useSubscription";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { ArrowBack, Check, Close, Info, Search } from "@mui/icons-material";
import { SubscriptionDtoWithUser } from "@easymotion/openapi";
import DeleteSubscribedUser from "./DeleteSubscribedUser";
import ViewPatientMedicalHistory from "./ViewPatientMedicalHistory";

enum CurrentState {
  "LOADING",
  "ERROR",
  "READY",
}

export interface CourseUsersListModalProps {
  open: boolean;
  onClose: () => void;
  courseId?: string;
}

export default function CourseUsersListModal(props: CourseUsersListModalProps) {
  const { open, onClose, courseId } = props;
  const [searchTerm, setSearchTerm] = useState("");

  const {
    getCourseSubscribers,
    getPendingCourseSubscriptions,
    acceptSubscriptionRequest,
    unsubscribe,
  } = useSubscriptions({ courseId: courseId });

  const confirmSubscription = async (patientId: string) => {
    if (!courseId) return;
    await acceptSubscriptionRequest.mutateAsync({
      courseId: courseId,
      patientId: patientId,
    });
  };

  const denySubscription = async (patientId: string) => {
    if (!courseId) return;
    await unsubscribe.mutateAsync({
      courseId: courseId,
      patientId: patientId,
    });
  };

  const [currentPageState, setCurrentPageState] = useState(
    CurrentState.LOADING
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (getCourseSubscribers.isError || getPendingCourseSubscriptions.isError) {
      setCurrentPageState(CurrentState.ERROR);
    } else if (
      (getCourseSubscribers.isSuccess || getCourseSubscribers.data) &&
      (getPendingCourseSubscriptions.isSuccess ||
        getPendingCourseSubscriptions.data)
    ) {
      setCurrentPageState(CurrentState.READY);
    } else {
      setCurrentPageState(CurrentState.LOADING);
    }
  }, [
    getCourseSubscribers,
    getPendingCourseSubscriptions,
    getCourseSubscribers.data,
    getPendingCourseSubscriptions.data,
    courseId,
  ]);

  // Render already subscribed user (simplified)
  const renderSubscribedUserItem = (
    value: SubscriptionDtoWithUser,
    index: number
  ) => (
    <Box
      key={index}
      sx={{
        mb: 2,
        pb: 2,
        borderBottom: "1px solid #eee",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "primary.main",
              mr: 2,
              flexShrink: 0,
            }}
          >
            {value.user.firstName?.charAt(0) || value.user.email?.charAt(0)}
          </Avatar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <Box sx={{ overflow: "hidden", mr: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "medium",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {value.user.firstName} {value.user.lastName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {value.user.email}
              </Typography>
            </Box>

            <Box>
              <ViewPatientMedicalHistory patientId={value.user.id} />

              <DeleteSubscribedUser
                userId={value.user.id}
                courseId={value.course.id}
                userFirstName={value.user.firstName}
                userMiddleName={value.user.middleName || ""}
                userLastName={value.user.lastName}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  flexShrink: 0,
                  textAlign: "right",
                  ml: 1,
                }}
              >
                {formatDate(value.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // Render pending user with accept/decline buttons
  const renderPendingUserItem = (
    value: SubscriptionDtoWithUser,
    index: number
  ) => (
    <Box
      key={index}
      sx={{
        mb: 2,
        pb: 2,
        borderBottom: "1px solid #eee",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "warning.main",
            mr: 2,
          }}
        >
          {value.user.firstName?.charAt(0) || value.user.email?.charAt(0)}
        </Avatar>
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "calc(100% - 60px)",
          }}
        >
          {value.user.email}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<Check />}
          sx={{ flex: 1, mr: 1 }}
          onClick={() => confirmSubscription(value.user.id)}
        >
          Accetta
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<Close />}
          sx={{ flex: 1 }}
          onClick={() => denySubscription(value.user.id)}
        >
          Rifiuta
        </Button>
      </Box>
    </Box>
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
            onClick={() => onClose()}
            aria-label="close"
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ ml: 2, flex: 1, display: "flex", alignItems: "center" }}
          >
            Iscrizioni
          </Typography>
        </Toolbar>
      </AppBar>

      {currentPageState === CurrentState.ERROR && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" color="error">
            Si è verificato un errore durante il caricamento dei dati
          </Typography>
        </Box>
      )}

      {currentPageState === CurrentState.LOADING && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <LoadingSpinner />
        </Box>
      )}

      {currentPageState === CurrentState.READY && (
        <Grid container sx={{ height: "calc(100% - 64px)" }}>
          {/* Main list - 2/3 width */}
          <Grid
            size={{ xs: 12, md: 8 }}
            sx={{ p: 2, borderRight: { md: "1px solid #e0e0e0" } }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Utenti iscritti
              </Typography>
              <Paper sx={{ p: 1, mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Search sx={{ color: "action.active", mr: 1 }} />
                  <TextField
                    variant="standard"
                    placeholder="Cerca utente..."
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Box>
              </Paper>

              {getCourseSubscribers.data?.data.length === 0 ? (
                <Typography
                  sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
                >
                  Attualmente, non ci sono ancora iscritti a questo corso!
                </Typography>
              ) : (
                getCourseSubscribers.data?.data
                  .filter(
                    (user) =>
                      searchTerm === "" ||
                      `${user.user.firstName} ${user.user.lastName}`
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.user.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((value, index) => renderSubscribedUserItem(value, index))
              )}
            </Box>
          </Grid>

          {/* Pending requests - 1/3 width */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ p: 2, bgcolor: "#f9f9f9" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Richieste
            </Typography>

            {getPendingCourseSubscriptions.data?.data.length === 0 ? (
              <Typography
                sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
              >
                Nessuna nuova richiesta
              </Typography>
            ) : (
              getPendingCourseSubscriptions.data?.data.map((value, index) =>
                renderPendingUserItem(value, index)
              )
            )}
          </Grid>
        </Grid>
      )}
    </Drawer>
  );
}
