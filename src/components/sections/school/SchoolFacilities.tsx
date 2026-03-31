import { CheckCircle2 } from "lucide-react";

type Facility = {
  title: string;
  detail: string;
};

type Props = {
  description: string;
  facilities: Facility[];
};

export default function SchoolFacilities({ description, facilities }: Props) {
  return (
    <section className="w-full bg-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="md:flex md:items-end md:justify-between gap-10">
          <div>
            <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
              Infrastructure
            </p>
            <h2 className="text-red-600 text-3xl md:text-4xl font-semibold font-yeseva mt-2">
              Facilities & Resources
            </h2>
          </div>
          <p className="text-gray-500 text-base leading-relaxed max-w-xl mt-4 md:mt-0">
            {description}
          </p>
        </div>

        {/* Facilities grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {facilities.map(({ title, detail }) => (
            <div
              key={title}
              className="flex gap-4 items-start border-l-4 border-green-900 pl-5 py-1"
            >
              <CheckCircle2
                size={20}
                className="text-green-700 shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <div className="flex flex-col gap-0.5">
                <h4 className="text-gray-900 font-semibold text-base">{title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
