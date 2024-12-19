import {
  Box,
  Button,
  Grid2,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import {
  CourseEntity,
  UpdateCoursesDto,
} from "../../../../client/data-contracts";
import { defaultCourse } from "../../../data/defaults";
import { useCourses } from "../../../hooks/useCourses";
import { useSnack } from "../../../hooks/useSnack";
import ProductCard from "../CourseDetail/CourseDetailCard";
import { Add, Delete, EventAvailableOutlined } from "@mui/icons-material";
import LoadingSpinner from "../../ui/LoadingSpinner/LoadingSpinner";
import LockUnlockButton from "./LockUnlockButton";
import Selector from "../../editors/Selector/Selector";
import { courseCategories } from "../../../data/courseEnumerations";

export interface CourseDetailProps {
  id: string;
  canEdit: boolean;
}

/**
 * Defines a react component that displays the details of a course and allows edits
 * @param props the properties for the component, including the course id
 * @returns a react component
 */
export default function CourseDetail({
  id,
  canEdit = false,
}: CourseDetailProps) {
  const courses = useCourses({ fetchId: id });
  const singleCourse = courses.getSingle;
  const [editCourse, setEditCourse] = useState<UpdateCoursesDto>(
    courses.getSingle.data ?? defaultCourse
  );
  const [isEditing, setIsEditing] = useState(false);
  const snack = useSnack();

  useMemo(() => {
    if (courses.getSingle.data) {
      setEditCourse(courses.getSingle.data);
    }
  }, [courses.getSingle.data]);

  const handleSave = async () => {
    try {
      await courses.update.mutateAsync({
        courseId: id,
        courseData: { ...editCourse, cost: Number(editCourse.cost) },
      });
      setIsEditing(false); // Exit edit mode
      snack.showSuccess("Il corso è stato aggiornato con successo");
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

  if (singleCourse.isLoading) return <LoadingSpinner />;

  if (singleCourse.error || !singleCourse.data)
    return (
      <Typography variant="h4">Errore nel caricamento della pagina</Typography>
    );

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
                      Add Schedule
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
              typeInfo="Organizzatori"
              info={editCourse.instructors?.join(", ") ?? ""}
              isEditing={isEditing}
              courseId={id}
              onSave={(field, value) => {
                setEditCourse((prev) => ({
                  ...prev,
                  [field.toLowerCase()]: value,
                }));
              }}
            />

            <ProductCard
              typeInfo="Istruttori"
              info={editCourse.instructors?.join(", ") ?? ""}
              isEditing={isEditing}
              courseId={id}
              onSave={(field, value) => {
                setEditCourse((prev) => ({
                  ...prev,
                  [field.toLowerCase()]: value,
                }));
              }}
            />

            {/* <ProductCard
              typeInfo="Type"
              info={editCourse.}
              isEditing={isEditing}
              courseId={id}
              onSave={(field, value) => {
                setEditCourse((prev) => ({
                  ...prev,
                  [field.toLowerCase()]: value,
                }));
              }}
            /> */}
            <ProductCard
              typeInfo="Posizione"
              info={editCourse.location}
              isEditing={isEditing}
              courseId={id}
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
