type Step = {
  title: string;
  detail: string;
};

type Props = {
  steps: Step[];
};

export default function HealthServiceWhatToExpect({ steps }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
          Patient Journey
        </p>
        <h2 className="text-red-600 text-2xl md:text-3xl font-semibold font-yeseva mt-1">
          What to Expect
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {steps.map(({ title, detail }, i) => (
          <div
            key={title}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4"
          >
            <div className="w-9 h-9 rounded-full bg-green-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
              {i + 1}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-900 font-semibold text-sm">{title}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
