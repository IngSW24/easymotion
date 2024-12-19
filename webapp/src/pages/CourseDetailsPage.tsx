import { useParams } from "react-router";
import { Container } from "@mui/material";
import CourseDetail from "../components/course/CourseDetail/CourseDetail";
import HeroImage from "../components/ui/HeroImage/HeroImage";
import { useCourses } from "../hooks/useCourses";
import LoadingSpinner from "../components/ui/LoadingSpinner/LoadingSpinner";

export interface CourseDetailPageProps {
  canEdit?: boolean;
}

/**
 * Defines the page to view and edit details of a course
 * @returns a react component
 */
export default function CourseDetailsPage({
  canEdit = false,
}: CourseDetailPageProps) {
  const { id } = useParams();

  const courseRepo = useCourses({ fetchId: id });

  if (courseRepo.getSingle.isLoading) return <LoadingSpinner />;

  if (courseRepo.getSingle.error)
    return <div>Errore nel caricamento della pagina</div>;

  return (
    <>
      <HeroImage
        backgroundImage="/hero.jpg"
        title={courseRepo.getSingle.data?.name ?? ""}
      />
      <Container sx={{ mt: 5 }}>
        <CourseDetail id={id ?? ""} canEdit={canEdit} />
      </Container>
    </>
  );
}
