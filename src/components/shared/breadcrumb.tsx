import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type BreadcrumbLink = {
  label: string;
  href?: string; // omit for the current (last) crumb
};

type Props = {
  bgImage: string;           // path to background image, e.g. "/images/about-hero.jpg"
  links: BreadcrumbLink[];   // first item is usually Home, last is current page
  title?: string;            // optional large page title displayed in the hero
};

export default function PageBreadcrumb({ bgImage, links, title }: Props) {
  return (
    <div
      className="relative w-full h-56 md:h-80 flex items-end bg-cover bg-center"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      {/* Dark overlay via pseudo-element equivalent */}
      <div className="absolute inset-0 bg-green-950/40" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-10 flex flex-col gap-3">
        {/* Page title */}
        {title && (
          <h1 className="text-white text-3xl md:text-5xl font-semibold font-yeseva leading-tight">
            {title}
          </h1>
        )}

        {/* Breadcrumb trail */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center flex-wrap gap-1 text-md lg:text-xl text-gray-300">
            {/* Always prepend Home */}
            <li>
              <Link href="/" className="flex items-center gap-1 hover:text-white transition">
                <Home size={15} strokeWidth={1} />
                Home
              </Link>
            </li>

            {links.map((crumb, i) => {
              const isLast = i === links.length - 1;
              return (
                <li key={i} className="flex items-center gap-1">
                  <ChevronRight size={15} strokeWidth={1.5} className="text-white" />
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className="hover:text-white transition">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-red-600 font-medium">{crumb.label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
