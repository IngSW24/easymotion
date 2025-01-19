import { Container } from "@mui/material";
import CourseList from "../components/course/CourseList/CourseList";
import HeroImage from "../components/HeroImage/HeroImage";
import CreateCourseButton from "../components/atoms/Button/CreateCourseButton";
import { useApiClient } from "../hooks/useApiClient";
import { useEffect, useState } from "react";

/**
 * Defines the page to list all courses
 * @returns a react component
 */
export default function CourseListPage() {
  const { apiClient } = useApiClient();

  const [userRole, setUserRole] = useState<
    "USER" | "ADMIN" | "PHYSIOTHERAPIST" | undefined
  >(undefined);

  useEffect(() => {
    apiClient.auth.authControllerGetUserProfile().then((data) => {
      setUserRole(data.data.role);
    });
  }, [apiClient.auth]);

  return (
    <>
      <HeroImage
        backgroundImage="/hero.jpg"
        //title="Trova il tuo prossimo corso"
        title="Il tuo benessere inizia qui: fisioterapia d’eccellenza e allenamenti su misura, tutto in un unico posto!"
        fontWeight={400}
      />
      <Container maxWidth="xl" sx={{ p: 5 }}>
        <CourseList
          canEdit={userRole == "ADMIN" || userRole == "PHYSIOTHERAPIST"}
        />
        {(userRole == "ADMIN" || userRole == "PHYSIOTHERAPIST") && (
          <CreateCourseButton />
        )}
      </Container>
    </>
  );
}
