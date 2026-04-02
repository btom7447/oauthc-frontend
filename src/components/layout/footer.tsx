"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import AppointmentPoster from "../shared/AppointmentPoster";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

interface SocialLink {
  label: string;
  href: string;
  Icon: React.ElementType;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const contactNumbers = [
  { label: "Corporate Services", number: "+234 815 209 2767" },
  { label: "SERVICOM", number: "+234 815 209 2768" },
  { label: "Security", number: "+234 805 500 2174" },
];

const importantLinks: NavLink[] = [
  { label: "Find Doctor", href: "/doctors" },
  { label: "Services", href: "/health-services" },
  { label: "About Us", href: "/about" },
  {
    label: "Staff Mail",
    href: "https://oauthc.gov.ng/webmail/",
    external: true,
  },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Staff Portal", href: "/admin"}
];

const socialLinks: SocialLink[] = [
  // NOTE: Update Facebook href once you have the correct URL
  {
    label: "Facebook",
    href: "https://www.facebook.com/oauthcofficial",
    Icon: FaFacebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/oauthcofficial",
    Icon: FaInstagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@oauthcofficial",
    Icon: FaYoutube,
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/oauthcofficial",
    Icon: FaXTwitter,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Footer: React.FC = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState<string>("");

  const isActive = (href: string): boolean => pathname === href;

  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (): Promise<void> => {
    if (!email.trim()) return;
    setSubscribing(true);
    const res = await api.post("/newsletter/subscribe", { email }, { auth: false });
    setSubscribing(false);
    if (res.ok) {
      toast.success("Subscribed successfully!");
      setEmail("");
    } else {
      toast.error(res.error || "Failed to subscribe.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSubscribe();
  };

  return (
    <div>
      <AppointmentPoster />

      <footer className="bg-green-900 text-white">
        {/* ── Top Grid ── */}
        <div className="px-10 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <img
              src="/logo.png"
              alt="OAUTHC Logo"
              className="w-30 h-auto object-contain"
            />
            <h5 className="text-lg font-semibold leading-snug text-white">
              Obafemi Awolowo University <br />
              Teaching Hospitals Complex
            </h5>
            <p className="text-base text-white italic">All for Health</p>
          </div>

          {/* Important Links */}
          <div className="flex flex-col gap-4">
            <h6 className="text-xl font-bold uppercase tracking-widest text-white">
              Important Links
            </h6>
            <ul className="flex flex-col gap-2">
              {importantLinks.map(({ label, href, external }) => {
                const baseClass =
                  "text-lg transition-colors duration-200 w-fit";
                const stateClass = isActive(href)
                  ? "text-red-400 font-semibold"
                  : "text-white hover:text-red-400";

                return (
                  <li key={href}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className={`${baseClass} ${stateClass}`}
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className={`${baseClass} ${stateClass}`}
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h6 className="text-xl font-bold uppercase tracking-widest text-white">
              Contact Us
            </h6>
            <div className="flex flex-col gap-3 text-lg text-white leading-relaxed">
              <div className="flex flex-col gap-1">
                {contactNumbers.map(({ label, number }) => (
                  <a
                    key={label}
                    href={`tel:${number.replace(/\s+/g, "")}`}
                    className="hover:text-red-400 transition-colors"
                  >
                    {label}: {number}
                  </a>
                ))}
              </div>
              <p>
                Obafemi Awolowo University <br />
                Teaching Hospitals Complex, <br />
                Ilesa Road, Ife, Osun State, Nigeria
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h6 className="text-xl font-bold uppercase tracking-widest text-white">
              Newsletter
            </h6>
            <p className="text-lg text-white leading-snug">
              Get the latest health news and updates
            </p>
            <div className="flex items-center bg-white rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-red-400 transition">
              <input
                type="email"
                id="newsletterMail"
                name="newsletter-mail"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Enter your email address"
                className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none"
                aria-label="Newsletter email address"
              />
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={subscribing}
                aria-label="Subscribe to newsletter"
                className="px-3 py-2 text-green-700 hover:text-green-900 transition-colors duration-200 cursor-pointer disabled:opacity-50"
              >
                <IoSend size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-green-700 mx-6" />

        {/* ── Bottom Bar ── */}
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white text-center sm:text-left">
            © {new Date().getFullYear()} Obafemi Awolowo University Teaching Hospitals Complex. All
            Rights Reserved by OAUTHC
          </p>

          <a
            href="https://kmini-tech.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-white hover:text-red-400 transition-colors duration-200 whitespace-nowrap"
          >
            by Kmini Technologies
          </a>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-white hover:text-red-400 transition-colors duration-200 text-xl"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
