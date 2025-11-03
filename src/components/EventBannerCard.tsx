/* eslint-disable react-hooks/rules-of-hooks */
// components/EventBannerCard.tsx
import React, { useRef, useState, useEffect } from "react";

type Props = {
  eventId: string;
  title: string;
  dateText?: string;  // e.g. "Nov 28, 2025 • 5:00 PM"
  venue?: string;
  category?: string;  // e.g. "workshop" | "hackathon"
  initialUrl?: string; // existing banner url if editing
  onFileSelected?: (file: File | null) => void; // local machine file
  onUseAutoBanner?: (autoUrl: string) => void;  // when user picks auto
  maxSizeMB?: number;
};

export default function EventBannerCard({
  eventId,
  title,
  dateText,
  venue,
  category,
  initialUrl,
  onFileSelected,
  onUseAutoBanner,
  maxSizeMB = 8,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuto, setIsAuto] = useState<boolean>(!initialUrl);

  useEffect(() => {
    if (initialUrl) {
      setPreview(initialUrl);
      setIsAuto(false);
    }
  }, [initialUrl]);

  function openPicker() {
    inputRef.current?.click();
  }

  function validateAndSet(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    const bytesLimit = maxSizeMB * 1024 * 1024;
    if (file.size > bytesLimit) {
      setError(`Image is larger than ${maxSizeMB}MB.`);
      return;
    }
    const url = URL.createObjectURL(file);
    setIsAuto(false);
    setPreview(url);
    onFileSelected?.(file);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validateAndSet(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSet(file);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  }

  function clearImage() {
    setPreview(null);
    setIsAuto(true);
    onFileSelected?.(null);
    if (inputRef.current) inputRef.current.value = "";
    useAutoBanner(); // immediately switch to auto image
  }

  function autoBannerUrl() {
    // Your dynamic OG route from earlier
    const params = new URLSearchParams();
    if (title) params.set("title", title);
    if (dateText) params.set("date", dateText);
    if (venue) params.set("venue", venue);
    if (category) params.set("cat", category);
    return `/api/event-banner/${eventId}?${params.toString()}`;
  }

  function useAutoBanner() {
    const url = autoBannerUrl();
    setIsAuto(true);
    setPreview(url);
    onUseAutoBanner?.(url);
  }

  return (
    <div className="w-full">
      {/* Header row like Luma: title + actions */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Event banner (16:9). PNG/JPG/WebP, up to {maxSizeMB}MB.
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={useAutoBanner}
            className={`px-3 py-1.5 text-sm rounded-lg ring-1 ring-slate-200 shadow-sm hover:bg-slate-50 ${
              isAuto ? "bg-slate-100" : "bg-white"
            }`}
            title="Generate a default banner from your event details"
          >
            Use Auto Banner
          </button>
          <button
            type="button"
            onClick={openPicker}
            className="px-3 py-1.5 text-sm rounded-lg bg-[#0A143A] text-white shadow hover:opacity-95"
          >
            Upload Image
          </button>
        </div>
      </div>

      {/* Clickable card */}
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={onKeyDown}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        aria-label="Event banner"
        className={[
          "relative rounded-2xl transition overflow-hidden",
          "aspect-[16/9] w-full",
          preview
            ? "bg-slate-100 ring-1 ring-slate-200 hover:ring-[#0A143A]/30"
            : "bg-white border-2 border-dashed border-slate-300 hover:border-[#0A143A] hover:bg-slate-50",
          "shadow-sm",
          "cursor-pointer",
          dragOver ? "ring-4 ring-[#0A143A]/40" : "",
        ].join(" ")}
      >
        {/* Empty state */}
        {!preview && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-4 text-center">
            <div className="text-3xl">🖼️</div>
            <p className="font-medium text-slate-800">Click to upload</p>
            <p className="text-sm text-slate-500">or drag and drop</p>
            <p className="text-xs text-slate-400 mt-1">Recommended: 1600×900 (16:9)</p>
          </div>
        )}

        {/* Preview (uploaded OR auto) */}
        {preview && (
          <>
            {/* object-cover keeps it neat like Luma */}
            <img
              src={preview}
              alt="Event banner preview"
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            {/* subtle bottom gradient for legibility */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />

            {/* Controls (Replace / Remove / Gear) */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openPicker();
                }}
                className="rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-sm shadow ring-1 ring-black/10 hover:bg-white"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
                className="rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-sm shadow ring-1 ring-black/10 hover:bg-white"
              >
                Remove
              </button>
              <span className="bg-[#0A143A] text-white rounded-full p-2 ring-1 ring-white/10">
                ⚙️
              </span>
            </div>

            {/* Label badge to indicate source */}
            <div className="absolute top-3 left-3">
              <span className="rounded-full bg-black/40 text-white text-xs px-2 py-1 backdrop-blur">
                {isAuto ? "Auto banner" : "Uploaded"}
              </span>
            </div>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
