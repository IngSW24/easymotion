import Fade from "../components/animations/Fade";
import LandingContactUsSection from "../components/landingPage/LandingContactUsSection";
import LandingCoursesSection from "../components/landingPage/LandingCourses";
import LandingFooter from "../components/landingPage/LandingFooter";
import LandingHeader from "../components/landingPage/LandingHeader";
import LandingWhoWeAreSection from "../components/landingPage/LandingWhoWeAre";

export default function LandingPage() {
  return (
    <Fade>
      <LandingHeader />
      <LandingCoursesSection />
      <LandingWhoWeAreSection />
      <LandingContactUsSection />
      <LandingFooter />
    </Fade>
  );
}
