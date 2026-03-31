import { ShieldCheck } from "lucide-react";

type Props = {
  points: string[];
};

export default function DiseasePrevention({ points }: Props) {
  return (
    <div className="bg-green-900 rounded-xl p-6 flex flex-col gap-5">
      <div>
        <p className="text-green-300 uppercase text-sm font-semibold tracking-wide">
          Stay Safe
        </p>
        <h2 className="text-white text-2xl md:text-3xl font-semibold font-yeseva mt-1">
          Prevention
        </h2>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck size={13} className="text-green-300" strokeWidth={1.5} />
            </div>
            <span className="text-white text-sm leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
