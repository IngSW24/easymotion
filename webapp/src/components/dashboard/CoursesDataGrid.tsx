import { CourseDto } from "@easymotion/openapi";
import { Article, Delete, Edit, Group } from "@mui/icons-material";
import {
  IconButton,
  Stack,
  Tooltip,
  Box,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useState, useMemo } from "react";

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

// Move columns definition outside component
const createColumns = (
  courses: CourseDto[],
  onCourseUsers: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): GridColDef[] => [
  {
    field: "courseName",
    headerName: "CORSO",
    headerAlign: "center",
    flex: 4,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            minWidth: 40,
            backgroundColor: "#E8F0FE",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Article sx={{ color: "primary.main" }} />
        </Box>
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "calc(100% - 56px)",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={500}
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
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
    minWidth: 80,
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
    field: "isPublished",
    headerName: "STATO",
    headerAlign: "center",
    align: "center",
    flex: 2,
    display: "flex",
    renderCell: (params) => {
      const course = courses.find((c) => c.id === params.row.courseId);
      return (
        <Chip
          label={course?.isPublished ? "ATTIVO" : "ARCHIVIATO"}
          size="small"
          style={{
            backgroundColor: course?.isPublished ? "#4CAF50" : "#F44336",
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
        <Stack direction="row" spacing={1} justifyContent="center" width="100%">
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

  // Aggiungi theme e media query per il responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      capacity: value.maxSubscribers,
    };
  });

  // Memoize columns with proper dependencies
  const columns = useMemo(
    () => createColumns(courses, onCourseUsers, onEdit, onDelete),
    [courses, onCourseUsers, onEdit, onDelete]
  );

  const visibleColumns = useMemo(() => {
    let filteredColumns = [...columns];

    if (onAction) {
      filteredColumns = filteredColumns.filter(
        (col) => col.field !== "isPublished"
      );
    } else {
      filteredColumns = filteredColumns.filter(
        (col) => col.field !== "actions"
      );
    }

    if (isMobile) {
      const firstCol = filteredColumns.find(
        (col) => col.field === "courseName"
      );
      const lastCol = onAction
        ? filteredColumns.find((col) => col.field === "actions")
        : filteredColumns.find((col) => col.field === "isPublished");

      filteredColumns = [firstCol, lastCol].filter(Boolean) as GridColDef[];
    }

    return filteredColumns;
  }, [columns, onAction, isMobile]);

  return (
    <DataGrid
      rows={rows}
      columns={visibleColumns}
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
        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: "bold",
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
