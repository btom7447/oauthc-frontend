"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "@/lib/api-client";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import FilteredGrid from "@/components/shared/FilteredGrid";
import SchoolCard, { type SchoolCardProps } from "@/components/cards/SchoolCard";
import SchoolCardSkeleton from "@/components/skeleton/SchoolCardSkeleton";

type APISchool = {
  id: string;
  name: string;
  slug: string;
  image: string;
  tagline: string;
};

type School = SchoolCardProps;

const PER_PAGE = 8;

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSchools = useCallback(async () => {
    const res = await api.get<APISchool[]>("/cms/schools?limit=200", { auth: false });
    if (res.ok && res.data) {
      setSchools(res.data.map((s) => ({ name: s.name, slug: s.slug, image: s.image || "", tagline: s.tagline || "" })));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchSchools(); }, [fetchSchools]);

  const handleSearch = (q: string) => { setSearchQuery(q); setCurrentPage(1); };
  const handleSortChange = (newSort: "asc" | "desc") => { setSort(newSort); setCurrentPage(1); };

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const results = q ? schools.filter((s) => s.name.toLowerCase().includes(q)) : [...schools];
    results.sort((a, b) => sort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    return results;
  }, [schools, searchQuery, sort]);

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
        emptyTitle="No schools listed yet"
        emptyMessage="Our affiliated schools directory is being updated. Please check back soon."
      />
    </>
  );
}
