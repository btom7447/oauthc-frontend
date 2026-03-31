import { CheckCircle2 } from "lucide-react";

type Props = {
  expertise: string[];
};

export default function DoctorExpertise({ expertise }: Props) {
  return (
    <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div>
          <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
            Areas of Expertise
          </p>
          <h2 className="text-red-600 text-3xl md:text-4xl font-semibold font-yeseva mt-2">
            Clinical Expertise &amp; Specialisations
          </h2>
        </div>

        {/* Expertise grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {expertise.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm"
            >
              <div className="w-7 h-7 rounded-full bg-green-900/10 flex items-center justify-center shrink-0">
                <CheckCircle2 size={14} className="text-green-900" strokeWidth={1.5} />
              </div>
              <span className="text-gray-700 text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
