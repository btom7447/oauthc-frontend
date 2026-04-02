"use client";

import { useState, useRef, useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { ImagePlus, X, ZoomIn, Loader2 } from "lucide-react";

/* ── Single-image mode (default) ── */
type SingleProps = {
  value: string;
  onChange: (url: string) => void;
  maxImages?: 1;
};

/* ── Multi-image mode ── */
type MultiProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages: number;
};

type CommonProps = {
  label?: string;
  aspectRatio?: "square" | "landscape" | "portrait";
  folder?: string;
};

type Props = (SingleProps | MultiProps) & CommonProps;

function isMulti(props: Props): props is MultiProps & CommonProps {
  return Array.isArray(props.value) && (props.maxImages ?? 1) > 1;
}

export default function ImageUpload(props: Props) {
  const { label = "Image", aspectRatio = "landscape", folder = "oauthc", maxImages = 1 } = props;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const heightCls = aspectRatio === "square" ? "h-40" : aspectRatio === "portrait" ? "h-52" : "h-36";

  /* Normalize to array internally */
  const urls: string[] = isMulti(props) ? props.value : props.value ? [props.value] : [];
  const canAdd = urls.length < maxImages;
  const remaining = maxImages - urls.length;

  /* Use a ref to accumulate uploads within a single widget session,
     since onSuccess fires once per file and the closure captures stale urls */
  const pendingRef = useRef<string[]>([]);

  const handleSuccess = useCallback((result: any) => {
    if (result.event === "success" && typeof result.info === "object" && result.info) {
      const url = (result.info as { secure_url: string }).secure_url;

      if (isMulti(props)) {
        pendingRef.current.push(url);
        props.onChange([...props.value, ...pendingRef.current]);
      } else {
        (props as SingleProps).onChange(url);
      }
    }
  }, [props]);

  const handleOpen = useCallback(() => {
    pendingRef.current = [];
    setUploading(true);
  }, []);

  const handleClose = useCallback(() => {
    pendingRef.current = [];
    setUploading(false);
  }, []);

  const removeUrl = (index: number) => {
    if (isMulti(props)) {
      props.onChange(urls.filter((_, i) => i !== index));
    } else {
      (props as SingleProps).onChange("");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-600">
          {label}
          {maxImages > 1 && <span className="text-gray-400 font-normal ml-1">({urls.length}/{maxImages})</span>}
        </label>

        {/* Existing images */}
        {urls.length > 0 && (
          <div className={`grid gap-2 ${maxImages > 1 ? "grid-cols-2 sm:grid-cols-3" : ""}`}>
            {urls.map((url, i) => (
              <div key={url + i} className={`relative w-full ${heightCls} rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group`}>
                <Image src={url} alt="Upload preview" fill className="object-cover" sizes="400px" unoptimized />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={() => setPreviewUrl(url)}
                    className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition"
                  >
                    <ZoomIn size={13} strokeWidth={2} className="text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeUrl(i)}
                    className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-red-50 transition"
                  >
                    <X size={13} strokeWidth={2} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload button — shown when under limit */}
        {canAdd && (
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "ml_default"}
            options={{
              folder,
              multiple: maxImages > 1,
              maxFiles: remaining,
              resourceType: "image",
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
            }}
            onOpen={handleOpen}
            onClose={handleClose}
            onSuccess={handleSuccess}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                disabled={uploading}
                className={`w-full ${heightCls} rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-green-900 hover:bg-green-50 transition flex flex-col items-center justify-center gap-1.5 group disabled:opacity-60`}
              >
                {uploading ? (
                  <>
                    <Loader2 size={20} strokeWidth={1.5} className="text-gray-400 animate-spin" />
                    <span className="text-xs text-gray-400 font-medium">Uploading…</span>
                  </>
                ) : (
                  <>
                    <ImagePlus size={20} strokeWidth={1.5} className="text-gray-300 group-hover:text-green-900 transition" />
                    <span className="text-xs text-gray-400 group-hover:text-green-900 transition font-medium">
                      {maxImages > 1 ? `Click to upload (up to ${remaining})` : "Click to upload"}
                    </span>
                  </>
                )}
              </button>
            )}
          </CldUploadWidget>
        )}
      </div>

      {/* Full-size preview modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => setPreviewUrl(null)}>
          <div className="relative max-w-3xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={previewUrl}
              alt="Full preview"
              width={1200}
              height={800}
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
              unoptimized
            />
            <button
              type="button"
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition"
            >
              <X size={16} strokeWidth={2} className="text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
