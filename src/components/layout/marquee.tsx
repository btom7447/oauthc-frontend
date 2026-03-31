"use client";

import Link from "next/link";
import { MarqueeProps } from "@/types/marquee";

export default function Marquee({ items = [], fallbackText }: MarqueeProps) {
  const hasItems = items && items.length > 0;

  return (
    <div className="marquee-container bg-gray-100 text-sm overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="bg-red-700 py-2 px-4">
          <span className="font-semibold shrink-0 text-white text-xl">Important</span>
        </div>

        <div className="whitespace-nowrap overflow-hidden">
          <div className="inline-block animate-marquee text-black text-lg">
            {hasItems ? (
              items.map((item) => {
                const content = <span className="mr-8">{item.text}</span>;

                if (item.url) {
                  return item.isExternal ? (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {content}
                    </a>
                  ) : (
                    <Link key={item.id} href={item.url}>
                      {content}
                    </Link>
                  );
                }

                return (
                  <span key={item.id} className="mr-8">
                    {item.text}
                  </span>
                );
              })
            ) : (
              <span>{fallbackText}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
