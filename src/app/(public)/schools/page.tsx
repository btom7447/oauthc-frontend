"use client";

import { useState, useEffect, useMemo } from "react";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import FilteredGrid from "@/components/shared/FilteredGrid";
import SchoolCard, { type SchoolCardProps } from "@/components/cards/SchoolCard";
import SchoolCardSkeleton from "@/components/skeleton/SchoolCardSkeleton";

type School = SchoolCardProps;

const ALL_SCHOOLS: School[] = [
  {
    name: "School of Nursing",
    slug: "school-of-nursing",
    image: "/images/schools/nursing.jpg",
    tagline: "Producing compassionate, skilled nursing professionals",
  },
  {
    name: "School of Midwifery",
    slug: "school-of-midwifery",
    image: "/images/schools/midwifery.jpg",
    tagline: "Excellence in maternal and newborn care education",
  },
  {
    name: "School of Medical Laboratory Science",
    slug: "school-of-medical-laboratory-science",
    image: "/images/schools/medical-lab.jpg",
    tagline: "Training diagnostic scientists for modern healthcare",
  },
  {
    name: "School of Perioperative Nursing",
    slug: "school-of-perioperative-nursing",
    image: "/images/schools/perioperative.jpg",
    tagline: "Specialist training in surgical and anaesthesia nursing",
  },
  {
    name: "School of Health Information Management",
    slug: "school-of-health-information-management",
    image: "/images/schools/health-information.jpg",
    tagline: "Managing healthcare data and records with precision",
  },
  {
    name: "School of Community Health",
    slug: "school-of-community-health",
    image: "/images/schools/community-health.jpg",
    tagline: "Delivering preventive and primary healthcare at the grassroots",
  },
  {
    name: "School of Pharmacy Technicians",
    slug: "school-of-pharmacy-technicians",
    image: "/images/schools/pharmacy.jpg",
    tagline: "Training skilled support for pharmaceutical practice",
  },
  {
    name: "School of Basic Medical Sciences",
    slug: "school-of-basic-medical-sciences",
    image: "/images/schools/basic-medical.jpg",
    tagline: "Foundational sciences underpinning clinical excellence",
  },
];

const PER_PAGE = 8;

export default function SchoolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: "asc" | "desc") => {
    setSort(newSort);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const results = q
      ? ALL_SCHOOLS.filter((s) => s.name.toLowerCase().includes(q))
      : [...ALL_SCHOOLS];

    results.sort((a, b) =>
      sort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

    return results;
  }, [searchQuery, sort]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/schools.png"
        title="Our Schools"
        links={[{ label: "Schools" }]}
      />
      <FilteredGrid<School>
        description="OAUTHC operates several accredited schools of health sciences, equipping the next generation of healthcare professionals with the knowledge, skills, and values to serve with excellence."
        items={paginated}
        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        perPage={PER_PAGE}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        sort={sort}
        searchQuery={searchQuery}
        renderItem={(school) => <SchoolCard key={school.slug} {...school} />}
        isLoading={isLoading}
        skeletonCount={8}
        renderSkeleton={() => <SchoolCardSkeleton />}
      />
    </>
  );
}
