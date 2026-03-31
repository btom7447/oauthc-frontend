"use client";

import React from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpAZ,
  ArrowDownZA,
} from "lucide-react";

type FilteredGridProps<T> = {
  description: string;
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onSearch: (q: string) => void;
  onSortChange: (sort: "asc" | "desc") => void;
  sort: "asc" | "desc";
  searchQuery: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  isLoading?: boolean;
  skeletonCount?: number;
  renderSkeleton: () => React.ReactNode;
  additionalFilters?: React.ReactNode;
};

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  if (currentPage <= 3) {
    pages.push(1, 2, 3, 4, "...", totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
  }

  return pages;
}

export default function FilteredGrid<T>({
  description,
  items,
  totalItems,
  currentPage,
  totalPages,
  perPage,
  onPageChange,
  onSearch,
  onSortChange,
  sort,
  searchQuery,
  renderItem,
  isLoading = false,
  skeletonCount = 8,
  renderSkeleton,
  additionalFilters,
}: FilteredGridProps<T>) {
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const rangeEnd = Math.min(currentPage * perPage, totalItems);

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Description */}
        <p className="text-gray-600 text-base max-w-2xl">{description}</p>

        {/* Additional filters (e.g. dropdowns) */}
        {additionalFilters && (
          <div className="flex flex-wrap gap-3">{additionalFilters}</div>
        )}

        {/* Controls row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Search input */}
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition"
            />
          </div>

          {/* Sort + count */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => onSortChange("asc")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition ${
                  sort === "asc"
                    ? "bg-green-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <ArrowUpAZ size={15} />
                A→Z
              </button>
              <button
                onClick={() => onSortChange("desc")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition ${
                  sort === "desc"
                    ? "bg-green-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <ArrowDownZA size={15} />
                Z→A
              </button>
            </div>

            <span className="text-sm text-gray-500 whitespace-nowrap">
              Showing {rangeStart}–{rangeEnd} of {totalItems}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
              ))
            : items.map((item, index) => renderItem(item, index))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* Prev */}
            {currentPage !== 1 && (
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 text-gray-600 hover:border-green-900 hover:text-green-900 disabled:cursor-not-allowed disabled:opacity-50 transition"
              >
                <ChevronLeft size={16} />
              </button>
            )}

            {/* Page numbers */}
            {pageNumbers.map((page, i) =>
              page === "..." ? (
                <span key={`ellipsis-${i}`} className="px-1 text-gray-400 select-none">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-green-900 text-white border-green-900"
                      : "border-gray-300 text-gray-600 hover:border-green-900 hover:text-green-900"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Next */}
            {currentPage !== totalPages && (
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 text-gray-600 hover:border-green-900 hover:text-green-900 disabled:cursor-not-allowed disabled:opacity-50 transition"
              >
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
