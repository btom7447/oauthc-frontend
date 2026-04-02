"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import type { MarqueeItem, MarqueeSettings } from "@/types/marquee";

const TYPE_COLORS: Record<MarqueeItem["type"], string> = {
  info: "text-blue-700",
  urgent: "text-red-700",
  event: "text-purple-700",
};

const SPEED_DURATION: Record<MarqueeSettings["speed"], number> = {
  slow: 40,
  normal: 25,
  fast: 14,
};

export default function Marquee() {
  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [settings, setSettings] = useState<MarqueeSettings>({ enabled: true, speed: "normal" });
  const [loaded, setLoaded] = useState(false);

  const fetchMarquee = useCallback(async () => {
    const res = await api.get<{ items: MarqueeItem[]; settings: MarqueeSettings }>("/cms/marquee", { auth: false });
    if (res.ok && res.data) {
      setItems(res.data.items || []);
      if (res.data.settings) setSettings(res.data.settings);
    }
    setLoaded(true);
  }, []);

  useEffect(() => { fetchMarquee(); }, [fetchMarquee]);

  if (!loaded || !settings.enabled || items.length === 0) return null;

  const duration = SPEED_DURATION[settings.speed] || 25;

  return (
    <div className="marquee-container bg-gray-100 text-sm overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="bg-red-700 py-2 px-4">
          <span className="font-semibold shrink-0 text-white text-xl">Important</span>
        </div>

        <div className="whitespace-nowrap overflow-hidden">
          <div
            className="inline-block animate-marquee text-black text-lg"
            style={{ animationDuration: `${duration}s` }}
          >
            {items.map((item) => {
              const color = TYPE_COLORS[item.type] || "text-black";
              const content = <span className={`mr-8 ${color}`}>{item.text}</span>;

              if (item.link) {
                return item.isExternal ? (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {content}
                  </a>
                ) : (
                  <Link key={item.id} href={item.link}>
                    {content}
                  </Link>
                );
              }

              return <span key={item.id}>{content}</span>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
