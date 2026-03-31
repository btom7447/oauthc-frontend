type Props = {
  paragraphs: string[];
};

export default function HealthServiceApproach({ paragraphs }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
          More Information
        </p>
        <h2 className="text-red-600 text-2xl md:text-3xl font-semibold font-yeseva mt-1">
          Our Approach
        </h2>
      </div>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-gray-600 text-base leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}
