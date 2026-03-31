"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarDropdown from "./navbar-dropdown";
import { navigation } from "@/config/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkBase =
    "px-3 py-2 rounded-md text-lg font-medium transition-all duration-200";

  const isActive = (href: string) =>
    pathname === href ? "text-red-500" : "text-white hover:text-red-400";

  const isGroupActive = (routes: string[]) =>
    routes.some((route) => pathname === route || pathname.startsWith(route + "/"));

  // Helper to extract routes from config groups
  const getGroupRoutes = (label: string) => {
    const group = navigation.main.find((item) => item.label === label);
    return group?.children?.map((child) => child.url!) ?? [];
  };

  return (
    <nav className="hidden xl:block bg-green-900 shadow-md">
      <ul className="flex gap-2 px-6 py-3 items-center">
        {navigation.main.map((item) => {
          // HOME (no dropdown)
          if (item.label === "Home") {
            return (
              <li key={item.label}>
                <Link
                  href={item.url!}
                  className={`${linkBase} ${isActive("/")}`}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          // EXTERNAL LINK (Blog)
          if (item.external && item.url) {
            return (
              <li key={item.label}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${linkBase} text-white hover:text-red-400`}
                >
                  {item.label}
                </a>
              </li>
            );
          }

          // DROPDOWN GROUPS
          if (item.children) {
            const routes = item.children.map((child) => child.url!);

            return (
              <li key={item.label}>
                <NavbarDropdown
                  title={item.label}
                  active={isGroupActive(routes)}
                  items={item.children}
                />
              </li>
            );
          }

          // NORMAL LINK (Contact etc.)
          return (
            <li key={item.label}>
              <Link
                href={item.url!}
                className={`${linkBase} ${isActive(item.url!)}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}