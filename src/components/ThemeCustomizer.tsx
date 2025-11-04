import React, { useState } from "react";
import {
  THEMES,
  FONTS,
  type ThemeConfig,
  type ThemeType,
} from "../lib/eventThemes";

interface ThemeCustomizerProps {
  value: ThemeConfig;
  onChange: (config: ThemeConfig) => void;
}

export default function ThemeCustomizer({
  value,
  onChange,
}: ThemeCustomizerProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleThemeChange = (type: ThemeType) => {
    onChange({ ...value, type });
  };

  const handleColorChange = (color: string) => {
    onChange({ ...value, color });
  };

  const handleFontChange = (font: string) => {
    onChange({ ...value, font });
  };

  const handleDisplayChange = (display: "auto" | "light" | "dark") => {
    onChange({ ...value, display });
  };

  return (
    <div className="space-y-4">
      {/* Theme selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {THEMES.map((theme) => (
          <button
            key={theme.type}
            onClick={() => handleThemeChange(theme.type)}
            className={`
              flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-3 min-w-[80px]
              transition-all border-2
              ${
                value.type === theme.type
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }
            `}
          >
            <div className="text-2xl">{theme.icon}</div>
            <span className="text-xs text-white/80">{theme.label}</span>
          </button>
        ))}
      </div>

      {/* Customization options */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Color */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-white/60">Colour</label>
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div
                className="w-4 h-4 rounded border border-white/20"
                style={{ backgroundColor: value.color || "#4DA2FD" }}
              />
              <span className="text-sm text-white/80">Custom</span>
              <svg
                className="w-3 h-3 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showColorPicker && (
              <div className="absolute top-full mt-2 left-0 z-[100]">
                <div className="bg-[#1a1a1a] rounded-lg border border-white/10 p-3 shadow-xl">
                  <input
                    type="color"
                    value={value.color || "#4DA2FD"}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-32 h-8 cursor-pointer"
                  />
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {[
                      "#4DA2FD",
                      "#FF6B6B",
                      "#4ECDC4",
                      "#FFD93D",
                      "#A78BFA",
                      "#F472B6",
                      "#34D399",
                      "#FB923C",
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          handleColorChange(color);
                          setShowColorPicker(false);
                        }}
                        className="w-6 h-6 rounded border-2 border-white/20 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Style */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-white/60">Style</label>
          <select
            value={value.style || "default"}
            onChange={(e) => onChange({ ...value, style: e.target.value })}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            <option value="default">Default</option>
            <option value="gradient">Gradient</option>
            <option value="solid">Solid</option>
            <option value="pattern">Pattern</option>
          </select>
        </div>

        {/* Font */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-white/60">
            <svg
              className="w-4 h-4 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
            <span className="ml-1">Font</span>
          </label>
          <select
            value={value.font || "geist-mono"}
            onChange={(e) => handleFontChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            {FONTS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Display */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-white/60">
            <svg
              className="w-4 h-4 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span className="ml-1">Display</span>
          </label>
          <select
            value={value.display || "auto"}
            onChange={(e) =>
              handleDisplayChange(e.target.value as "auto" | "light" | "dark")
            }
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
    </div>
  );
}
