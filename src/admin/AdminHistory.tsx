// src/admin/AdminHistory.tsx
import { useState } from "react";
import { EventCard } from "./EventCard";
import { EventDetailModal } from "./EventDetailModal";
import { EventDetail } from "./EventDetail";

// Sample data for different tabs
const upcomingEvents = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    date: "Saturday, Nov 2",
    time: "8:00 AM",
    title: "SuiRef Conference 2.0",
    location: "Eronye Junction, Enugu State",
    guests: 1,
    organizer: {
      name: "Admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    },
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
    date: "Sunday, Nov 3",
    time: "10:00 AM",
    title: "SuiRef Conference 2.0",
    location: "Eronye Junction, Enugu State",
    guests: 1,
    organizer: {
      name: "Admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    },
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865",
    date: "Monday, Nov 4",
    time: "2:00 PM",
    title: "SuiRef Conference 2.0",
    location: "Eronye Junction, Enugu State",
    guests: 1,
    organizer: {
      name: "Admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    },
  },
];

const ongoingEvents = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    date: "Today",
    time: "Now",
    title: "Live Workshop Session",
    location: "Tech Hub, Lagos",
    guests: 45,
    organizer: {
      name: "Admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    },
  },
];

const pastEvents = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    date: "Friday, Oct 25",
    time: "6:00 PM",
    title: "Web3 Meetup",
    location: "Innovation Center",
    guests: 32,
    organizer: {
      name: "Admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    },
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8",
    date: "Thursday, Oct 20",
    time: "3:00 PM",
    title: "Blockchain Workshop",
    location: "Tech Space",
    guests: 28,
    organizer: {
      name: "Admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    },
  },
];

export default function AdminHistory() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "ongoing" | "past">(
    "upcoming"
  );
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);

  const getEvents = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingEvents;
      case "ongoing":
        return ongoingEvents;
      case "past":
        return pastEvents;
      default:
        return [];
    }
  };

  const events = getEvents();
  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const selectedIndex = selectedEventId
    ? events.findIndex((e) => e.id === selectedEventId)
    : -1;
  const canPrev = selectedIndex > 0;
  const canNext = selectedIndex >= 0 && selectedIndex < events.length - 1;
  const goPrev = () => {
    if (!canPrev) return;
    const prev = events[selectedIndex - 1];
    setSelectedEventId(prev?.id ?? null);
  };
  const goNext = () => {
    if (!canNext) return;
    const next = events[selectedIndex + 1];
    setSelectedEventId(next?.id ?? null);
  };

  if (showEventDetail) {
    return <EventDetail onBack={() => setShowEventDetail(false)} />;
  }

  return (
    <>
      <div className="mx-auto max-w-[1120px] px-4 lg:px-6 py-6">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[2rem] font-medium text-white">History</h3>

          <div className="flex items-center gap-2.5 bg-white/10 p-1.5 rounded-[10px] max-w-[312px] w-full">
            <button
              className={`rounded-[8px] p-2.5 text-base font-medium flex-1 transition-colors ${
                activeTab === "upcoming"
                  ? "bg-white/10 text-white"
                  : "text-white/60"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`rounded-[8px] p-2.5 text-base font-medium flex-1 transition-colors ${
                activeTab === "ongoing"
                  ? "bg-white/10 text-white"
                  : "text-white/60"
              }`}
              onClick={() => setActiveTab("ongoing")}
            >
              Ongoing
            </button>
            <button
              className={`rounded-[8px] p-2.5 text-base font-medium flex-1 transition-colors ${
                activeTab === "past"
                  ? "bg-white/10 text-white"
                  : "text-white/60"
              }`}
              onClick={() => setActiveTab("past")}
            >
              Past
            </button>
          </div>
        </div>

        {/* Event Cards - Timeline Layout */}
        <div className="relative">
          {events.length > 0 ? (
            <>
              {/* Timeline Line */}
              <div className="absolute left-[100px] top-0 bottom-0 w-0 border-l-[2px] border-dashed border-white/20" />

              {/* Event Cards */}
              <div className="flex flex-col">
                {events.map((event) => {
                  const dateMatch = event.date.match(/(\w+),\s*(\w+)\s*(\d+)/);
                  const dayOfWeek = dateMatch ? dateMatch[1] : "";
                  const month = dateMatch ? dateMatch[2] : "";
                  const day = dateMatch ? dateMatch[3] : "";

                  return (
                    <div key={event.id} className="relative mb-10 last:mb-0">
                      <div className="absolute left-0 top-[90px] w-[70px]">
                        <p className="text-white text-base font-bold">
                          {month} {day}
                        </p>
                        <p className="text-white/60 text-base font-bold">
                          {dayOfWeek}
                        </p>
                      </div>

                      {/* Timeline Dot */}
                      <div className="absolute left-[92px] top-[100px] w-[18px] h-[18px] rounded-full bg-white/60 border-[3px] border-[#030B27] z-10" />

                      {/* Event Card */}
                      <div
                        className="ml-[140px] cursor-pointer"
                        onClick={() => setSelectedEventId(event.id)}
                      >
                        <EventCard
                          {...event}
                          onManageEvent={() => setShowEventDetail(true)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">No {activeTab} events</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        eventId={selectedEventId || ""}
        isOpen={!!selectedEventId}
        onClose={() => setSelectedEventId(null)}
        onPrev={canPrev ? goPrev : undefined}
        onNext={canNext ? goNext : undefined}
        canPrev={canPrev}
        canNext={canNext}
        event={
          selectedEvent
            ? {
                title: selectedEvent.title,
                date: selectedEvent.date,
                time: selectedEvent.time,
                location: selectedEvent.location,
                status: "private",
                image: selectedEvent.image,
                host: {
                  name: selectedEvent.organizer.name,
                  avatar: selectedEvent.organizer.avatar,
                },
                attendeeCount: selectedEvent.guests,
                attendees: [
                  {
                    name: selectedEvent.organizer.name,
                    avatar: selectedEvent.organizer.avatar,
                  },
                ],
              }
            : undefined
        }
      />
    </>
  );
}
