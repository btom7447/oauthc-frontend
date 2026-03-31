import PageBreadcrumb from "@/components/shared/breadcrumb";
import OurValuesSection from "@/components/sections/about/OurValues";
import ContactForm from "@/components/sections/contact/ContactForm";
import GetInTouchSection from "@/components/sections/about/GetInTouch";
import MapSection from "@/components/sections/contact/MapSection";
import ManagementTeamSection from "@/components/sections/about/ManagementTeam";

export default function ContactPage() {
  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/contact.jpg"
        title="Contact Us"
        links={[{ label: "Contact" }]}
      />
      <OurValuesSection />
      <ContactForm />
      <GetInTouchSection />
      <MapSection />
      <ManagementTeamSection />
    </>
  );
}
