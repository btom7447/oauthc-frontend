import { GraduationCap } from "lucide-react";

type Programme = {
  title: string;
  duration: string;
  description: string;
};

type Props = {
  programmes: Programme[];
};

export default function SchoolProgrammes({ programmes }: Props) {
  return (
    <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div>
          <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
            Courses Offered
          </p>
          <h2 className="text-red-600 text-3xl md:text-4xl font-semibold font-yeseva mt-2">
            Programmes
          </h2>
        </div>

        {/* Programme cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programmes.map((prog) => (
            <div
              key={prog.title}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-900/10 flex items-center justify-center shrink-0">
                <GraduationCap size={18} className="text-green-900" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-base leading-snug">
                  {prog.title}
                </h3>
                <span className="text-green-700 text-xs font-medium">{prog.duration}</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{prog.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
