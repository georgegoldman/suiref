import React from "react";
import type { Theme } from "./ThemeSelector";

interface EventPreviewProps {
  theme: Theme;
  color: string;
  font: string;
  eventImage: string | null;
}

export const EventPreview: React.FC<EventPreviewProps> = ({
  theme,
  color,
  font,
  eventImage,
}) => {
  // Get background style based on theme
  const getBackgroundStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      backgroundColor: color,
      fontFamily: font,
    };

    switch (theme.id) {
      case "quantum":
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${color} 0%, ${adjustColor(
            color,
            30
          )} 100%)`,
        };
      case "warp":
        return {
          ...baseStyle,
          background: `radial-gradient(circle at 30% 50%, ${color} 0%, ${adjustColor(
            color,
            -20
          )} 100%)`,
        };
      case "confetti":
        return {
          ...baseStyle,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='2' fill='%23FF008E'/%3E%3Ccircle cx='40' cy='30' r='3' fill='%23FFCD1C'/%3E%3Ccircle cx='70' cy='20' r='2' fill='%2300E5FF'/%3E%3Ccircle cx='25' cy='70' r='2.5' fill='%23FF6B9D'/%3E%3Ccircle cx='80' cy='80' r='2' fill='%2300E5FF'/%3E%3C/svg%3E")`,
          backgroundColor: color,
        };
      case "pattern":
        return {
          ...baseStyle,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h30v30H0zM30 30h30v30H30z' fill='${encodeURIComponent(
            adjustColor(color, -10)
          )}'/%3E%3C/svg%3E")`,
          backgroundColor: color,
        };
      case "emoji":
        return {
          ...baseStyle,
          position: "relative",
        };
      case "seasonal":
        return {
          ...baseStyle,
          background: `linear-gradient(to bottom, ${color} 0%, ${adjustColor(
            color,
            -30
          )} 100%)`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="w-full h-[340px] rounded-2xl overflow-hidden shadow-lg relative group cursor-pointer">
      {/* Background with theme */}
      <div className="absolute inset-0" style={getBackgroundStyle()}>
        {/* Emoji decorations for emoji theme */}
        {theme.id === "emoji" && (
          <>
            <div className="absolute top-4 left-4 text-2xl">🎉</div>
            <div className="absolute top-4 right-4 text-2xl">🎊</div>
            <div className="absolute bottom-4 left-4 text-2xl">✨</div>
            <div className="absolute bottom-4 right-4 text-2xl">🎈</div>
          </>
        )}
      </div>

      {/* Event Image Overlay */}
      {eventImage && (
        <div className="absolute inset-0">
          <img
            src={eventImage}
            alt="Event"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Hover indicator */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="text-white text-sm font-medium">
          Click to change image
        </span>
      </div>
    </div>
  );
};

// Helper function to adjust color brightness
function adjustColor(hexColor: string, percent: number): string {
  const hex = hexColor.replace("#", "");
  const r = Math.max(
    0,
    Math.min(255, parseInt(hex.substr(0, 2), 16) + percent)
  );
  const g = Math.max(
    0,
    Math.min(255, parseInt(hex.substr(2, 2), 16) + percent)
  );
  const b = Math.max(
    0,
    Math.min(255, parseInt(hex.substr(4, 2), 16) + percent)
  );
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
