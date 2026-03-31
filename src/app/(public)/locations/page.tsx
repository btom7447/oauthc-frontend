"use client";

import { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import LocationCard, { type Location } from "@/components/cards/LocationCard";
import LocationCardSkeleton from "@/components/skeleton/LocationCardSkeleton";

const LOCATIONS: Location[] = [
  {
    name: "OAUTHC Main Campus",
    image: "",
    address: "Obafemi Awolowo University Teaching Hospitals Complex, Ile-Ife, Osun State, Nigeria",
    mapsQuery: "Obafemi+Awolowo+University+Teaching+Hospitals+Complex+Ile-Ife+Nigeria",
    contacts: [
      { label: "General", number: "+234 036 230 050" },
      { label: "Emergency", number: "+234 036 230 290" },
    ],
  },
  {
    name: "Wesley Guild Hospital",
    image: "",
    address: "Wesley Guild Hospital, Ilesa, Osun State, Nigeria",
    mapsQuery: "Wesley+Guild+Hospital+Ilesa+Osun+State+Nigeria",
    contacts: [
      { label: "Reception", number: "+234 036 460 021" },
    ],
  },
  {
    name: "Ife State Hospital",
    image: "",
    address: "Ife State Hospital, Oke-Ogbo, Ile-Ife, Osun State, Nigeria",
    mapsQuery: "Ife+State+Hospital+Ile-Ife+Osun+Nigeria",
    contacts: [
      { label: "Reception", number: "+234 036 230 100" },
    ],
  },
  {
    name: "Urban Comprehensive Health Centre",
    image: "",
    address: "Urban Comprehensive Health Centre, Ede Road, Ile-Ife, Osun State, Nigeria",
    mapsQuery: "Urban+Comprehensive+Health+Centre+Ile-Ife+Nigeria",
    contacts: [
      { label: "Reception", number: "+234 036 230 200" },
    ],
  },
  {
    name: "Imesi-Ile Community Hospital",
    image: "",
    address: "Imesi-Ile Community Hospital, Imesi-Ile, Osun State, Nigeria",
    mapsQuery: "Imesi-Ile+Community+Hospital+Osun+Nigeria",
    contacts: [
      { label: "Reception", number: "+234 036 580 010" },
    ],
  },
];

async function fetchLocations(): Promise<Location[]> {
  // TODO: replace with CMS fetch
  return LOCATIONS;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLocations().then((data) => {
      setLocations(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/contact.png"
        title="Our Locations"
        links={[{ label: "Locations" }]}
      />

      <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-14">
          {/* Intro paragraph */}
          <div className="max-w-3xl flex flex-col gap-4">
            <p className="text-green-900 uppercase text-xl font-semibold tracking-wide">
              Find Us
            </p>
            <h2 className="text-red-600 text-3xl md:text-4xl font-semibold font-yeseva leading-snug">
              Where to Find Us
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Our hospital is committed to providing quality healthcare to
              patients in various locations. We have multiple units spread
              across the region, each equipped with state-of-the-art facilities
              and staffed by experienced healthcare professionals. Whether
              you're in need of emergency care, routine check-ups, or
              specialized treatment, our hospitals are conveniently located to
              serve you.
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              From urban centers to rural areas, our hospitals are easily
              accessible by car or public transportation. We understand the
              importance of timely medical attention, which is why we've
              strategically positioned our units to minimize travel time and
              maximize care. Browse our list of locations to find the hospital
              nearest you, and rest assured that you'll receive the same high
              standard of care at any of our facilities.
            </p>
          </div>

          {/* Locations list */}
          <div className="flex flex-col divide-y divide-gray-200">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <LocationCardSkeleton key={i} />
                ))
              : locations.map((loc, i) => (
                  <LocationCard key={i} loc={loc} />
                ))}
          </div>
        </div>
      </section>
    </>
  );
}
