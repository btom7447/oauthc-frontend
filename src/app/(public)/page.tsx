import AnnouncementCarousel from "@/components/sections/home/Announcement";
import BookAppointmentForm from "@/components/sections/home/BookAppointmentForm";
import CentersSection from "@/components/sections/home/CentersSection";
import DepartmentsSection from "@/components/sections/home/DepartmentsGridSection";
import HeroCarousel from "@/components/sections/home/hero";
import LearnMoreSection from "@/components/sections/home/LearnMore";
import WelcomeSection from "@/components/sections/home/Welcome";
import AppointmentPoster from "@/components/shared/AppointmentPoster";
import ProfessionalsSection from "@/components/shared/ProfessionalSection";
import TestimonialsSection from "@/components/shared/testimonials";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <AnnouncementCarousel />
      <WelcomeSection />
      <LearnMoreSection />
      <DepartmentsSection />
      <BookAppointmentForm />
      <ProfessionalsSection />
      <TestimonialsSection />
      <CentersSection />
    </>
  );
}
