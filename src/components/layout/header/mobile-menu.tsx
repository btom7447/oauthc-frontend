"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { navigation } from "@/config/navigation";
import { useState } from "react";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 left-0 w-3/4 max-w-sm h-full bg-white z-50 p-6 overflow-y-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
          >
            <div className="flex justify-end mb-6 text-black">
              <button onClick={onClose}>
                <X />
              </button>
            </div>

            <nav className="flex flex-col gap-3 text-black text-lg">
              {navigation.main.map((item) => {
                // External link
                if (item.external && item.url) {
                  return (
                    <a
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={onClose}
                      className="py-2"
                    >
                      {item.label}
                    </a>
                  );
                }

                // Dropdown group
                if (item.children) {
                  const isOpen = openGroup === item.label;

                  return (
                    <div key={item.label}>
                      {/* Header */}
                      <button
                        onClick={() => setOpenGroup(isOpen ? null : item.label)}
                        className="w-full text-left py-2 flex justify-between items-center"
                      >
                        {item.label}
                        <span className="text-lg">{isOpen ? <ChevronUp size={15} strokeWidth={1} /> : <ChevronDown size={15} strokeWidth={1} />}</span>
                      </button>

                      {/* Animated Content */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden pl-4 flex flex-col gap-2"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                href={child.url!}
                                onClick={onClose}
                                className="text-lg text-gray-700 hover:text-red-500"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                // Normal link
                return (
                  <Link
                    key={item.label}
                    href={item.url!}
                    onClick={onClose}
                    className="py-2"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}