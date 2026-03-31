import { Stethoscope } from "lucide-react";

type Procedure = {
  name: string;
  description: string;
};

type Props = {
  procedures: Procedure[];
};

export default function ProceduresAndServices({ procedures }: Props) {
  return (
    <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <div>
          <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
            What We Do
          </p>
          <h2 className="text-red-600 text-3xl md:text-4xl font-semibold font-yeseva mt-2">
            Procedures & Services
          </h2>
        </div>

        {/* Procedures grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {procedures.map(({ name, description }) => (
            <div
              key={name}
              className="flex flex-col gap-3 bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <Stethoscope size={18} className="text-red-600" strokeWidth={1.5} />
              </div>
              <h4 className="text-gray-900 font-bold text-base">{name}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
