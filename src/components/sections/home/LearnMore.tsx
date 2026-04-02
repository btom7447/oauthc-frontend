"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Users,
  Building2,
  Hospital,
  Circle,
  GalleryVerticalEnd,
  ChevronRight,
} from "lucide-react";

type TabKey = "history" | "management" | "departments" | "units";

type TabContent = {
  key: TabKey;
  label: string;
  icon: React.ElementType;
  paragraphs: string[];
  bullets?: string[];
  images: string[];
};

// Note: Each tab can have it's seperate 2 images but the images shouldn't be more than 3 at most
const tabs: TabContent[] = [
  {
    key: "history",
    label: "Brief History of OAUTHC",
    icon: GalleryVerticalEnd,
    paragraphs: [
      "The Obafemi Awolowo University Teaching Hospitals Complex is a product of a concise and comprehensive decision of the Western state under the leadership of Brigadier Adeyinka Adebayo. The committee's inauguration was on January 15, 1971, and it was comprised of the working party and Professor Hezekiah A. Oluwasanmi; the then vice-chancellor of the University of Ife came up with a working plan of having a Teaching Hospital that would comprise a primary hospital, the nucleus of the teaching hospitals to be called Central hospital, together with a conglomeration of other state hospitals.",
      "The recommendations made by the planning committee birthed and propelled a futuristic plan for a full-fledged hospital, where clinical training, research and proper healthcare delivery model would be developed on a principle different from the other schools then in existence beyond the traditional tripod of teaching, research and services.",
      "This project aimed to emphasise services more than usual among Nigerian faculties of medicine. The vision of providing total health care delivery, teaching and research for the designated population propelled the emphasis on hospital development.",
      "Thus, the Obafemi Awolowo University Teaching Hospitals Complex in 1975, was premised on a robust and elaborate vision of enlarging and harnessing all the needed resources, which aimed to focus on the totality of healthcare delivery using not only tertiary but also secondary and primary health care facilities. Various health professionals are to be trained; doctors, nurses, medical scientists, paramedical staff, auxiliary dental staff and dental hygienists were designated to achieve the long-term goal of having a well-coordinated hospital.",
    ],
    images: [
      "/images/learnmore-section/poster-one.jpg",
      "/images/learnmore-section/poster-two.jpg",
    ],
  },
  {
    key: "management",
    label: "Management",
    icon: Users,
    paragraphs: [
      "Our Management team is a triad of vastly experienced leaders in the medical fields and administration with an excellent history of managing and leading groups, units, and organizations to success.",
    ],
    bullets: [
      "CMD: Prof. John A. O. Okeniyi - Chief Medical Director",
      "Prof. Josephine E. A. Eziyi - Chairman, Medical Advisory Committee",
      "Dr. Ayodeji Bobade - Director of Administration",
    ],
    images: [
      "/images/learnmore-section/poster-one.jpg",
      "/images/learnmore-section/poster-two.jpg",
    ],
  },
  {
    key: "departments",
    label: "Departments",
    icon: Building2,
    paragraphs: [
      "At Obafemi Awolowo University Teaching Hospitals Complex (OAUTHC), we offer a wide range of specialized services across various departments, each dedicated to providing comprehensive and advanced medical care.",
    ],
    bullets: [
      "Department of Surgery",
      "Department of Radiology",
      "Department of Internal Medicine",
      "Department of Obstetrics & Gynecology",
      "Department of Pediatrics",
      "Department of Pathology",
    ],
    images: [
      "/images/learnmore-section/poster-one.jpg",
      "/images/learnmore-section/poster-two.jpg",
    ],
  },
  {
    key: "units",
    label: "Hospital Units",
    icon: Hospital,
    paragraphs: [
      "Obafemi Awolowo University Teaching Hospitals Complex (OAUTHC) delivers comprehensive and excellent healthcare through five specialized units, each designed to meet diverse medical needs with professionalism and expertise.",
    ],
    bullets: [
      "Ife hospital unit, Ile-Ife",
      "Urban comprehensive health center, Eleyele, Ile-Ife",
      "Ijeshaland Geriatric center, Ilesa",
      "Wesley Guild hospital Ilesa",
      "Rural comprehensive health centre, Imesi-Ile",
      "Outpatient Unit",
    ],
    images: [
      "/images/learnmore-section/poster-one.jpg",
      "/images/learnmore-section/poster-two.jpg",
    ],
  },
];

export default function LearnMoreSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("history");

  const current = tabs.find((t) => t.key === activeTab)!;

  return (
    <section className="w-full bg-gray-50 py-14 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* HEADER */}
        <div>
          <p className="text-green-700 font-semibold uppercase text-xl">
            Learn More About Us
          </p>
          <h2 className="text-red-600 text-3xl md:text-5xl font-semibold font-yeseva mt-2">
            Discover OAUTHC
          </h2>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap items-center gap-3 border-b pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-md md:text-base transition ${
                  isActive
                    ? "bg-green-900 hover:bg-green-700"
                    : "border border-gray-400 text-black hover:bg-gray-200"
                }`}
              >
                <Icon size={16} strokeWidth={1} />
                {tab.label}
              </button>
            );
          })}

          {/* Learn More (no icon) */}
          <Link
            href="/about"
            className="flex items-center px-4 py-2 text-sm md:text-base bg-green-900 text-white rounded-md hover:bg-green-800 transition"
          >
            Learn More 
            <ChevronRight size={15} strokeWidth={1} />
          </Link>
        </div>

        {/* CONTENT (ANIMATED) */}
        <div className="w-full flex flex-col xl:flex-row justify-start gap-5 items-start">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col gap-6"
            >
              {/* Paragraphs */}
              {current.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-gray-700 leading-relaxed font-work-sans"
                >
                  {p}
                </p>
              ))}

              {/* Bullets */}
              {current.bullets && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {current.bullets.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Circle
                        size={10}
                        className="text-red-600 mt-2 shrink-0"
                      />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* IMAGES (ANIMATED) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + "-images"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full xl:w-1/3 flex lg:flex-col gap-5"
            >
              {current.images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-40 md:w-80 h-30 md:h-60 rounded-lg overflow-hidden shadow-md"
                >
                  <Image
                    src={img}
                    alt={`about-${current.key}-${i}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}