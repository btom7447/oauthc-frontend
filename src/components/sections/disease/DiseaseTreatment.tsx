import { CheckCircle2 } from "lucide-react";

type Props = {
  points: string[];
};

export default function DiseaseTreatment({ points }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
          Management
        </p>
        <h2 className="text-red-600 text-2xl md:text-3xl font-semibold font-yeseva mt-1">
          Treatment Options
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {points.map((point, i) => (
          <div
            key={i}
            className="flex items-start gap-3 border-l-4 border-green-900 pl-4 py-1"
          >
            <CheckCircle2 size={16} className="text-green-700 shrink-0 mt-0.5" strokeWidth={1.5} />
            <span className="text-gray-600 text-sm leading-relaxed">{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
