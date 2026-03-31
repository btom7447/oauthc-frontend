"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Placed once in the layout (or page). After every client-side navigation
 * it reads window.location.hash and smoothly scrolls to the matching element.
 * Handles the case where Next.js App Router does not auto-scroll to hash
 * anchors on cross-page navigation.
 */
export default function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash.slice(1); // strip leading #
    if (!hash) return;

    // Give React time to finish rendering the target page
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]); // re-run whenever the route changes

  return null;
}
