"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: "square" | "landscape" | "portrait";
  folder?: string;
};

export default function ImageUpload({ value, onChange, label = "Image", aspectRatio = "landscape", folder = "oauthc" }: Props) {
  const heightCls = aspectRatio === "square" ? "h-32" : aspectRatio === "portrait" ? "h-44" : "h-28";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      {value ? (
        <div className={`relative w-full ${heightCls} rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group`}>
          <Image src={value} alt="Upload preview" fill className="object-cover" sizes="400px" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition hover:bg-red-50"
          >
            <X size={12} strokeWidth={2} className="text-red-500" />
          </button>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "ml_default"}
          options={{ folder, maxFiles: 1, resourceType: "image", clientAllowedFormats: ["jpg", "jpeg", "png", "webp"] }}
          onSuccess={(result) => {
            if (result.event === "success" && typeof result.info === "object" && result.info && "secure_url" in result.info) {
              onChange(result.info.secure_url as string);
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className={`w-full ${heightCls} rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-green-900 hover:bg-green-50 transition flex flex-col items-center justify-center gap-1.5 group`}
            >
              <ImagePlus size={20} strokeWidth={1.5} className="text-gray-300 group-hover:text-green-900 transition" />
              <span className="text-xs text-gray-400 group-hover:text-green-900 transition font-medium">Click to upload</span>
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
