import { useState, useEffect, useCallback } from "react";
import ImagePickerModal from "./ImagePickerModal";
import ThemeCustomizer from "./ThemeCustomizer";
import {
  getRandomImage,
  type ThemeConfig,
  type PresetImage,
} from "../lib/eventThemes";

type Props = {
  /** optional initial URL (e.g. when editing an event) */
  initialUrl?: string;
  /** called when image changes */
  onChange?: (data: {
    file?: File;
    preset?: PresetImage;
    theme: ThemeConfig;
  }) => void;
  /** initial theme config */
  initialTheme?: ThemeConfig;
};

export default function EventBannerCard({
  eventId,
  title,
  dateText,
  venue,
  category,
  initialUrl,
  onChange,
  initialTheme = {
    type: "minimal",
    color: "#4DA2FD",
    font: "geist-mono",
    display: "auto",
  },
}: Props) {
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme);
  const [presetImage, setPresetImage] = useState<PresetImage | null>(() =>
    getRandomImage()
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(
    initialUrl ?? null
  );
  const [showModal, setShowModal] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  useEffect(() => {
    if (initialUrl) setUploadedPreview(initialUrl);
  }, [initialUrl]);

  // Notify parent of changes
  const notifyChange = useCallback(() => {
    onChange?.({
      file: uploadedFile || undefined,
      preset: presetImage || undefined,
      theme,
    });
  }, [onChange, uploadedFile, presetImage, theme]);

  useEffect(() => {
    notifyChange();
  }, [notifyChange]);

  const handleShuffle = () => {
    setPresetImage(getRandomImage());
  };

  const handleImageSelect = (image: PresetImage | File) => {
    if (image instanceof File) {
      // User uploaded a file
      setUploadedFile(image);
      setUploadedPreview(URL.createObjectURL(image));
      setPresetImage(null);
    } else {
      // User selected a preset
      setPresetImage(image);
      setUploadedFile(null);
      setUploadedPreview(null);
    }
  };

  const handleThemeChange = (newTheme: ThemeConfig) => {
    setTheme(newTheme);
  };

  return (
    <div className="w-full space-y-4">
      {/* Main banner/canvas */}
      <div
        onClick={() => setShowModal(true)}
        className="relative rounded-2xl overflow-hidden cursor-pointer aspect-[16/9] w-full group transition-all hover:ring-2 hover:ring-blue-500/50"
      >
        {/* Image or generated theme background */}
        {uploadedPreview ? (
          <img
            src={uploadedPreview}
            alt="Event banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background:
                theme.type === "minimal"
                  ? `linear-gradient(135deg, ${
                      theme.color || "#4DA2FD"
                    } 0%, ${adjustColor(theme.color || "#4DA2FD", -30)} 100%)`
                  : theme.type === "quantum"
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : theme.type === "warp"
                  ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  : theme.type === "confetti"
                  ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                  : theme.type === "pattern"
                  ? `repeating-linear-gradient(45deg, ${
                      theme.color || "#4DA2FD"
                    }, ${
                      theme.color || "#4DA2FD"
                    } 10px, transparent 10px, transparent 20px)`
                  : `linear-gradient(135deg, ${
                      theme.color || "#4DA2FD"
                    } 0%, ${adjustColor(theme.color || "#4DA2FD", -30)} 100%)`,
            }}
          >
            {/* Placeholder emoji/icon for preset */}
            {presetImage && (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                🖼️
              </div>
            )}

            {/* Event title overlay (sample) */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                fontFamily:
                  theme.font === "geist-mono" ? "monospace" : "sans-serif",
              }}
            >
              <span className="text-white text-4xl font-bold drop-shadow-lg">
                Event Name
              </span>
            </div>
          </div>
        )}

        {/* Camera icon overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-3">
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Theme selector and shuffle */}
      <div className="bg-[#0B183F] rounded-xl ring-1 ring-white/10 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setShowCustomizer(!showCustomizer)}
          className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
        >
          <div
            className="h-8 w-12 rounded"
            style={{
              background: theme.color || "#4DA2FD",
            }}
          />
          <div className="text-sm text-white/80">
            <span className="mr-2">Theme</span>
            <span className="text-white font-medium capitalize">
              {theme.type}
            </span>
          </div>
        </button>

        <button
          onClick={handleShuffle}
          className="text-white/60 hover:text-white text-xl transition-colors"
          title="Shuffle theme"
        >
          ↻
        </button>
      </div>

      {/* Theme customizer panel */}
      {showCustomizer && (
        <div className="bg-[#0B183F] rounded-xl ring-1 ring-white/10 px-4 py-4">
          <ThemeCustomizer value={theme} onChange={handleThemeChange} />
        </div>
      )}

      {/* Image picker modal */}
      <ImagePickerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelectImage={handleImageSelect}
      />
    </div>
  );
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const clamp = (num: number) => Math.min(Math.max(num, 0), 255);

  const num = parseInt(color.replace("#", ""), 16);
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0x00ff) + amount);
  const b = clamp((num & 0x0000ff) + amount);

  return "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
