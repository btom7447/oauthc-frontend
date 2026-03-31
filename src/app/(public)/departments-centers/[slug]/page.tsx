import PageBreadcrumb from "@/components/shared/breadcrumb";
import DepartmentOverview from "@/components/sections/department/DepartmentOverview";
import ConditionsWeTreat from "@/components/sections/department/ConditionsWeTreat";
import DepartmentFacilities from "@/components/sections/department/DepartmentFacilities";
import ProceduresAndServices from "@/components/sections/department/ProceduresAndServices";
import DepartmentAppointmentCTA from "@/components/sections/department/DepartmentAppointmentCTA";
import ProfessionalsSection from "@/components/shared/ProfessionalSection";

// TODO: replace with CMS/API fetch using `slug`
function getDepartmentData(slug: string) {
  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    name,
    image: "/images/departments/placeholder.jpg",
    overview: [
      `The Department of ${name} at OAUTHC is one of the foremost specialist units in West Africa, delivering expert diagnosis, treatment, and management of a wide range of complex medical conditions.`,
      "Our multidisciplinary team of consultants, resident doctors, nurses, and allied health professionals work collaboratively to ensure every patient receives individualised, evidence-based care. We are committed to integrating the latest clinical research into our day-to-day practice.",
      "The department runs both inpatient and outpatient services, including specialist clinics, emergency cover, and elective procedures. We also play an active role in training postgraduate medical professionals and conducting clinical research affiliated with Obafemi Awolowo University.",
    ],
    conditions: [
      "Acute & Chronic Disease Management",
      "Inflammatory Disorders",
      "Infectious Disease Complications",
      "Congenital & Hereditary Conditions",
      "Post-Surgical Follow-up Care",
      "Metabolic & Hormonal Disorders",
      "Trauma & Emergency Presentations",
      "Cancer Screening & Management",
      "Paediatric & Adult Presentations",
    ],
    facilities: [
      {
        title: "Specialist Outpatient Clinics",
        detail: "Dedicated clinic days for new and follow-up patients with direct consultant access.",
      },
      {
        title: "Diagnostic Laboratory",
        detail: "On-site laboratory with rapid-turnaround testing for routine and specialist investigations.",
      },
      {
        title: "Modern Procedure Suite",
        detail: "Fully equipped rooms for minor and intermediate procedures under sterile conditions.",
      },
      {
        title: "Imaging & Radiology Access",
        detail: "Direct referral pathway to our radiology department for X-ray, ultrasound, CT and MRI.",
      },
      {
        title: "Inpatient Ward",
        detail: "Dedicated ward beds with 24-hour nursing cover and daily consultant ward rounds.",
      },
      {
        title: "Telemedicine Consultations",
        detail: "Remote follow-up appointments available for stable patients and post-discharge reviews.",
      },
    ],
    procedures: [
      {
        name: "Specialist Consultation",
        description: "One-on-one assessments with our consultant specialists for diagnosis and treatment planning.",
      },
      {
        name: "Diagnostic Workup",
        description: "Comprehensive blood panels, imaging, and functional tests tailored to your condition.",
      },
      {
        name: "Therapeutic Procedures",
        description: "Evidence-based interventional procedures performed by experienced clinical teams.",
      },
      {
        name: "Disease Monitoring",
        description: "Structured follow-up programmes to track disease progression and treatment response.",
      },
      {
        name: "Surgical Referral & Co-management",
        description: "Coordinated care pathways with surgical teams for conditions requiring operative management.",
      },
      {
        name: "Patient Education & Rehabilitation",
        description: "Structured programmes to help patients manage their conditions and improve quality of life.",
      },
    ],
  };
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = getDepartmentData(slug);

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/departments-centers.jpg"
        title={dept.name}
        links={[
          { label: "Departments & Centers", href: "/departments-centers" },
          { label: dept.name },
        ]}
      />
      <DepartmentOverview
        paragraphs={dept.overview}
        image={dept.image}
        name={dept.name}
      />
      <ConditionsWeTreat conditions={dept.conditions} />
      <DepartmentFacilities
        description="Our department is equipped with modern infrastructure designed to support accurate diagnosis, effective treatment, and a comfortable patient experience."
        facilities={dept.facilities}
      />
      <ProceduresAndServices procedures={dept.procedures} />
      <ProfessionalsSection />
    </>
  );
}
