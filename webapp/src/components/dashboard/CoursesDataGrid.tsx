import { CourseEntity } from "@easymotion/openapi";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

type DashboardDataGridProps = {
  courses: CourseEntity[];
  nextPageAction: () => void;
};

export default function DashboardDataGrid(props: DashboardDataGridProps) {
  const { courses, nextPageAction } = props;

  const rows = courses.map((value, index) => {
    return {
      id: index,
      courseName: value.name,
      category: value.category,
      capacity: value.members_capacity,
    };
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1, minWidth: 10 },
    { field: "courseName", headerName: "Nome corso", flex: 4, minWidth: 100 },
    { field: "category", headerName: "Categoria", flex: 4, minWidth: 100 },
    { field: "capacity", headerName: "Max Pazienti", flex: 2, minWidth: 50 },
    {
      field: "actions",
      headerName: "Azioni",
      flex: 2,
      minWidth: 70,
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
            <Tooltip title="Visualizza">
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  handleView(params.row.id);
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Modifica">
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  handleEdit(params.row.id);
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
                  handleDelete(params.row.id);
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

  // Action handlers
  const handleView = (id: number) => {
    console.log("View item", id);
    // Add your view logic here
  };

  const handleEdit = (id: number) => {
    console.log("Edit item", id);
    // Add your edit logic here
  };

  const handleDelete = (id: number) => {
    console.log("Delete item", id);
    // Add your delete logic here
  };

  return (
    <DataGrid
      checkboxSelection
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
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
    />
  );
}
