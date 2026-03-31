import { ClipboardList } from "lucide-react";

type Props = { points: string[] };

export default function TestWhyItsDone({ points }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
          Purpose
        </p>
        <h2 className="text-red-600 text-2xl md:text-3xl font-semibold font-yeseva mt-1">
          Why It&apos;s Done
        </h2>
      </div>
      <ul className="flex flex-col gap-3">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-green-900/10 flex items-center justify-center shrink-0 mt-0.5">
              <ClipboardList size={13} className="text-green-900" strokeWidth={1.5} />
            </div>
            <span className="text-gray-600 text-sm leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
