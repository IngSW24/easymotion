import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";

export const MemoizedTextField = React.memo(
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
      slotProps={{
        input: {
          ...(props.slotProps?.input || {}),
          startAdornment: icon && !multiline && (
            <Box
              component="span"
              sx={{
                display: "flex",
                mr: 1,
                color: "text.secondary",
                "& > svg": { fontSize: "1.2rem" },
              }}
            >
              {icon}
            </Box>
          ),
        },
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

export const MemoizedTextArea = React.memo(
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

export const SectionCard = React.memo(
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
