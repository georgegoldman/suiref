import React, { useRef, useState, useEffect } from "react";

type Props = {
  /** optional initial URL (e.g. when editing an event) */
  initialUrl?: string;
  /** called when a valid file is chosen or cleared */
  onChange?: (file: File | null) => void;
  /** max size in MB */
  maxSizeMB?: number;
  /** recommended dimensions text */
  hint?: string;
};

export default function EventBannerUploader({
  initialUrl,
  onChange,
  maxSizeMB = 8,
  hint = "Recommended: 1600×900 (16:9)"
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // keep preview in sync if initialUrl changes
    if (initialUrl) setPreview(initialUrl);
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
    setPreview(url);
    onChange?.(file);
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
    onChange?.(null);
    // reset the input so selecting the same file again triggers onChange
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="w-full">
      {/* Clickable / focusable card */}
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
        className={[
          "relative rounded-2xl shadow-sm transition overflow-hidden",
          "aspect-[16/9] w-full bg-white",
          preview
            ? "ring-2 ring-transparent hover:ring-[#0A143A]/30"
            : "border-2 border-dashed border-slate-300 hover:border-[#0A143A] hover:bg-slate-50",
          dragOver ? "ring-4 ring-[#0A143A]/40" : ""
        ].join(" ")}
        aria-label="Upload event banner"
      >
        {/* Empty state */}
        {!preview && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
            <div className="text-3xl">🖼️</div>
            <p className="font-medium text-slate-800">Click to upload</p>
            <p className="text-sm text-slate-500">or drag and drop</p>
            <p className="text-xs text-slate-400 mt-1">{hint}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openPicker();
              }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-[#0A143A] text-white text-sm"
            >
              Choose Image
            </button>
          </div>
        )}

        {/* Preview */}
        {preview && (
          <>
            <img
              src={preview}
              alt="Event banner preview"
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />

            {/* Gradient scrim for legibility */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />

            {/* Controls */}
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

              {/* Your original gear icon kept as a quick action */}
              <span className="bg-[#0A143A] text-white rounded-full p-2 ring-1 ring-white/10">
                ⚙️
              </span>
            </div>
          </>
        )}

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
