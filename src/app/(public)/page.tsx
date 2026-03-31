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

  const announcements = [
    {
      id: 1,
      name: "Welcome to OAUTHC",
      content: "Serving excellence in healthcare.",
      image: "/images/hero-carousel/image-one.png",
      link: "/about",
      featured: true,
    },
    {
      id: 2,
      name: "Book Your Appointment Online — Now Available",
      content:
        "You can now schedule consultations with our specialists directly from our website. Select your preferred date, time, and department — all from the comfort of your home. No queues, no calls needed.",
      image: "/images/hero-carousel/image-one.png",
      link: "/#bookingForm",
    },
    {
      id: 3,
      name: "Free Community Health Outreach — April 2026",
      content:
        "OAUTHC is hosting a free health screening and outreach programme for residents of Ile-Ife and environs. Services include blood pressure checks, blood sugar tests, eye screening, and free consultations. Join us at the OAUTHC Sports Complex on April 19, 2026.",
      image: "/images/hero-carousel/image-one.png",
      link: "/events/health-outreach-april-2026",
    },
  ];

  return (
    <>
      <HeroCarousel />
      <AnnouncementCarousel items={announcements} />
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
