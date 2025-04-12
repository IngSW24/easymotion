import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import useSubscriptions from "../../hooks/useSubscription";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { ArrowBack, PersonRemove } from "@mui/icons-material";

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

  const { getCourseSubscribers } = useSubscriptions({ courseId: courseId });

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
    if (getCourseSubscribers.isError || !courseId) {
      setCurrentPageState(CurrentState.ERROR);
    } else if (getCourseSubscribers.isSuccess) {
      setCurrentPageState(CurrentState.READY);
    } else {
      setCurrentPageState(CurrentState.LOADING);
    }
  }, [getCourseSubscribers, courseId]);

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
        <Typography>Error ....</Typography>
      )}
      {currentPageState === CurrentState.LOADING && <LoadingSpinner />}
      {currentPageState === CurrentState.READY && (
        <Box sx={{ p: 2, width: "100%" }}>
          {getCourseSubscribers.data?.data.map((value, index) => (
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
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                {/* User information */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: { xs: "100%", sm: "auto" },
                    mb: { xs: 1, sm: 0 },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "primary.main",
                      mr: 2,
                      flexShrink: 0,
                    }}
                  >
                    {value.user.firstName?.charAt(0) ||
                      value.user.email?.charAt(0)}
                  </Avatar>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      alignItems: { xs: "flex-start", md: "baseline" },
                      gap: { xs: 0.5, md: 1 },
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      component="span"
                      variant="subtitle1"
                      sx={{
                        fontWeight: "medium",
                        py: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: { md: "nowrap" },
                      }}
                    >
                      {value.user.firstName} {value.user.middleName}{" "}
                      {value.user.lastName}
                    </Typography>
                    <Typography
                      component="span"
                      variant="subtitle1"
                      color="text.secondary"
                      sx={{
                        py: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: { md: "nowrap" },
                        fontSize: { xs: "0.875rem", md: "1rem" },
                      }}
                    >
                      {value.user.email}
                    </Typography>
                  </Box>
                </Box>

                {/* Actions area */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "flex-end", sm: "flex-end" },
                    width: { xs: "100%", sm: "auto" },
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      mr: 1,
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mr: 0.5 }}
                    >
                      {formatDate(value.subscriptionDate)}
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <PersonRemove />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Drawer>
  );
}
