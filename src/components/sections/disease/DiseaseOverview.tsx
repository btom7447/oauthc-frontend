type Props = {
  name: string;
  category: string;
  paragraphs: string[];
};

export default function DiseaseOverview({ name, category, paragraphs }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="inline-block bg-green-900/10 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          {category}
        </span>
        <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
          Overview
        </p>
        <h1 className="text-red-600 text-3xl md:text-4xl font-semibold font-yeseva mt-1 leading-snug">
          {name}
        </h1>
      </div>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-gray-600 text-base leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}
