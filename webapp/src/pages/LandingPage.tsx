import LandingContactUsSection from "../components/landingPage/LandingContactUsSection";
import LandingCoursesSection from "../components/landingPage/LandingCourses";
import LandingFooter from "../components/landingPage/LandingFooter";
import LandingHeader from "../components/landingPage/LandingHeader";
import LandingWhoWeAreSection from "../components/landingPage/LandingWhoWeAre";

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <LandingCoursesSection />
      <LandingWhoWeAreSection />
      <LandingContactUsSection />
      <LandingFooter />
    </>
  );
}
