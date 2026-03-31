import PageBreadcrumb from "@/components/shared/breadcrumb";
import WhoWeAreSection from "@/components/sections/about/WhoWeAre";
import VisionMissionGoalSection from "@/components/sections/about/VisionMissionGoal";
import PeopleAndCultureSection from "@/components/sections/about/PeopleAndCulture";
import ManagementTeamSection from "@/components/sections/about/ManagementTeam";
import OurValuesSection from "@/components/sections/about/OurValues";
import GetInTouchSection from "@/components/sections/about/GetInTouch";
import ProfessionalsSection from "@/components/shared/ProfessionalSection";

export const metadata = {
  title: "About Us | OAUTHC",
  description:
    "Learn about Obafemi Awolowo University Teaching Hospitals Complex — our mission, history, and commitment to transforming healthcare in Nigeria.",
};

export default function AboutPage() {
  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/about.png"
        title="About OAUTHC"
        links={[{ label: "About", href: "/about" }, { label: "About OAUTHC" }]}
      />
      <WhoWeAreSection />
      <VisionMissionGoalSection />
      <ProfessionalsSection />
      <PeopleAndCultureSection />
      <ManagementTeamSection />
      <OurValuesSection />
      <GetInTouchSection />
    </>
  );
}
