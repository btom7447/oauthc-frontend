"use client";

const FALLBACK = "/logo.png";

type Props = {
  images: string[];
  name: string;
};

export default function DiseaseGallery({ images, name }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-green-700 uppercase text-sm font-semibold tracking-wide">
        Visual Reference
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 flex items-center justify-center"
          >
            <img
              src={src}
              alt={`${name} image ${i + 1}`}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
