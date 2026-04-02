"use client";

import { useState, useEffect, useMemo } from "react";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import FilteredGrid from "@/components/shared/FilteredGrid";
import DoctorCard from "@/components/cards/DoctorCard";
import DoctorCardSkeleton from "@/components/skeleton/DoctorCardSkeleton";
import { api } from "@/lib/api-client";

type Doctor = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  gender: "male" | "female";
  specialty: string;
  yearsOfExperience: number;
  languages: string[];
  center: string;
  qualifications: string[];
  bio?: string[];
  expertise?: string[];
  education?: { degree: string; institution: string; year: string }[];
  social?: { linkedin?: string; facebook?: string; instagram?: string };
};

const PER_PAGE = 9;

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await api.get<Doctor[]>("/cms/doctors?limit=200", { auth: false });
      if (res.ok && res.data) setDoctors(res.data);
      setIsLoading(false);
    })();
  }, []);

  const specialties = useMemo(
    () => [...new Set(doctors.map((d) => d.specialty))].sort(),
    [doctors]
  );

  const languages = useMemo(
    () => [...new Set(doctors.flatMap((d) => d.languages))].sort(),
    [doctors]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let results = doctors.filter((d) => {
      if (q && !d.name.toLowerCase().includes(q)) return false;
      if (specialty && d.specialty !== specialty) return false;
      if (gender && d.gender !== gender) return false;
      if (language && !d.languages.includes(language)) return false;
      return true;
    });

    results = [...results].sort((a, b) =>
      sort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

    return results;
  }, [doctors, searchQuery, specialty, gender, language, sort]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: "asc" | "desc") => {
    setSort(newSort);
    setCurrentPage(1);
  };

  const handleSpecialty = (val: string) => {
    setSpecialty(val);
    setCurrentPage(1);
  };

  const handleGender = (val: string) => {
    setGender(val);
    setCurrentPage(1);
  };

  const handleLanguage = (val: string) => {
    setLanguage(val);
    setCurrentPage(1);
  };

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const selectClass =
    "border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-green-700 cursor-pointer";

  const additionalFilters = (
    <>
      <select value={specialty} onChange={(e) => handleSpecialty(e.target.value)} className={selectClass}>
        <option value="">All Specialties</option>
        {specialties.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select value={gender} onChange={(e) => handleGender(e.target.value)} className={selectClass}>
        <option value="">All Genders</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <select value={language} onChange={(e) => handleLanguage(e.target.value)} className={selectClass}>
        <option value="">All Languages</option>
        {languages.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
    </>
  );

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/doctors.png"
        title="Our Doctors"
        links={[{ label: "Doctors" }]}
      />
      <FilteredGrid<Doctor>
        description="Meet our team of specialist consultants and doctors dedicated to delivering expert, compassionate healthcare across all disciplines."
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
        renderItem={(doctor) => <DoctorCard key={doctor.slug} doctor={doctor} />}
        isLoading={isLoading}
        skeletonCount={9}
        renderSkeleton={() => <DoctorCardSkeleton />}
        additionalFilters={additionalFilters}
        emptyTitle="No doctors listed yet"
        emptyMessage="Our doctor directory is being updated. Please check back soon."
      />
    </>
  );
}
