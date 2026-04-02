"use client";

import FirstHeader from "./first-header";
import MobileHeader from "./mobile-header";
import MobileMenu from "./mobile-menu";
import { useState } from "react";
import Marquee from "../marquee";
import Navbar from "./navbar";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <FirstHeader />
      <Navbar />

      {/* Mobile */}
      <MobileHeader onOpen={() => setOpen(true)} />

      {/* Marquee */}
      <Marquee />

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
