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
}) => {
  return (
    <div className="bg-white/5 border border-[#4DA2FD80] rounded-[20px] py-5 px-4 shadow-sm flex gap-6 relative overflow-hidden">
      {/* Event Image */}
      <div className="w-[200px] h-[200px] rounded-[15px] overflow-hidden flex-shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Event Details */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Top Section */}
        <p className="text-white/50 text-sm font-medium mb-2 flex items-center gap-2.5">
          <span>{date}</span>
          <span>•</span>
          <span>{time}</span>
        </p>
        <h3 className="text-white text-2xl font-medium">{title}</h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-white/50">
          <MapPin size={15} />
          <span className="text-sm">{location}</span>
        </div>

        {/* Guests */}
        <div className="flex items-center gap-2 text-white/50">
          <UserCircle size={15} />
          <span className="text-sm font-medium">
            {guests} Guest{guests !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onManageEvent?.();
              }}
              className="bg-white/20 hover:bg-[#5a6578] text-white p-2.5 rounded-full text-xs font-medium transition-colors"
            >
              Manage Event
            </button>

            {/* Organizer Avatar */}
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img
                src={organizer.avatar}
                alt={organizer.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <button className="cursor-pointer">
            <ShareIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
