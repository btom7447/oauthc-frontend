"use client";

import ProfessionalCard, {
  ProfessionalCardSkeleton,
} from "@/components/shared/ProfessionalCard";
import { useEffect, useState } from "react";

type Management = {
  name: string;
  role: string;
  slug: string;
  image: string;
  social?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
};

const managementTeam: Management[] = [
  {
    name: "Olarewaju Olajide Omonije",
    role: "Acting Director of Administration",
    slug: "",
    image: "/images/management/ad.png",
    social: { linkedin: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Prof. John A. O. Okeniyi",
    role: "Chief Medical Director",
    slug: "",
    image: "/images/management/cmd.png",
    social: { linkedin: "#", instagram: "#", facebook: "#" },
  },
  {
    name: "Prof. Josephine E. A. Eziyi",
    role: "Chief Medical Director",
    slug: "",
    image: "/images/management/md.png",
    social: { linkedin: "#", instagram: "#", facebook: "#" },
  },
];

export default function ManagementTeamSection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="w-full bg-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="text-center">
          <p className="text-green-900 uppercase text-xl font-semibold tracking-wide">
            Management Team
          </p>
          <h2 className="text-red-600 text-3xl md:text-5xl font-semibold font-yeseva mt-2">
            The Brains Behind OAUTHC
          </h2>
        </div>

        {/* Grid — always 3 cards, no carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <ProfessionalCardSkeleton key={i} />
              ))
            : managementTeam.map((member) => (
                <ProfessionalCard key={member.name} prof={member} clickable={false} />
              ))}
        </div>
      </div>
    </section>
  );
}
