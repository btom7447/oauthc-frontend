"use client";

import { useState, useEffect, useMemo } from "react";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import FilteredGrid from "@/components/shared/FilteredGrid";
import DoctorCard from "@/components/cards/DoctorCard";
import DoctorCardSkeleton from "@/components/skeleton/DoctorCardSkeleton";

type Doctor = {
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

const ALL_DOCTORS: Doctor[] = [
  {
    name: "Dr. Adebayo Ogundimu",
    slug: "dr-adebayo-ogundimu",
    gender: "male",
    specialty: "Cardiology",
    yearsOfExperience: 18,
    languages: ["English", "Yoruba"],
    center: "OAUTHC Main Campus",
    qualifications: ["MBBS", "FWACP", "FESC"],
    social: { linkedin: "#", facebook: "#" },
  },
  {
    name: "Dr. Ngozi Eze",
    slug: "dr-ngozi-eze",
    gender: "female",
    specialty: "Neurology",
    yearsOfExperience: 12,
    languages: ["English", "Igbo"],
    center: "OAUTHC Main Campus",
    qualifications: ["MBBS", "FMCP"],
    social: { linkedin: "#" },
  },
  {
    name: "Dr. Fatima Suleiman",
    slug: "dr-fatima-suleiman",
    gender: "female",
    specialty: "Paediatrics",
    yearsOfExperience: 9,
    languages: ["English", "Hausa", "Yoruba"],
    center: "Wesley Guild Hospital",
    qualifications: ["MBBS", "FWACP (Paed)"],
    image: undefined,
    social: { facebook: "#", instagram: "#" },
  },
  {
    name: "Dr. Chukwuemeka Obi",
    slug: "dr-chukwuemeka-obi",
    gender: "male",
    specialty: "Orthopaedics",
    yearsOfExperience: 22,
    languages: ["English", "Igbo"],
    center: "OAUTHC Main Campus",
    qualifications: ["MBBS", "FWACS"],
    social: { linkedin: "#" },
  },
  {
    name: "Dr. Adesola Adewale",
    slug: "dr-adesola-adewale",
    gender: "female",
    specialty: "Oncology",
    yearsOfExperience: 14,
    languages: ["English", "Yoruba"],
    center: "OAUTHC Main Campus",
    qualifications: ["MBBS", "FMCP", "MSc Oncology"],
    social: { linkedin: "#", instagram: "#" },
  },
  {
    name: "Dr. Musa Ibrahim",
    slug: "dr-musa-ibrahim",
    gender: "male",
    specialty: "General Surgery",
    yearsOfExperience: 16,
    languages: ["English", "Hausa"],
    center: "Wesley Guild Hospital",
    qualifications: ["MBBS", "FWACS"],
    image: undefined,
  },
  {
    name: "Dr. Chinwe Okafor",
    slug: "dr-chinwe-okafor",
    gender: "female",
    specialty: "Dermatology",
    yearsOfExperience: 8,
    languages: ["English", "Igbo"],
    center: "OAUTHC Main Campus",
    qualifications: ["MBBS", "FMCP (Derm)"],
    social: { instagram: "#", linkedin: "#" },
  },
  {
    name: "Dr. Kehinde Lawal",
    slug: "dr-kehinde-lawal",
    gender: "male",
    specialty: "Cardiology",
    yearsOfExperience: 20,
    languages: ["English", "Yoruba", "Hausa"],
    center: "OAUTHC Main Campus",
    qualifications: ["MBBS", "FACC", "FESC"],
    social: { linkedin: "#", facebook: "#" },
  },
  {
    name: "Dr. Blessing Nwosu",
    slug: "dr-blessing-nwosu",
    gender: "female",
    specialty: "Obstetrics & Gynaecology",
    yearsOfExperience: 11,
    languages: ["English", "Igbo"],
    center: "Wesley Guild Hospital",
    qualifications: ["MBBS", "FWACS"],
    image: undefined,
    social: { facebook: "#" },
  },
  {
    name: "Dr. Rotimi Adeyemi",
    slug: "dr-rotimi-adeyemi",
    gender: "male",
    specialty: "Neurology",
    yearsOfExperience: 15,
    languages: ["English", "Yoruba"],
    center: "OAUTHC Main Campus",
    qualifications: ["MBBS", "FMCP", "PhD"],
    social: { linkedin: "#" },
  },
  {
    name: "Dr. Halima Abdullahi",
    slug: "dr-halima-abdullahi",
    gender: "female",
    specialty: "Paediatrics",
    yearsOfExperience: 7,
    languages: ["English", "Hausa"],
    center: "Wesley Guild Hospital",
    qualifications: ["MBBS", "FWACP (Paed)"],
    image: undefined,
    social: { instagram: "#" },
  },
  {
    name: "Dr. Segun Badmus",
    slug: "dr-segun-badmus",
    gender: "male",
    specialty: "Orthopaedics",
    yearsOfExperience: 13,
    languages: ["English", "Yoruba", "Igbo"],
    center: "OAUTHC Main Campus",
    qualifications: ["MBBS", "FWACS", "MCh Orth"],
    social: { linkedin: "#", facebook: "#" },
  },
];

const PER_PAGE = 9;

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const specialties = useMemo(
    () => [...new Set(ALL_DOCTORS.map((d) => d.specialty))].sort(),
    []
  );

  const languages = useMemo(
    () => [...new Set(ALL_DOCTORS.flatMap((d) => d.languages))].sort(),
    []
  );

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let results = ALL_DOCTORS.filter((d) => {
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
  }, [searchQuery, specialty, gender, language, sort]);

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
      {/* DoctorCard is a horizontal card — a 2-column grid looks best (lg:grid-cols-2).
          FilteredGrid uses its own grid class (4-col default). Cards still display
          correctly at any column count since they have intrinsic horizontal layout. */}
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
      />
    </>
  );
}
