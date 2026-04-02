"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "@/lib/api-client";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import FilteredGrid from "@/components/shared/FilteredGrid";
import HealthServiceCard from "@/components/cards/HealthServiceCard";
import HealthServiceCardSkeleton from "@/components/skeleton/HealthServiceCardSkeleton";
import type { HealthServiceItem } from "@/lib/health-services-data";

type APIService = {
  id: string;
  title: string;
  slug: string;
  image: string;
  tagline: string;
  iconKey: string;
};

const PER_PAGE = 12;

export default function HealthServicesPage() {
  const [services, setServices] = useState<HealthServiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    const res = await api.get<APIService[]>("/cms/health-services?limit=200", { auth: false });
    if (res.ok && res.data) {
      setServices(res.data.map((s) => ({
        name: s.title,
        slug: s.slug,
        image: s.image || "",
        tagline: s.tagline || "",
        iconKey: s.iconKey || "",
      })));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

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
      ? services.filter((s) => s.name.toLowerCase().includes(q))
      : [...services];

    results.sort((a, b) =>
      sort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

    return results;
  }, [services, searchQuery, sort]);

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
        emptyTitle="No health services listed yet"
        emptyMessage="Our health services directory is being updated. Please check back soon."
      />
    </>
  );
}
