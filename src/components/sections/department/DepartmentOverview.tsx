"use client";

const FALLBACK = "/logo.png";

type Props = {
  paragraphs: string[];
  image: string;
  name: string;
};

export default function DepartmentOverview({ paragraphs, image, name }: Props) {
  const src = image.trim() || FALLBACK;
  return (
    <section className="w-full bg-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Image floats right on md+, stacks above on mobile */}
        <div className="block md:float-right md:ml-10 md:mb-6 md:w-2/5 mb-8 w-full">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md">
            <img
              src={src}
              alt={`${name} Department`}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
              className={src === FALLBACK ? "w-24 h-24 object-contain opacity-40 m-auto" : "absolute inset-0 w-full h-full object-cover"}
            />
            {/* Name badge */}
            <div className="absolute bottom-0 left-0 right-0 bg-green-900/90 px-5 py-3">
              <p className="text-white font-semibold text-sm">{name} Department</p>
            </div>
          </div>
        </div>

        {/* Paragraphs */}
        <div className="flex flex-col gap-5 text-gray-600 text-base leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Clearfix */}
        <div className="clear-both" />
      </div>
    </section>
  );
}
