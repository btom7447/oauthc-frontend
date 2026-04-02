import { notFound } from "next/navigation";
import { User, MapPin, Phone, Mail } from "lucide-react";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import DepartmentOverview from "@/components/sections/department/DepartmentOverview";
import ConditionsWeTreat from "@/components/sections/department/ConditionsWeTreat";
import DepartmentFacilities from "@/components/sections/department/DepartmentFacilities";
import ProceduresAndServices from "@/components/sections/department/ProceduresAndServices";
import ProfessionalsSection from "@/components/shared/ProfessionalSection";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

type Department = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  overview: string[];
  conditions: string[];
  facilities: { title: string; detail: string }[];
  procedures: { name: string; description: string }[];
  head: string;
  location: string;
  phone: string;
  email: string;
};

async function getDepartment(slug: string): Promise<Department | null> {
  try {
    const res = await fetch(`${API_BASE}/cms/departments/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = await getDepartment(slug);

  if (!dept) notFound();

  const hasContactInfo = dept.head || dept.location || dept.phone || dept.email;

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

      {/* Department info bar */}
      {hasContactInfo && (
        <section className="w-full bg-green-900 text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {dept.head && (
              <div className="flex items-center gap-2">
                <User size={14} strokeWidth={1.5} className="text-green-300 shrink-0" />
                <span className="text-green-100 font-medium">HOD:</span>
                <span>{dept.head}</span>
              </div>
            )}
            {dept.location && (
              <div className="flex items-center gap-2">
                <MapPin size={14} strokeWidth={1.5} className="text-green-300 shrink-0" />
                <span>{dept.location}</span>
              </div>
            )}
            {dept.phone && (
              <a href={`tel:${dept.phone}`} className="flex items-center gap-2 hover:text-green-200 transition">
                <Phone size={14} strokeWidth={1.5} className="text-green-300 shrink-0" />
                <span>{dept.phone}</span>
              </a>
            )}
            {dept.email && (
              <a href={`mailto:${dept.email}`} className="flex items-center gap-2 hover:text-green-200 transition">
                <Mail size={14} strokeWidth={1.5} className="text-green-300 shrink-0" />
                <span>{dept.email}</span>
              </a>
            )}
          </div>
        </section>
      )}

      {dept.overview.length > 0 && (
        <DepartmentOverview
          paragraphs={dept.overview}
          image={dept.image}
          name={dept.name}
        />
      )}
      {dept.conditions.length > 0 && (
        <ConditionsWeTreat conditions={dept.conditions} />
      )}
      {dept.facilities.length > 0 && (
        <DepartmentFacilities
          description={dept.description}
          facilities={dept.facilities}
        />
      )}
      {dept.procedures.length > 0 && (
        <ProceduresAndServices procedures={dept.procedures} />
      )}
      <ProfessionalsSection />
    </>
  );
}
