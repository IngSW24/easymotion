import { CourseDto } from "@easymotion/openapi";
import { Delete, Edit, Group } from "@mui/icons-material";
import { Chip, IconButton, Stack, Tooltip, styled } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useState } from "react";

type DashboardDataGridProps = {
  courses: CourseDto[];
  nextPageAction: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onCourseUsers: (id: string) => void;
};

// Customizing the DataGrid Styling
const StyledDataGrid = styled(DataGrid)({
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#f5f5f5",
    textTransform: "uppercase",
    fontSize: "0.875rem",
    fontWeight: "bold",
    color: "#424242",
    padding: "0",
    borderBottom: "2px solid #e0e0e0",
  },
  "& .MuiDataGrid-columnSeparator": {
    display: "none",
  },
  "& .even": {
    backgroundColor: "#fafafa",
  },
  "& .odd": {
    backgroundColor: "#ffffff",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#e0f7fa",
  },
  "& .MuiDataGrid-cell": {
    display: "flex",
    alignItems: "center",
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "#f5f5f5",
    borderTop: "1px solid #e0e0e0",
    padding: "8px",
  },
  "& .MuiTablePagination-root": {
    color: "#424242",
  },
  "& .MuiTablePagination-actions": {
    display: "flex",
    alignItems: "center",
  },
});

export default function DashboardDataGrid(props: DashboardDataGridProps) {
  const {
    courses,
    nextPageAction,
    hasNextPage,
    isFetchingNextPage,
    onDelete,
    onEdit,
    onCourseUsers,
  } = props;

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
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
    { field: "id", headerName: "ID", flex: 1, minWidth: 10 },
    { field: "courseId" },
    { field: "courseName", headerName: "Nome corso", flex: 4, minWidth: 100 },
    {
      field: "category",
      headerName: "Categoria",
      flex: 3,
      minWidth: 100,
      renderCell: (params) => {
        const category = params.value;
        const color = "#9e9e9e";

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
    { field: "capacity", headerName: "Max Pazienti", flex: 2, minWidth: 50 },
    {
      field: "actions",
      headerName: "Azioni",
      flex: 2,
      minWidth: 100,
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
                <Edit fontSize="small" color="primary" />
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
                <Delete fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <StyledDataGrid
      checkboxSelection
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
        columns: {
          columnVisibilityModel: {
            courseId: false,
          },
        },
      }}
      pageSizeOptions={[10, 20, 50]}
      density="compact"
      paginationModel={paginationModel}
      onPaginationModelChange={handlePaginationModelChange}
      paginationMode="client"
      loading={isFetchingNextPage}
    />
  );
}
