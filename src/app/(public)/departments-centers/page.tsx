"use client";

import { useState, useEffect, useMemo } from "react";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import FilteredGrid from "@/components/shared/FilteredGrid";
import DepartmentCard from "@/components/cards/DepartmentCard";
import DepartmentGridSkeleton from "@/components/skeleton/DepartmentGridSkeleton";
import TestimonialsSection from "@/components/shared/testimonials";
import { api } from "@/lib/api-client";

type Department = {
  id: string;
  name: string;
  slug: string;
  image: string;
};

const PER_PAGE = 12;

export default function DepartmentsCentersPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await api.get<Department[]>("/cms/departments?limit=100", { auth: false });
      if (res.ok && res.data) setDepartments(res.data);
      setIsLoading(false);
    })();
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
      ? departments.filter((d) => d.name.toLowerCase().includes(q))
      : [...departments];

    results.sort((a, b) =>
      sort === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    return results;
  }, [departments, searchQuery, sort]);

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
