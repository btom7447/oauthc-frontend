import { Stethoscope } from "lucide-react";

type Props = {
  points: string[];
};

export default function DiseaseWhenToSeeDoctor({ points }: Props) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex flex-col gap-5">
      <div>
        <p className="text-red-500 uppercase text-sm font-semibold tracking-wide">
          Seek Medical Attention
        </p>
        <h2 className="text-gray-900 text-2xl md:text-3xl font-semibold font-yeseva mt-1">
          When to See a Doctor
        </h2>
      </div>
      <ul className="flex flex-col gap-3">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5">
              <Stethoscope size={13} className="text-white" strokeWidth={1.5} />
            </div>
            <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
