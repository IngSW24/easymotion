import CourseList from "../components/course/CourseList/CourseList";

interface CourseListPageProps {
  canEdit?: boolean;
}

/**
 * Defines the page to list all courses
 * @returns a react component
 */
export default function CourseListPage({
  canEdit = false,
}: CourseListPageProps) {
  return <CourseList canEdit={canEdit} />;
}
