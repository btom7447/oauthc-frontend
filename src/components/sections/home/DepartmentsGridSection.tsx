"use client";

import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DepartmentSkeletonCards } from "@/components/skeleton/DepartmentSkeletonCard";
import { api } from "@/lib/api-client";

type Department = {
  id: string;
  name: string;
  slug: string;
};

function DepartmentCard({
  dept,
  index,
}: {
  dept: { name: string; slug: string };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      style={{ transform: "translateZ(0)" }}
    >
      <Link
        href={`/departments-centers/${dept.slug}`}
        className="group block rounded-lg border border-gray-200 px-5 py-10 text-center transition-all duration-300 hover:bg-green-900 hover:shadow-lg"
      >
        <div className="flex flex-col items-center gap-3">
          <HeartPulse
            size={45}
            strokeWidth={1}
            className="text-red-600 group-hover:text-white transition-colors duration-300"
          />
          <h4 className="text-sm md:text-base text-gray-800 group-hover:text-white transition-colors duration-300">
            {dept.name}
          </h4>
        </div>
      </Link>
    </motion.div>
  );
}

export default function DepartmentsSection() {
  const [data, setData] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await api.get<Department[]>("/cms/departments?limit=8", { auth: false });
      if (res.ok && res.data) setData(res.data);
      setLoading(false);
    })();
  }, []);

  return (
    <section className="w-full bg-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div>
          <p className="text-green-900 uppercase text-lg text-center font-semibold">
            We solve the world's most serious and complex medical challenges
          </p>
          <h2 className="text-red-600 text-3xl md:text-5xl font-semibold text-center font-yeseva mt-2">
            Departments & Focus Areas
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <DepartmentSkeletonCards key={i} />
              ))
            : data.map((dept, index) => (
                <DepartmentCard key={dept.id} dept={dept} index={index} />
              ))}
        </div>
      </div>
    </section>
  );
}
