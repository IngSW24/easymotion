import LandingCoursesSection from "../components/landingPage/LandingCourses";
import LandingHeader from "../components/landingPage/LandingHeader";
import LandingWhoWeAreSection from "../components/landingPage/LandingWhoWeAre";

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <LandingCoursesSection />
      <LandingWhoWeAreSection />
      {/* 
      <LandingContactUsSection />
      <Landingooter /> */}
    </>
  );
}
