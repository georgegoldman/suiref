import React, { useState } from "react";

export interface Theme {
  id: string;
  name: string;
  preview: string;
  description: string;
  defaultColor: string;
  suggestedColors: string[];
}

export const themes: Theme[] = [
  {
    id: "minimal",
    name: "Minimal",
    preview: "🎨",
    description: "Clean and simple design",
    defaultColor: "#F5F5F5",
    suggestedColors: ["#FFFFFF", "#F5F5F5", "#E5E5E5", "#CCCCCC"],
  },
  {
    id: "quantum",
    name: "Quantum",
    preview: "⚛️",
    description: "Futuristic gradient background",
    defaultColor: "#667EEA",
    suggestedColors: ["#667EEA", "#764BA2", "#F093FB", "#4FACFE"],
  },
  {
    id: "warp",
    name: "Warp",
    preview: "🌀",
    description: "Dynamic flowing patterns",
    defaultColor: "#FF6B6B",
    suggestedColors: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3"],
  },
  {
    id: "emoji",
    name: "Emoji",
    preview: "😊",
    description: "Fun emoji decorations",
    defaultColor: "#FFD93D",
    suggestedColors: ["#FFD93D", "#6BCF7F", "#FF6B9D", "#A8E6CF"],
  },
  {
    id: "confetti",
    name: "Confetti",
    preview: "🎉",
    description: "Celebratory confetti background",
    defaultColor: "#FF008E",
    suggestedColors: ["#FF008E", "#FFCD1C", "#00E5FF", "#C44569"],
  },
  {
    id: "pattern",
    name: "Pattern",
    preview: "🔷",
    description: "Geometric pattern overlay",
    defaultColor: "#667EEA",
    suggestedColors: ["#667EEA", "#764BA2", "#F093FB", "#5F27CD"],
  },
  {
    id: "seasonal",
    name: "Seasonal",
    preview: "🍂",
    description: "Seasonal themed background",
    defaultColor: "#FF6B35",
    suggestedColors: ["#FF6B35", "#F7931E", "#FDC830", "#FC5C65"],
  },
];

interface ThemeSelectorProps {
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  selectedFont: string;
  onFontChange: (font: string) => void;
  displayMode: "auto" | "light" | "dark";
  onDisplayModeChange: (mode: "auto" | "light" | "dark") => void;
}

const availableFonts = [
  "Geist Mono",
  "Inter",
  "Roboto",
  "Poppins",
  "Montserrat",
  "Open Sans",
  "Lato",
  "Playfair Display",
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onThemeChange,
  isExpanded,
  onToggleExpanded,
  selectedColor,
  onColorChange,
  selectedFont,
  onFontChange,
  displayMode,
  onDisplayModeChange,
}) => {
  const card = "bg-[#0B183F] rounded-xl ring-1 ring-white/10 px-4 py-3";
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className="space-y-3">
      {/* Theme selector row */}
      <div className={card + " flex items-center justify-between"}>
        <button
          onClick={onToggleExpanded}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <span
            className="h-6 w-10 rounded flex items-center justify-center text-xs"
            style={{ backgroundColor: selectedColor }}
          >
            {selectedTheme.preview}
          </span>
          <div className="text-sm text-white/80">
            <span className="mr-2">Theme</span>
            <span className="text-white font-medium">{selectedTheme.name}</span>
          </div>
        </button>
      </div>

      {/* Expanded theme options */}
      {isExpanded && (
        <div className={card + " space-y-4"}>
          {/* Theme grid */}
          <div className="grid grid-cols-4 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onThemeChange(theme);
                  onColorChange(theme.defaultColor);
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  selectedTheme.id === theme.id
                    ? "bg-white/10 ring-1 ring-white/20"
                    : "hover:bg-white/5"
                }`}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: theme.defaultColor }}
                >
                  {theme.preview}
                </div>
                <span className="text-xs text-white/70 text-center">
                  {theme.name}
                </span>
              </button>
            ))}
          </div>

          {/* Customization options */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            {/* Color */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full ring-2 ring-white/20"
                    style={{ backgroundColor: selectedColor }}
                  ></div>
                  <span className="text-sm text-white/80">Colour</span>
                </div>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="text-xs text-white/60 hover:text-white/80"
                >
                  {showColorPicker ? "Hide" : "Custom"}
                </button>
              </div>

              {/* Suggested colors */}
              <div className="flex gap-2 flex-wrap">
                {selectedTheme.suggestedColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onColorChange(color)}
                    className={`w-8 h-8 rounded-lg transition-all ${
                      selectedColor === color
                        ? "ring-2 ring-white scale-110"
                        : "ring-1 ring-white/20 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              {/* Custom color picker */}
              {showColorPicker && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer bg-white/5 border border-white/10"
                  />
                  <input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-24 px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-white outline-none focus:ring-1 focus:ring-white/20"
                    placeholder="#000000"
                  />
                </div>
              )}
            </div>

            {/* Font */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center text-white/40 text-xs font-bold">
                  Ag
                </span>
                <span className="text-sm text-white/80">Font</span>
              </div>
              <select
                value={selectedFont}
                onChange={(e) => onFontChange(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-white/20 cursor-pointer"
              >
                {availableFonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-400 to-pink-500 opacity-50"></div>
                <span className="text-sm text-white/80">Display</span>
              </div>
              <select
                value={displayMode}
                onChange={(e) =>
                  onDisplayModeChange(
                    e.target.value as "auto" | "light" | "dark"
                  )
                }
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-white/20 cursor-pointer"
              >
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
