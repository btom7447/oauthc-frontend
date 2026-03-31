import "./globals.css";
import { Work_Sans, Yeseva_One } from "next/font/google";
import type { Metadata } from "next";

const work = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work",
  display: "swap",
});

const yeseva = Yeseva_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yeseva",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OAUTHC | Obafemi Awolowo University Teaching Hospitals Complex",
    template: "%s | OAUTHC",
  },
  description:
    "The Obafemi Awolowo University Teaching Hospitals Complex (OAUTHC) is one of Nigeria's foremost tertiary healthcare institutions, providing world-class specialist medical care, training future health professionals, and advancing clinical research across Osun State and beyond.",
  keywords: [
    "OAUTHC",
    "Obafemi Awolowo University Teaching Hospital",
    "hospital Nigeria",
    "specialist hospital Ile-Ife",
    "healthcare Osun State",
    "Wesley Guild Hospital",
    "medical training Nigeria",
  ],
  authors: [{ name: "OAUTHC" }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "OAUTHC",
    title: "OAUTHC | Obafemi Awolowo University Teaching Hospitals Complex",
    description:
      "World-class specialist healthcare, health sciences education, and clinical research — serving Nigeria and West Africa from Ile-Ife, Osun State.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${work.variable} ${yeseva.variable}`}>
      <body>{children}</body>
    </html>
  );
}
