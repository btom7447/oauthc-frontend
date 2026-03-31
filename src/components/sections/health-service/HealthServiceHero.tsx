"use client";

const FALLBACK = "/logo.png";

type Props = {
  name: string;
  tagline: string;
  image: string;
};

export default function HealthServiceHero({ name, tagline, image }: Props) {
  const src = image.trim() || FALLBACK;
  const isFallback = src === FALLBACK;

  return (
    <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 shadow-sm flex items-center justify-center">
      <img
        src={src}
        alt={name}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
        className={isFallback ? "w-24 h-24 object-contain opacity-40" : "absolute inset-0 w-full h-full object-cover"}
      />
      {!isFallback && (
        <>
          <div className="absolute inset-0 bg-linear-to-t from-green-950/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 px-6 py-5">
            <h1 className="text-white text-2xl md:text-3xl font-bold font-yeseva leading-snug">
              {name}
            </h1>
            <p className="text-green-200 text-sm mt-1">{tagline}</p>
          </div>
        </>
      )}
    </div>
  );
}
