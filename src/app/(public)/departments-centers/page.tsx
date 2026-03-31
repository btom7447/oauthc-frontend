"use client";

import { useState, useEffect, useMemo } from "react";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import FilteredGrid from "@/components/shared/FilteredGrid";
import DepartmentCard from "@/components/cards/DepartmentCard";
import DepartmentGridSkeleton from "@/components/skeleton/DepartmentGridSkeleton";
import TestimonialsSection from "@/components/shared/testimonials";

type Department = {
  name: string;
  slug: string;
  image: string;
};

const ALL_DEPARTMENTS: Department[] = [
  { name: "Cardiology", slug: "cardiology", image: "/images/departments/cardiology.jpg" },
  { name: "Neurology", slug: "neurology", image: "/images/departments/placeholder.jpg" },
  { name: "Oncology", slug: "oncology", image: "/images/departments/placeholder.jpg" },
  { name: "Paediatrics", slug: "paediatrics", image: "/images/departments/placeholder.jpg" },
  { name: "Obstetrics & Gynaecology", slug: "obstetrics-gynaecology", image: "/images/departments/placeholder.jpg" },
  { name: "Orthopaedics", slug: "orthopaedics", image: "/images/departments/placeholder.jpg" },
  { name: "Radiology", slug: "radiology", image: "/images/departments/placeholder.jpg" },
  { name: "Ophthalmology", slug: "ophthalmology", image: "/images/departments/placeholder.jpg" },
  { name: "Dermatology", slug: "dermatology", image: "/images/departments/placeholder.jpg" },
  { name: "ENT", slug: "ent", image: "/images/departments/placeholder.jpg" },
  { name: "General Surgery", slug: "general-surgery", image: "/images/departments/placeholder.jpg" },
  { name: "Urology", slug: "urology", image: "/images/departments/placeholder.jpg" },
  { name: "Psychiatry", slug: "psychiatry", image: "/images/departments/placeholder.jpg" },
  { name: "Haematology", slug: "haematology", image: "/images/departments/placeholder.jpg" },
  { name: "Endocrinology", slug: "endocrinology", image: "/images/departments/placeholder.jpg" },
  { name: "Gastroenterology", slug: "gastroenterology", image: "/images/departments/placeholder.jpg" },
  { name: "Nephrology", slug: "nephrology", image: "/images/departments/placeholder.jpg" },
  { name: "Pulmonology", slug: "pulmonology", image: "/images/departments/placeholder.jpg" },
  { name: "Rheumatology", slug: "rheumatology", image: "/images/departments/placeholder.jpg" },
  { name: "Anaesthesia", slug: "anaesthesia", image: "/images/departments/placeholder.jpg" },
];

const PER_PAGE = 12;

export default function DepartmentsCentersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Reset to page 1 on search or sort change
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
      ? ALL_DEPARTMENTS.filter((d) => d.name.toLowerCase().includes(q))
      : [...ALL_DEPARTMENTS];

    results.sort((a, b) =>
      sort === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    return results;
  }, [searchQuery, sort]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/departments-centers.jpg"
        title="Departments & Centers"
        links={[{ label: "Departments & Centers" }]}
      />
      <FilteredGrid<Department>
        description="Explore our wide range of specialist departments and clinical centres, each staffed by expert teams dedicated to delivering world-class care."
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
        renderItem={(dept) => (
          <DepartmentCard key={dept.slug} {...dept} />
        )}
        isLoading={isLoading}
        skeletonCount={8}
        renderSkeleton={() => <DepartmentGridSkeleton />}
      />
      <TestimonialsSection />
    </>
  );
}
