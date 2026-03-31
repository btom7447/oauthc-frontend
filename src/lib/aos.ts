"use client";

import AOS from "aos";
import { useEffect } from "react";

export const useAOS = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);
};
