// src/admin/EventCard.tsx
import React from "react";
import { MapPin, UserCircle } from "lucide-react";
import ShareIcon from "../assets/share-icon";

interface EventCardProps {
  image: string;
  date: string;
  time: string;
  title: string;
  location: string;
  guests: number;
  organizer: {
    name: string;
    avatar: string;
  };
  onManageEvent?: () => void;
  variant?: "default" | "light";
}

export const EventCard: React.FC<EventCardProps> = ({
  image,
  date,
  time,
  title,
  location,
  guests,
  organizer,
  onManageEvent,
  variant = "default",
}) => {
  const isLight = variant === "light";

  return (
    <div
      className={`
        relative rounded-xl border p-4 transition-all duration-200
        ${
          isLight
            ? "bg-white border-black/10 hover:border-black/20"
            : "bg-white/5 border-white/10 hover:bg-white/10"
        }
      `}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Event Image */}
        <div className="w-full sm:w-[160px] h-[160px] sm:h-[100px] flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event Details */}
        <div className="flex-1 min-w-0 w-full flex flex-col justify-between self-stretch">
          <div>
            {/* Top Section */}
            <p
              className={`text-sm font-medium mb-2 flex items-center gap-2.5 ${
                isLight ? "text-black/60" : "text-white/50"
              }`}
            >
              <span>{date}</span>
              <span>•</span>
              <span>{time}</span>
            </p>
            <h3
              className={`text-2xl font-medium ${
                isLight ? "text-black" : "text-white"
              }`}
            >
              {title}
            </h3>

            {/* Location */}
            <div
              className={`flex items-center gap-2 mt-2 ${
                isLight ? "text-black/60" : "text-white/50"
              }`}
            >
              <MapPin size={15} />
              <span className="text-sm">{location}</span>
            </div>

            {/* Guests */}
            <div
              className={`flex items-center gap-2 mt-1 ${
                isLight ? "text-black/60" : "text-white/50"
              }`}
            >
              <UserCircle size={15} />
              <span className="text-sm font-medium">
                {guests} Guest{guests !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              {onManageEvent && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onManageEvent();
                  }}
                  className={`p-2.5 rounded-full text-xs font-medium transition-colors ${
                    isLight
                      ? "bg-black/5 hover:bg-black/10 text-black"
                      : "bg-white/20 hover:bg-[#5a6578] text-white"
                  }`}
                >
                  Manage Event
                </button>
              )}

              {/* Organizer Avatar - Only show in default (dark/admin) mode */}
              {!isLight && (
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img
                    src={organizer.avatar}
                    alt={organizer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <button
              className={`cursor-pointer ${
                isLight ? "text-black/40 hover:text-black/60" : ""
              }`}
            >
              <ShareIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// End of component
