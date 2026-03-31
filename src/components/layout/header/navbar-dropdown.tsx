"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

interface DropdownItem {
  label: string;
  url: string;
}

interface Props {
  title: string;
  items: DropdownItem[];
  active?: boolean;
}

export default function NavbarDropdown({ title, items, active }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActiveItem = (url: string) => pathname === url;

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`px-3 py-2 text-lg font-medium flex items-center gap-1 transition ${
          active ? "text-red-500" : "text-white hover:text-red-400"
        }`}
      >
        {title}
        {/* <ChevronDown size={16} /> */}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-3 w-60 bg-white rounded-lg shadow-lg overflow-hidden z-50"
          >
            {items.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-lg transition ${
                  isActiveItem(item.url)
                    ? "bg-green-900 text-white"
                    : "text-gray-700 hover:bg-green-900/60 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
