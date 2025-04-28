import { CourseDto } from "@easymotion/openapi";
import { Delete, Edit, Group, Article } from "@mui/icons-material";
import {
  IconButton,
  Stack,
  Tooltip,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useState } from "react";

type DashboardDataGridProps = {
  courses: CourseDto[];
  pageNumer: number;
  nextPageAction: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onAction: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onCourseUsers: (id: string) => void;
};

export default function DashboardDataGrid(props: DashboardDataGridProps) {
  const {
    courses,
    pageNumer,
    nextPageAction,
    hasNextPage,
    isFetchingNextPage,
    onAction,
    onDelete,
    onEdit,
    onCourseUsers,
  } = props;

  const [paginationModel, setPaginationModel] = useState({
    pageSize: pageNumer,
    page: 0,
  });

  const currentDisplayedRows =
    paginationModel.page * paginationModel.pageSize + paginationModel.pageSize;
  const needsMoreData = currentDisplayedRows >= courses.length && hasNextPage;

  const handlePaginationModelChange = ({
    pageSize,
    page,
  }: {
    pageSize: number;
    page: number;
  }) => {
    setPaginationModel({ pageSize, page });

    if (needsMoreData && !isFetchingNextPage) {
      nextPageAction();
    }
  };

  const rows = courses.map((value, index) => {
    return {
      id: index,
      courseId: value.id,
      courseName: value.name,
      category: value.category,
      capacity: value.max_subscribers,
    };
  });

  const columns: GridColDef[] = [
    {
      field: "courseName",
      headerName: "CORSO",
      headerAlign: "center",
      flex: 4,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              backgroundColor: "#E8F0FE",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Article sx={{ color: "primary.main" }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={500}>
              {params.value}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "capacity",
      headerName: "MAX PAZIENTI",
      headerAlign: "center",
      align: "center",
      flex: 2,
      minWidth: 120,
      display: "flex",
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "category",
      headerName: "CATEGORIA",
      headerAlign: "center",
      align: "center",
      flex: 3,
      display: "flex",
      renderCell: (params) => {
        const category = params.value;
        const color = "#094D95";

        return (
          <Chip
            label={category.name.replace("_", " ")}
            size="small"
            style={{
              backgroundColor: color,
              color: "white",
              fontWeight: "bold",
            }}
          />
        );
      },
    },
    {
      field: "is_published",
      headerName: "STATO",
      headerAlign: "center",
      align: "center",
      flex: 3,
      display: "flex",
      renderCell: (params) => {
        const course = courses.find((c) => c.id === params.row.courseId);
        return (
          <Chip
            label={course?.is_published ? "ATTIVO" : "ARCHIVIATO"}
            size="small"
            style={{
              backgroundColor: course?.is_published ? "#4CAF50" : "#F44336",
              color: "white",
              fontWeight: "bold",
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "AZIONI",
      flex: 2,
      minWidth: 130,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "right",
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            width="100%"
          >
            <Tooltip title="Iscrizioni">
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  onCourseUsers(params.row.courseId);
                }}
              >
                <Group fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Modifica">
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(params.row.courseId);
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Elimina">
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(params.row.courseId);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={
        onAction
          ? columns.filter((col) => col.field !== "is_published")
          : columns.filter((col) => col.field !== "actions")
      }
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
        columns: {
          columnVisibilityModel: {
            id: false,
            courseId: false,
          },
        },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="comfortable"
      sx={{
        "& .MuiDataGrid-cell": {
          padding: "16px",
        },
        "& .MuiDataGrid-row": {
          borderRadius: 1,
        },
      }}
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
      paginationModel={paginationModel}
      onPaginationModelChange={handlePaginationModelChange}
      paginationMode="client"
      loading={isFetchingNextPage}
    />
  );
}
