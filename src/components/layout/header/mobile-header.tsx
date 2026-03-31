"use client";

import Image from "next/image";
import { Menu } from "lucide-react";

export default function MobileHeader({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="xl:hidden bg-white flex justify-between items-center px-4 py-3 border-b">
      <Image
        src="/logo.png"
        alt="OAUTHC Logo"
        width={60}
        height={60}
      />

      <h4 className="text-lg text-green-900 font-semibold leading-tight text-center">
        Obafemi Awolowo University <br />
        Teaching Hospitals Complex
      </h4>

      <button onClick={onOpen}>
        <Menu size={28} className="text-black" />
      </button>
    </div>
  );
}
