import { AlertTriangle } from "lucide-react";

type Props = { points: string[] };

export default function TestLimitations({ points }: Props) {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 flex flex-col gap-5">
      <div>
        <p className="text-amber-600 uppercase text-sm font-semibold tracking-wide">
          Important Notes
        </p>
        <h2 className="text-gray-900 text-2xl md:text-3xl font-semibold font-yeseva mt-1">
          Limitations
        </h2>
      </div>
      <ul className="flex flex-col gap-3">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={13} className="text-amber-600" strokeWidth={1.5} />
            </div>
            <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
