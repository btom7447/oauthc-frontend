import PageBreadcrumb from "@/components/shared/breadcrumb";
import DoctorHero from "@/components/sections/doctor/DoctorHero";
import DoctorAbout from "@/components/sections/doctor/DoctorAbout";
import DoctorExpertise from "@/components/sections/doctor/DoctorExpertise";
import DoctorEducation from "@/components/sections/doctor/DoctorEducation";
import ProfessionalsSection from "@/components/shared/ProfessionalSection";
import DepartmentAppointmentCTA from "@/components/sections/department/DepartmentAppointmentCTA";

type Doctor = {
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

function getDoctorData(slug: string): Doctor {
  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    name,
    slug,
    gender: "male",
    specialty: "Cardiology",
    qualifications: ["MBBS", "FWACP", "FESC"],
    yearsOfExperience: 15,
    center: "OAUTHC Main Campus",
    languages: ["English", "Yoruba"],
    bio: [
      `${name} is a consultant cardiologist at the Obafemi Awolowo University Teaching Hospitals Complex (OAUTHC), Ile-Ife, with over 15 years of dedicated experience in the diagnosis and management of complex cardiovascular conditions. He completed his undergraduate medical training at the College of Health Sciences, Obafemi Awolowo University, and subsequently obtained fellowship of the West African College of Physicians.`,
      "His clinical practice encompasses a broad range of heart conditions including coronary artery disease, heart failure, valvular heart disease, hypertension, and cardiac arrhythmias. He is deeply committed to evidence-based medicine and integrates the latest international guidelines into his patient care, ensuring each individual receives a personalised treatment plan tailored to their unique clinical profile.",
      "Beyond direct patient care, he is actively involved in postgraduate medical education, serving as a facilitator and examiner for the West African College of Physicians. His research interests lie in cardiovascular epidemiology in sub-Saharan Africa, and he has contributed to numerous peer-reviewed publications and national cardiology conference proceedings.",
    ],
    expertise: [
      "Coronary Artery Disease Management",
      "Heart Failure & Cardiomyopathy",
      "Hypertensive Heart Disease",
      "Cardiac Arrhythmia & Electrophysiology",
      "Valvular Heart Disease",
      "Echocardiography & Cardiac Imaging",
      "Preventive Cardiology",
      "Perioperative Cardiac Assessment",
    ],
    education: [
      {
        degree: "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
        institution: "Obafemi Awolowo University, Ile-Ife",
        year: "2003",
      },
      {
        degree: "Fellowship of the West African College of Physicians (FWACP)",
        institution: "West African College of Physicians, Lagos",
        year: "2011",
      },
      {
        degree: "Fellowship of the European Society of Cardiology (FESC)",
        institution: "European Society of Cardiology",
        year: "2016",
      },
    ],
    social: {
      linkedin: "#",
    },
  };
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = getDoctorData(slug);

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
      {doctor.bio && <DoctorAbout bio={doctor.bio} />}
      {doctor.expertise && <DoctorExpertise expertise={doctor.expertise} />}
      {doctor.education && <DoctorEducation education={doctor.education} />}
      <ProfessionalsSection />
    </>
  );
}
