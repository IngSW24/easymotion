import { Delete, Edit, Visibility } from "@mui/icons-material";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

const rows = [
  {
    id: 0,
    courseName: "Corso 1",
    category: "Crossfit",
    capacity: "146/150",
  },
  {
    id: 1,
    courseName: "Corso 2",
    category: "Crossfit",
    capacity: "146/150",
  },
  {
    id: 2,
    courseName: "Corso 3",
    category: "Crossfit",
    capacity: "146/150",
  },
  {
    id: 3,
    courseName: "Corso 4",
    category: "Crossfit",
    capacity: "146/150",
  },
  {
    id: 4,
    courseName: "Corso 5",
    category: "Crossfit",
    capacity: "146/150",
  },
  {
    id: 5,
    courseName: "Corso 6",
    category: "Crossfit",
    capacity: "146/150",
  },
  {
    id: 6,
    courseName: "Corso 7",
    category: "Crossfit",
    capacity: "146/150",
  },
  {
    id: 7,
    courseName: "Corso 8",
    category: "Crossfit",
    capacity: "146/150",
  },
  {
    id: 8,
    courseName: "Corso 9",
    category: "Crossfit",
    capacity: "146/150",
  },
  {
    id: 9,
    courseName: "Corso 10",
    category: "Crossfit",
    capacity: "146/150",
  },
  {
    id: 10,
    courseName: "Corso 11",
    category: "Crossfit",
    capacity: "146/150",
  },
];

export default function DashboardDataGrid() {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1, minWidth: 70 },
    { field: "courseName", headerName: "Nome corso", flex: 2, minWidth: 150 },
    { field: "category", headerName: "Categoria", flex: 2, minWidth: 150 },
    { field: "capacity", headerName: "Pazienti", flex: 1.5, minWidth: 120 },
    {
      field: "actions",
      headerName: "Azioni",
      flex: 1,
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
