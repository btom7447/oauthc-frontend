"use client";

import { useState, useEffect, useMemo } from "react";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import FilteredGrid from "@/components/shared/FilteredGrid";
import HealthServiceCard from "@/components/cards/HealthServiceCard";
import HealthServiceCardSkeleton from "@/components/skeleton/HealthServiceCardSkeleton";
import { ALL_HEALTH_SERVICES, type HealthServiceItem } from "@/lib/health-services-data";

const PER_PAGE = 12;

export default function HealthServicesPage() {
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
      ? ALL_HEALTH_SERVICES.filter((s) => s.name.toLowerCase().includes(q))
      : [...ALL_HEALTH_SERVICES];

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
        bgImage="/images/breadcrumb/health-services.jpg"
        title="Health Services"
        links={[{ label: "Health Services" }]}
      />
      <FilteredGrid<HealthServiceItem>
        description="OAUTHC delivers a comprehensive range of specialist health services, combining expert clinical teams, modern facilities, and a patient-first approach to care across all major medical disciplines."
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
        renderItem={(service) => (
          <HealthServiceCard key={service.slug} {...service} />
        )}
        isLoading={isLoading}
        skeletonCount={12}
        renderSkeleton={() => <HealthServiceCardSkeleton />}
      />
    </>
  );
}
