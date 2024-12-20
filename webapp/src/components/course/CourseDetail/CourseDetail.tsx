import {
  Box,
  Button,
  Grid2,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { CourseEntity } from "../../../../client/data-contracts";
import { useSnack } from "../../../hooks/useSnack";
import ProductCard from "./ProductCard";
import { Add, Delete, EventAvailableOutlined } from "@mui/icons-material";
import LockUnlockButton from "./LockUnlockButton";
import Selector from "../../editors/Selector/Selector";
import { courseCategories } from "../../../data/courseEnumerations";

export interface CourseDetailProps {
  isNew?: boolean;
  canEdit: boolean;
  course: CourseEntity;
  onSave: (course: CourseEntity) => Promise<CourseEntity>;
}

/**
 * Defines a react component that displays the details of a course and allows edits
 * @param props the properties for the component, including the course id
 * @returns a react component
 */
export default function CourseDetail(props: CourseDetailProps) {
  const { course, canEdit = false, isNew = false } = props;

  const [editCourse, setEditCourse] = useState<CourseEntity>(course);

  // If the course is new, start in edit mode
  const [isEditing, setIsEditing] = useState(isNew);

  const snack = useSnack();

  const handleSave = async () => {
    try {
      await props.onSave(editCourse);

      setIsEditing(false);

      snack.showSuccess(
        `Il corso è stato ${!isNew ? "aggiornato" : "creato"} con successo`
      );
    } catch (e) {
      if (e instanceof Error || typeof e === "string") snack.showError(e);
    }
  };

  const updateField = (field: string, value: string) =>
    setEditCourse((prev) => ({ ...prev, [field]: value }));

  const lockUnlockClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    handleSave();
  };

  return (
    <>
      <Grid2 container spacing={4}>
        <Grid2 container size={12} sx={{ mt: 2, mb: 3 }}>
          <Grid2
            size={{ xs: 12, md: 9 }}
            alignItems="center"
            textAlign={{ xs: "center", md: "start" }}
            order={{ xs: 2, md: 1 }}
          >
            {!isEditing ? (
              <Stack spacing={3}>
                <Typography variant="h4" color="primary.dark" fontWeight={500}>
                  {editCourse.short_description}
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={3}>
                <TextField
                  id="outlined-basic"
                  value={editCourse.name}
                  label="Nome del corso"
                  fullWidth
                  onChange={(e) =>
                    setEditCourse((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  variant="outlined"
                />

                <TextField
                  id="outlined-basic"
                  value={editCourse.short_description}
                  label="Breve descrizione"
                  fullWidth
                  onChange={(e) =>
                    setEditCourse((prev) => ({
                      ...prev,
                      short_description: e.target.value,
                    }))
                  }
                  variant="outlined"
                />
              </Stack>
            )}
          </Grid2>
          {canEdit && (
            <Grid2
              size={{ xs: 12, md: 3 }}
              textAlign={{ xs: "center", md: "end" }}
              alignItems="center"
              order={{ xs: 1, md: 2 }}
            >
              <LockUnlockButton
                isEditing={isEditing}
                onClick={lockUnlockClick}
              />
            </Grid2>
          )}
        </Grid2>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Stack spacing={6}>
            <div>
              <Typography variant="h4" color="secondary.main" fontWeight="bold">
                Descrizione
              </Typography>
              <Box sx={{ mt: 3 }}>
                {!isEditing ? (
                  <Typography
                    variant="body1"
                    sx={{ overflowWrap: "break-word" }}
                  >
                    {editCourse.description}
                  </Typography>
                ) : (
                  <TextField
                    multiline
                    fullWidth
                    value={editCourse.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                )}
              </Box>
            </div>
            <div>
              <Typography variant="h4" color="secondary.main" fontWeight="bold">
                Programma
              </Typography>
              <Stack spacing={3} sx={{ mt: 3 }}>
                {editCourse.schedule?.map((item, index) => (
                  <Stack
                    key={`schedule-${index}`}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <EventAvailableOutlined fontSize="large" color="primary" />
                    {!isEditing ? (
                      <Typography
                        component="div"
                        variant="button"
                        fontSize={20}
                        letterSpacing={2}
                      >
                        {item}
                      </Typography>
                    ) : (
                      <>
                        <TextField
                          id={`outlined-basic-${index}`}
                          value={item}
                          onChange={(e) =>
                            setEditCourse((prev) => ({
                              ...prev,
                              schedule: prev.schedule?.map((s, i) =>
                                i === index ? e.target.value : s
                              ),
                            }))
                          }
                          variant="outlined"
                          fullWidth
                        />
                        <IconButton
                          color="error"
                          onClick={() =>
                            setEditCourse((prev) => ({
                              ...prev,
                              schedule: prev.schedule?.filter(
                                (_, i) => index !== i
                              ),
                            }))
                          } // Removes the current row
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </Stack>
                ))}

                {/* Add Row Button */}
                {isEditing && (
                  <Stack direction="row" justifyContent="flex-start" mt={2}>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      color="primary"
                      onClick={() =>
                        setEditCourse((prev) => ({
                          ...prev,
                          schedule: [...(prev.schedule || []), ""], // Adds an empty new row
                        }))
                      }
                    >
                      {"Aggiuni voce"}
                    </Button>
                  </Stack>
                )}
              </Stack>
            </div>
            {!isEditing ? (
              <Stack spacing={3}>
                <Typography
                  variant="h4"
                  color="secondary.main"
                  fontWeight="bold"
                >
                  Categoria
                </Typography>
                <Typography variant="body1">
                  {courseCategories.find((x) => x.value === editCourse.category)
                    ?.label ?? ""}
                </Typography>
              </Stack>
            ) : (
              <Selector<CourseEntity["category"]>
                initialValue={editCourse.category}
                label="Categoria"
                options={courseCategories}
                onChange={(value) => updateField("category", value)}
              />
            )}
          </Stack>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <div>
            {/* Product Card (dx screen) */}

            <ProductCard
              typeInfo="Istruttori"
              info={editCourse.instructors?.join(", ") ?? ""}
              field="instructors"
              isEditing={isEditing}
              onSave={(field, value) => {
                setEditCourse((prev) => ({
                  ...prev,
                  [field.toLowerCase()]: [value],
                }));
              }}
            />

            <ProductCard
              typeInfo="Posizione"
              field="location"
              info={editCourse.location}
              isEditing={isEditing}
              onSave={(field, value) => {
                setEditCourse((prev) => ({
                  ...prev,
                  [field.toLowerCase()]: value,
                }));
              }}
            />
          </div>
        </Grid2>
      </Grid2>
    </>
  );
}

// {
//   /**
//       <ProductCard
//         typeInfo="Description"
//         info={editCourse.description}
//         isEditing={isEditing}
//         courseId={id}
//         onSave={(field, value) => {
//           setEditCourse((prev) => ({ ...prev, [field.toLowerCase()]: value }));
//         }}
//       />
// */
// }
