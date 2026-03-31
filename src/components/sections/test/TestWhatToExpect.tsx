import { CheckCircle2 } from "lucide-react";

type Props = { points: string[] };

export default function TestWhatToExpect({ points }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
          During the Procedure
        </p>
        <h2 className="text-red-600 text-2xl md:text-3xl font-semibold font-yeseva mt-1">
          What to Expect
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {points.map((point, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3"
          >
            <CheckCircle2 size={16} className="text-green-700 shrink-0 mt-0.5" strokeWidth={1.5} />
            <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
