"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header/header";
import ScrollToHash from "@/components/shared/ScrollToHash";
import { Toaster } from "react-hot-toast";
import { useAOS } from "@/lib/aos";
import { useEffect } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAOS();

  return (
    <>
      <Toaster position="top-right" />
      <ScrollToHash />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
