import PageBreadcrumb from "@/components/shared/breadcrumb";
import SchoolOverview from "@/components/sections/school/SchoolOverview";
import SchoolProgrammes from "@/components/sections/school/SchoolProgrammes";
import SchoolFacilities from "@/components/sections/school/SchoolFacilities";
import SchoolFaculties from "@/components/sections/school/SchoolFaculties";
import SchoolContact from "@/components/sections/school/SchoolContact";

type Programme = { title: string; duration: string; description: string };
type Facility = { title: string; detail: string };
type FacultyMember = { name: string; role: string; qualification: string; image?: string };

type School = {
  name: string;
  slug: string;
  image: string;
  tagline: string;
  overview: string[];
  programmes: Programme[];
  facilities: { description: string; items: Facility[] };
  faculty: FacultyMember[];
  contact: { email: string; phone: string; officeHours: string; note: string };
};

function getSchoolData(slug: string): School {
  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    name,
    slug,
    image: `/images/schools/${slug}.jpg`,
    tagline: "Shaping the future of healthcare through education",
    overview: [
      `The ${name} at the Obafemi Awolowo University Teaching Hospitals Complex (OAUTHC) is one of the most respected health sciences training institutions in Nigeria. Established with a mandate to produce highly competent and compassionate healthcare professionals, the school has maintained a tradition of academic rigour and clinical excellence since its inception.`,
      "Our programmes are fully accredited by the relevant national regulatory bodies and designed to meet both local and international standards. Students benefit from hands-on clinical training within the OAUTHC ecosystem — one of the largest teaching hospital complexes in West Africa — gaining real-world experience under the supervision of experienced consultants and educators.",
      "We are committed to nurturing not just technical competence but also the ethical foundations and interpersonal skills that define truly outstanding healthcare professionals. Our graduates serve with distinction across hospitals, clinics, and health agencies throughout Nigeria and beyond.",
    ],
    programmes: [
      {
        title: "Basic Certificate Programme",
        duration: "2 – 3 Years",
        description:
          "An entry-level qualification that equips students with foundational knowledge and practical skills for immediate clinical deployment.",
      },
      {
        title: "Post-Basic Specialist Programme",
        duration: "1 – 2 Years",
        description:
          "Advanced training for qualified professionals looking to specialise in a specific area of healthcare practice.",
      },
      {
        title: "Continuing Professional Development",
        duration: "Short Courses",
        description:
          "Flexible short courses and workshops designed to keep practising professionals current with evolving clinical guidelines and technology.",
      },
    ],
    facilities: {
      description:
        "Our campus is equipped with modern infrastructure to support both theoretical learning and hands-on clinical training.",
      items: [
        {
          title: "Clinical Skills Laboratory",
          detail: "A fully equipped simulation lab for practising procedures in a safe, supervised environment before entering the ward.",
        },
        {
          title: "E-Learning Centre",
          detail: "Computer suites with high-speed internet access and access to local and international medical databases and journals.",
        },
        {
          title: "Lecture Theatres",
          detail: "Air-conditioned lecture halls with audio-visual equipment to facilitate interactive and engaging academic sessions.",
        },
        {
          title: "Library & Resource Centre",
          detail: "An extensive collection of textbooks, journals, and multimedia resources with dedicated study spaces.",
        },
        {
          title: "Student Common Room",
          detail: "Comfortable recreation and rest areas where students can unwind between sessions.",
        },
        {
          title: "Clinical Placement Units",
          detail: "Direct access to ward placements and clinical rotations within OAUTHC's specialist departments.",
        },
      ],
    },
    faculty: [
      {
        name: "Mrs. Adunola Adeyemi",
        role: "Principal/Head of School",
        qualification: "BNSc, MSc (Nursing Ed.), FWACN",
      },
      {
        name: "Mr. Babatunde Olatunji",
        role: "Senior Tutor",
        qualification: "BNSc, PGDip, MSc",
      },
      {
        name: "Mrs. Chioma Nwosu",
        role: "Clinical Tutor",
        qualification: "BNSc, RN, RM",
      },
      {
        name: "Mr. Emeka Okafor",
        role: "Tutor",
        qualification: "BNSc, PGDE",
      },
    ],
    contact: {
      email: `schools.${slug.split("-").pop()}@oauthc.edu.ng`,
      phone: "+234 036 230 050",
      officeHours: "Mon – Fri, 8:00 am – 4:00 pm",
      note:
        "For admissions enquiries, prospectus requests, or general information about our programmes, please reach out to our school office directly. Our team is available during office hours to assist you.",
    },
  };
}

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = getSchoolData(slug);

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/schools.png"
        title={school.name}
        links={[{ label: "Schools", href: "/schools" }, { label: school.name }]}
      />
      <SchoolOverview
        name={school.name}
        image={school.image}
        paragraphs={school.overview}
      />
      <SchoolProgrammes programmes={school.programmes} />
      <SchoolFacilities
        description={school.facilities.description}
        facilities={school.facilities.items}
      />
      <SchoolFaculties members={school.faculty} />
      <SchoolContact
        email={school.contact.email}
        phone={school.contact.phone}
        officeHours={school.contact.officeHours}
        note={school.contact.note}
      />
    </>
  );
}
