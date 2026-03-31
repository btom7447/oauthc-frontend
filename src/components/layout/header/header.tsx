"use client";

import FirstHeader from "./first-header";
import MobileHeader from "./mobile-header";
import MobileMenu from "./mobile-menu";
import { useState } from "react";
import Marquee from "../marquee";
import Navbar from "./navbar";

export default function Header() {
  const [open, setOpen] = useState(false);

  // later this will come from CMS/API
  const marqueeItems = [
    {
      id: "1",
      text: "Advertisement for Admission into OAUTHC Schools for the 2025/2026 Academic Session.",
      url: "https://oauthc.gov.ng/schools_advert.php",
      isExternal: true,
    },
  ];

  return (
    <header>
      <FirstHeader />
      <Navbar />

      {/* Mobile */}
      <MobileHeader onOpen={() => setOpen(true)} />
      
      {/* Marquee */}
      <Marquee items={marqueeItems} fallbackText="Welcome to OAUTHC" />

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
