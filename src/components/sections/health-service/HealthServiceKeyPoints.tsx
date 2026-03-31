import { CheckCircle2 } from "lucide-react";

type Props = {
  points: string[];
};

export default function HealthServiceKeyPoints({ points }: Props) {
  return (
    <div className="bg-green-900 rounded-xl p-6 flex flex-col gap-5">
      <div>
        <p className="text-green-300 uppercase text-sm font-semibold tracking-wide">
          Highlights
        </p>
        <h2 className="text-white text-2xl font-semibold font-yeseva mt-1">
          What We Offer
        </h2>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-3">
            <CheckCircle2
              size={17}
              className="text-green-300 shrink-0 mt-0.5"
              strokeWidth={1.5}
            />
            <span className="text-white text-sm leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
