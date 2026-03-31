"use client";

import { useState } from "react";

const FALLBACK = "/logo.png";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";

export type AnnouncementItem = {
  id: string | number;
  name: string;
  content?: string;
  image: string;
  link?: string;
  featured?: boolean;
};

type Props = {
  title?: string;
  items?: AnnouncementItem[];
};

function AnnouncementModal({
  item,
  onClose,
}: {
  item: AnnouncementItem;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white transition"
          >
            <X size={16} />
          </button>

          {/* Image */}
          <div className="relative w-full aspect-video bg-gray-100">
            <img
              src={item.image}
              alt={item.name}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-widest bg-red-600 text-white px-2 py-1 rounded">
              Announcement
            </span>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col gap-4">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
              {item.name}
            </h3>

            {item.content && (
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {item.content}
              </p>
            )}

            {item.link && (
              <Link
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="mt-2 w-fit inline-flex items-center gap-2 px-5 py-2.5 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold rounded-lg transition"
              >
                Read More
                <ArrowUpRight size={15} />
              </Link>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AnnouncementSection({
  title = "Announcements",
  items = [],
}: Props) {
  const [active, setActive] = useState<AnnouncementItem | null>(null);

  if (!items?.length) return null;

  const featured = items.find((i) => i.featured) ?? items[0];
  const rest = items.filter((i) => i.id !== featured.id).slice(0, 4);

  return (
    <>
      <section className="w-full bg-white py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          {/* Header */}
          <div className="text-center">
            <p className="text-green-700 uppercase text-xl font-semibold tracking-wide">
              Stay Updated
            </p>
            <h2 className="text-red-600 text-3xl md:text-5xl font-semibold font-yeseva mt-2">
              {title}
            </h2>
          </div>

          {/* Newspaper Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Featured — large left */}
            <div
              onClick={() => setActive(featured)}
              className="lg:col-span-2 relative rounded-2xl overflow-hidden cursor-pointer group"
            >
              <img
                src={featured.image}
                alt={featured.name}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
                className="w-full h-80 md:h-[28rem] object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white">
                <span className="text-xs uppercase bg-red-600 px-2 py-1 rounded font-semibold tracking-wide">
                  Featured
                </span>
                <h3 className="text-xl md:text-3xl font-bold mt-3 leading-tight line-clamp-2">
                  {featured.name}
                </h3>
                {featured.content && (
                  <p className="mt-2 text-sm text-gray-300 line-clamp-2">
                    {featured.content}
                  </p>
                )}
              </div>
            </div>

            {/* Side list */}
            <div className="flex flex-col gap-4">
              {rest.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActive(item)}
                  className="flex gap-4 items-center cursor-pointer group p-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-red-600 transition line-clamp-3">
                    {item.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {active && (
        <AnnouncementModal item={active} onClose={() => setActive(null)} />
      )}
    </>
  );
}
