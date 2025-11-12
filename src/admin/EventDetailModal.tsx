// src/admin/EventDetailModal.tsx
import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, User, Map } from "lucide-react";
import ShareArrowIcon from "../assets/share-arrow";
import ArrowDown from "../assets/arrow-down";
import CopyIcon1 from "../assets/copy-icon-1";
import Wand from "../assets/wand";
import Calendar from "../assets/calendar";

interface EventDetailModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  event?: {
    title?: string;
    date?: string;
    time?: string;
    location?: string;
    locationDetail?: string;
    category?: string;
    status?: "private" | "public";
    image?: string;
    host?: {
      name: string;
      avatar?: string;
    };
    attendees?: Array<{
      name: string;
      avatar?: string;
    }>;
    attendeeCount?: number;
  };
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  event,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleBackdropClick}
      />

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[610px] bg-[#040C33] z-50 shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="bg-[#030B27] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors p-1.5 bg-white/5 hover:bg-white/10 rounded-lg w-[2rem] h-[2rem] flex items-center justify-center"
              >
                <ArrowDown isDropdownOpen={false} />
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10"
              >
                <span>Copy Link</span>
                <CopyIcon1 />
              </button>

              <button className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10">
                <span>Event Page</span>
                <ShareArrowIcon />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                className={`text-white/60 transition-colors p-1.5 ${
                  canPrev && onPrev
                    ? "hover:text-white"
                    : "opacity-40 cursor-not-allowed"
                }`}
                onClick={onPrev}
                disabled={!(canPrev && onPrev)}
                aria-label="Previous event"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className={`text-white/60 transition-colors p-1.5 ${
                  canNext && onNext
                    ? "hover:text-white"
                    : "opacity-40 cursor-not-allowed"
                }`}
                onClick={onNext}
                disabled={!(canNext && onNext)}
                aria-label="Next event"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 px-4 py-4 space-y-4">
            <div className="w-full h-[343px] bg-white rounded-[15px] flex items-center justify-center overflow-hidden">
              {event?.image ? (
                <img
                  src={event.image}
                  alt={event.title || "Event"}
                  className="w-full h-full object-cover rounded-[15px]"
                />
              ) : (
                <div className="text-[#030B27] text-sm opacity-50">
                  Image Placeholder
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#4DA2FD66] p-2.5 rounded-full flex items-center gap-2.5">
                <span className="text-white text-xs font-medium">
                  {event?.status === "private"
                    ? "Private Event"
                    : "Public Event"}
                </span>
                <Wand className="text-white" />
              </div>
            </div>

            <h1 className="text-white text-2xl font-bold uppercase">
              {event?.title || "SUIREF CONCERT NIGHT"}
            </h1>

            <div className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer">
              <div className="w-[20px] h-[20px] bg-white rounded-full"></div>
              <span className="text-sm font-medium flex items-center gap-1">
                {event?.category || "SUIREF CONCERT NIGHT"}
                <ChevronRight size={14} />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-start gap-2 text-white/60">
                <Calendar />
                <div className="flex flex-col gap-1">
                  <span className="text-base text-white font-medium">
                    {event?.date || "Wednesday October, 2022"}
                  </span>
                  <span className="text-sm font-medium">
                    {event?.time || "5:00 PM - 6:00 PM"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white/60">
                <MapPin size={20} />
                <span className="text-base font-medium">
                  {event?.location || "Awka"}
                </span>
              </div>
              {event?.locationDetail && (
                <div className="ml-6">
                  <span className="text-sm font-medium text-white/60">
                    {event.locationDetail}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-white/10 rounded-[25px] p-5 flex flex-col gap-2.5 border border-white/5">
              <div className="w-14 h-14 rounded-full bg-white flex-shrink-0 flex items-center justify-center">
                {event?.host?.avatar ? (
                  <img
                    src={event.host.avatar}
                    alt={event.host.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={28} className="text-[#030B27]" />
                )}
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="text-white font-bold text-base">You're in!</p>
                <p className="text-white/80 text-sm font-medium">
                  Let the fun begin, {event?.host?.name || "John"} 🎉
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/60">
                <Map size={16} />
                <span className="text-sm font-medium">Map</span>
              </div>
              <div className="w-full h-[200px] bg-[#0A133A] rounded-[15px] flex items-center justify-center relative">
                <MapPin size={24} className="text-white/40" />
              </div>
            </div>

            <div className="space-y-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-white/60">
                <User size={16} />
                <span className="text-sm font-medium">Hosted By</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 flex items-center justify-center">
                  {event?.host?.avatar ? (
                    <img
                      src={event.host.avatar}
                      alt={event.host.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={16} className="text-[#030B27]" />
                  )}
                </div>
                <span className="text-white font-bold text-sm">
                  {event?.host?.name || "John Deo"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-white font-medium text-sm">
                {event?.attendeeCount || 2} Going
              </p>
              {event?.attendees && event.attendees.length > 0 ? (
                <div className="flex items-center gap-2">
                  {event.attendees.slice(0, 3).map((attendee, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 flex items-center justify-center">
                        {attendee.avatar ? (
                          <img
                            src={attendee.avatar}
                            alt={attendee.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User size={16} className="text-[#030B27]" />
                        )}
                      </div>
                      <span className="text-white text-sm font-medium">
                        {attendee.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 flex items-center justify-center">
                    <User size={16} className="text-[#030B27]" />
                  </div>
                  <span className="text-white text-sm font-medium">
                    John deo
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 pb-4">
              <button className="text-white/60 hover:text-white transition-colors text-sm font-medium">
                Contact Host
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
