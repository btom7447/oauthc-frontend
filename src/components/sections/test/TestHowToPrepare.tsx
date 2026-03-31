type Props = { steps: string[] };

export default function TestHowToPrepare({ steps }: Props) {
  return (
    <div className="bg-green-900 rounded-xl p-6 flex flex-col gap-5">
      <div>
        <p className="text-green-300 uppercase text-sm font-semibold tracking-wide">
          Before Your Test
        </p>
        <h2 className="text-white text-2xl md:text-3xl font-semibold font-yeseva mt-1">
          How to Prepare
        </h2>
      </div>
      <ol className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-white/15 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              {i + 1}
            </div>
            <span className="text-white text-sm leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
