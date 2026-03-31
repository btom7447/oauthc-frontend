import { Activity } from "lucide-react";

type Props = {
  symptoms: string[];
};

export default function DiseaseSymptoms({ symptoms }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
          Signs & Symptoms
        </p>
        <h2 className="text-red-600 text-2xl md:text-3xl font-semibold font-yeseva mt-1">
          Common Symptoms
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {symptoms.map((symptom) => (
          <div
            key={symptom}
            className="flex items-start gap-3 bg-white rounded-lg border border-gray-100 shadow-sm px-4 py-3"
          >
            <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
              <Activity size={13} className="text-red-500" strokeWidth={1.5} />
            </div>
            <span className="text-gray-700 text-sm leading-relaxed">{symptom}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
