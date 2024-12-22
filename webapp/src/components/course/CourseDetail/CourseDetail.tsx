import { Box, Chip, Grid2, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { CourseEntity } from "../../../../client/data-contracts";
import { useSnack } from "../../../hooks/useSnack";
import ProductCard from "./ProductCard";
import LockUnlockButton from "./LockUnlockButton";
import { Duration } from "luxon";
import DurationPicker from "../../editors/DurationPicker/DurationPicker";
import ProductCardSelector from "./ProductCardSelector";
import ListEditor from "../../editors/ListEditor/ListEditor";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import TagIcon from "@mui/icons-material/Tag";
import WatchIcon from "@mui/icons-material/Watch";
import {
  courseCategories,
  courseLevels,
} from "../../../data/courseEnumerations";

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
    await props.onSave(editCourse);

    setIsEditing(false);

    snack.showSuccess(
      `Il corso è stato ${!isNew ? "aggiornato" : "creato"} con successo`
    );
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
              <Typography variant="h4" color="primary.dark" fontWeight="bold">
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
              <Typography variant="h4" color="primary.dark" fontWeight="bold">
                Programma
              </Typography>
              {!isEditing ? (
                <Stack spacing={2} sx={{ mt: 3 }}>
                  {editCourse.schedule?.map((item, index) => (
                    <Stack
                      key={`schedule-${index}`}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >
                      <EventAvailableOutlinedIcon
                        fontSize="large"
                        color="secondary"
                      />
                      <Typography
                        component="div"
                        variant="h5"
                        letterSpacing={1}
                      >
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <ListEditor
                  entries={editCourse.schedule || []}
                  onChange={(schedule) =>
                    setEditCourse((prev) => ({ ...prev, schedule }))
                  }
                  entryIcon={<EventAvailableOutlinedIcon fontSize="large" />}
                  buttonText="Aggiungi voce"
                />
              )}
            </div>
            <div>
              <Typography variant="h4" color="primary.dark" fontWeight="bold">
                Durata di ogni sessione
              </Typography>
              <Box sx={{ mt: 3 }}>
                {!isEditing ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <WatchIcon fontSize="large" color="secondary" />
                    <Typography
                      variant="h5"
                      sx={{ overflowWrap: "break-word" }}
                    >
                      {Duration.fromISO(editCourse.session_duration).toHuman()}
                    </Typography>
                  </Box>
                ) : (
                  <DurationPicker
                    value={Duration.fromISO(editCourse.session_duration)}
                    onDurationChange={(d) => {
                      setEditCourse((prev) => ({
                        ...prev,
                        session_duration: d.toISO() ?? "",
                      }));
                    }}
                  />
                )}
              </Box>
            </div>
            <div>
              <Typography variant="h4" color="primary.dark" fontWeight="bold">
                Tags
              </Typography>
              {!isEditing ? (
                <Grid2 container spacing={2} sx={{ mt: 3 }}>
                  {editCourse.tags?.map((item, index) => (
                    <Grid2>
                      <Chip
                        key={`tag-${index}`}
                        label={
                          <Typography
                            component="div"
                            variant="h6"
                            letterSpacing={1}
                          >
                            {item}
                          </Typography>
                        }
                        color="primary"
                        variant="outlined" // Optional: Makes the chip outlined
                      />
                    </Grid2>
                  ))}
                </Grid2>
              ) : (
                <ListEditor
                  entries={editCourse.tags || []}
                  onChange={(tags) =>
                    setEditCourse((prev) => ({ ...prev, tags }))
                  }
                  entryIcon={<TagIcon fontSize="medium" />}
                  buttonText="Aggiungi tag"
                />
              )}
            </div>
          </Stack>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Product Card (dx screen) */}

            <ProductCard
              typeInfo="Istruttori"
              info={editCourse.instructors?.join(", ") ?? ""}
              field="instructors"
              isEditing={isEditing}
              onSave={(field, value) => {
                setEditCourse((prev) => ({
                  ...prev,
                  [field.toLowerCase()]: value
                    .toString()
                    .split(",")
                    .map((str) => str.trim()),
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

            <ProductCard
              typeInfo="Costo"
              field="cost"
              cost={editCourse.cost}
              isEditing={isEditing}
              onSave={(field, value) => {
                setEditCourse((prev) => ({
                  ...prev,
                  [field.toLowerCase()]: value,
                }));
              }}
            />

            <ProductCardSelector<CourseEntity["category"]>
              label="Categoria"
              icon={
                <FitnessCenterIcon
                  sx={{ fontSize: 48, color: "secondary.dark" }}
                />
              }
              options={courseCategories}
              value={editCourse.category}
              isEdit={isEditing}
              onChange={(v) =>
                setEditCourse((prev) => ({ ...prev, category: v }))
              }
            />

            <ProductCardSelector<CourseEntity["level"]>
              label="Livello"
              icon={
                <LiveHelpIcon sx={{ fontSize: 48, color: "secondary.dark" }} />
              }
              isEdit={isEditing}
              options={courseLevels}
              value={editCourse.level}
              onChange={(v) => setEditCourse((prev) => ({ ...prev, level: v }))}
            />
          </Stack>
        </Grid2>
      </Grid2>
    </>
  );
}
