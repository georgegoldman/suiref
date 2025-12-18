import React, { useState } from "react";
import { useSessionData } from "../session-data";
// import { useCreateProfile } from "../mutations/useCreateProfile";
import { EventDetailModal } from "../admin/EventDetailModal";
import { EventCard } from "../admin/EventCard";

// Sample data for different tabs (Mock data for now, similar to AdminHistory)
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
];



const Dashboard: React.FC = () => {
  const { loading, error } = useSessionData();
  const [activeTab, setActiveTab] = useState<"upcoming" | "ongoing" | "past">(
    "upcoming"
  );
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

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


  if (loading) return <div className="text-black">Loading…</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="flex-1 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Event Timeline Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h4 className="text-black font-bold text-lg">Events</h4>
            
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              {(["upcoming", "ongoing", "past"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize
                    ${
                      activeTab === tab
                        ? "bg-white shadow-sm text-black"
                        : "text-black/50 hover:text-black/70"
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
             {/* Timeline Layout */}
             {events.length > 0 ? (
                <>
                  {/* Timeline Line */}
                  <div className="absolute left-[80px] sm:left-[100px] top-0 bottom-0 w-0 border-l-[2px] border-dashed border-black/10" />

                  <div className="flex flex-col">
                    {events.map((event) => {
                      const dateMatch = event.date.match(/(\w+),\s*(\w+)\s*(\d+)/);
                      const dayOfWeek = dateMatch ? dateMatch[1] : "";
                      const month = dateMatch ? dateMatch[2] : "";
                      const day = dateMatch ? dateMatch[3] : "";

                      return (
                        <div key={event.id} className="flex gap-4 md:gap-6 mb-8 last:mb-0">
                          {/* Date Group */}
                          <div className="flex flex-col items-end w-[60px] md:w-[70px] shrink-0 pt-2">
                             <p className="text-black text-base font-bold whitespace-nowrap">
                               {month} {day}
                             </p>
                             <p className="text-black/40 text-sm md:text-base font-bold">
                               {dayOfWeek}
                             </p>
                          </div>

                          {/* Timeline Dot */}
                          <div className="relative flex flex-col items-center pt-3">
                             <div className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] rounded-full bg-black/5 border-[3px] border-white ring-1 ring-black/10 z-10" />
                          </div>

                          {/* Event Card */}
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => setSelectedEventId(event.id)}
                          >
                            <EventCard
                              {...event}
                              variant="light"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
             ) : (
              <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-black/10">
                <p className="text-black/40 text-lg">No {activeTab} events</p>
              </div>
             )}
          </div>
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
    </div>
  );
};

export default Dashboard;
