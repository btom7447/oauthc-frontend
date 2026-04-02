import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import DoctorHero from "@/components/sections/doctor/DoctorHero";
import DoctorAbout from "@/components/sections/doctor/DoctorAbout";
import DoctorExpertise from "@/components/sections/doctor/DoctorExpertise";
import DoctorEducation from "@/components/sections/doctor/DoctorEducation";
import ProfessionalsSection from "@/components/shared/ProfessionalSection";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

type Doctor = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  gender: "male" | "female";
  specialty: string;
  yearsOfExperience: number;
  languages: string[];
  center: string;
  qualifications: string[];
  bio?: string[];
  expertise?: string[];
  education?: { degree: string; institution: string; year: string }[];
  social?: { linkedin?: string; facebook?: string; instagram?: string };
};

async function getDoctor(slug: string): Promise<Doctor | null> {
  try {
    const res = await fetch(`${API_BASE}/cms/doctors/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = await getDoctor(slug);

  if (!doctor) notFound();

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/doctors.png"
        title={doctor.name}
        links={[
          { label: "Doctors", href: "/doctors" },
          { label: doctor.name },
        ]}
      />
      <DoctorHero doctor={doctor} />
      {doctor.bio && doctor.bio.length > 0 && <DoctorAbout bio={doctor.bio} />}
      {doctor.expertise && doctor.expertise.length > 0 && <DoctorExpertise expertise={doctor.expertise} />}
      {doctor.education && doctor.education.length > 0 && <DoctorEducation education={doctor.education} />}
      <ProfessionalsSection />
    </>
  );
}
