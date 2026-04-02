"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Search, Info } from "lucide-react";
import { api } from "@/lib/api-client";
import PageBreadcrumb from "@/components/shared/breadcrumb";

type APITest = {
  id: string;
  name: string;
  slug: string;
  category: string;
};

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function TestsProceduresPage() {
  const [tests, setTests] = useState<APITest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLetter, setActiveLetter] = useState("A");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTests = useCallback(async () => {
    const res = await api.get<APITest[]>("/cms/tests?limit=500", { auth: false });
    if (res.ok && res.data) setTests(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTests(); }, [fetchTests]);

  const isSearching = searchQuery.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const q = searchQuery.toLowerCase();
    return tests.filter((t) => t.name.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q));
  }, [tests, searchQuery, isSearching]);

  const letterResults = useMemo(() => {
    if (isSearching) return [];
    return tests.filter((t) => t.name[0]?.toUpperCase() === activeLetter);
  }, [tests, activeLetter, isSearching]);

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/tests-procedures.jpg"
        title="Tests & Procedures"
        links={[{ label: "Tests & Procedures" }]}
      />

      <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">

          {/* Caveat */}
          <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-green-900/10 flex items-center justify-center shrink-0 mt-0.5">
              <Info size={15} className="text-green-900" strokeWidth={1.5} />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              <span className="font-semibold text-gray-700">Disclaimer: </span>
              OAUTHC does not endorse any companies or products. Advertising
              revenue supports our non-profit mission. The information provided
              here is for educational purposes only and does not replace advice
              from a qualified healthcare professional. Always consult your doctor
              before undergoing any diagnostic test or procedure.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-xl">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests or procedures..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent shadow-sm transition"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl px-4 py-3 animate-pulse">
                  <div className="h-4 w-28 bg-gray-200 rounded mb-1.5" />
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* A–Z chips */}
              {!isSearching && (
                <div className="flex flex-wrap gap-2">
                  {ALL_LETTERS.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => setActiveLetter(letter)}
                      className={`w-9 h-9 rounded-lg text-sm font-bold transition ${
                        activeLetter === letter
                          ? "bg-green-900 text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-green-900 hover:text-green-900"
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              )}

              {/* Results */}
              {isSearching ? (
                <div className="flex flex-col gap-4">
                  <p className="text-gray-500 text-sm">
                    {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for{" "}
                    <span className="font-semibold text-gray-700">&ldquo;{searchQuery}&rdquo;</span>
                  </p>
                  {searchResults.length === 0 ? (
                    <p className="text-gray-400 text-sm">No tests or procedures match your search.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {searchResults.map((t) => (
                        <TestChip key={t.slug} name={t.name} slug={t.slug} category={t.category} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-bold font-yeseva text-green-900/20 leading-none">
                      {activeLetter}
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400">
                      {letterResults.length} test{letterResults.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {letterResults.length === 0 ? (
                    <p className="text-gray-400 text-sm">No tests or procedures starting with &ldquo;{activeLetter}&rdquo; yet.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {letterResults.map((t) => (
                        <TestChip key={t.slug} name={t.name} slug={t.slug} category={t.category} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function TestChip({ name, slug, category }: { name: string; slug: string; category?: string }) {
  return (
    <Link
      href={`/tests-procedures/${slug}`}
      className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm hover:border-green-900 hover:shadow-md transition"
    >
      <p className="text-sm text-gray-700 font-medium leading-snug">{name}</p>
      {category && <p className="text-xs text-gray-400 mt-0.5">{category}</p>}
    </Link>
  );
}
