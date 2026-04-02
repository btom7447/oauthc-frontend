import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import SchoolOverview from "@/components/sections/school/SchoolOverview";
import SchoolProgrammes from "@/components/sections/school/SchoolProgrammes";
import SchoolFacilities from "@/components/sections/school/SchoolFacilities";
import SchoolFaculties from "@/components/sections/school/SchoolFaculties";
import SchoolContact from "@/components/sections/school/SchoolContact";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

type APISchool = {
  name: string;
  slug: string;
  image: string;
  tagline: string;
  overview: string[];
  programmes: { name: string; duration: string; details: string }[];
  facilities: { title: string; detail: string }[];
  moreDetails: string[];
  facultyMembers: { name: string; office: string; qualification: string; image?: string }[];
  dean: string;
  email: string;
  phone: string;
};

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`${API}/cms/schools/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) notFound();

  const json = await res.json();
  const school: APISchool = json.data;

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/schools.png"
        title={school.name}
        links={[{ label: "Schools", href: "/schools" }, { label: school.name }]}
      />

      {school.overview?.length > 0 && (
        <SchoolOverview
          name={school.name}
          image={school.image}
          paragraphs={school.overview}
        />
      )}

      {school.programmes?.length > 0 && (
        <SchoolProgrammes
          programmes={school.programmes.map((p) => ({
            title: p.name,
            duration: p.duration,
            description: p.details,
          }))}
        />
      )}

      {school.facilities?.length > 0 && (
        <SchoolFacilities
          description={school.moreDetails?.length ? school.moreDetails.join(" ") : ""}
          facilities={school.facilities}
        />
      )}

      {school.facultyMembers?.length > 0 && (
        <SchoolFaculties
          members={school.facultyMembers.map((fm) => ({
            name: fm.name,
            role: fm.office,
            qualification: fm.qualification,
            image: fm.image,
          }))}
        />
      )}

      {(school.email || school.phone) && (
        <SchoolContact
          email={school.email}
          phone={school.phone}
          officeHours="Mon – Fri, 8:00 am – 4:00 pm"
          note="For admissions enquiries, prospectus requests, or general information about our programmes, please reach out to our school office directly."
        />
      )}
    </>
  );
}
