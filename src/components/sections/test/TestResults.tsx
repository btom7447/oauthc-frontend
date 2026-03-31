import { FileText } from "lucide-react";

type Props = { points: string[] };

export default function TestResults({ points }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
          Interpreting Your Test
        </p>
        <h2 className="text-red-600 text-2xl md:text-3xl font-semibold font-yeseva mt-1">
          Results
        </h2>
      </div>
      <ul className="flex flex-col gap-3">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-3 border-l-4 border-green-900 pl-4 py-1">
            <FileText size={15} className="text-green-700 shrink-0 mt-0.5" strokeWidth={1.5} />
            <span className="text-gray-600 text-sm leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
