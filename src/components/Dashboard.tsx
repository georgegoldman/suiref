// src/components/Dashboard.tsx
import React, { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSessionData, useUser } from "../session-data";
// import { useCreateProfile } from "../mutations/useCreateProfile";
import DashboardReferralIcon from "../assets/dashboard-referral-icon";
import DashboardPointEarned from "../assets/dashboard-point-earned";
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

const CreateReferralButton: React.FC<{
  username?: string | null;
  address?: string | null;
}> = ({ username, address }) => {
  const [copied, setCopied] = React.useState(false);
  const id = username || address || "";
  const url = id ? `${window.location.origin}/r/${id}` : "";

  const handleClick = async () => {
    if (!id) {
      alert("Create a profile or connect your wallet to get a referral link.");
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy your referral link:", url);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="
        h-10 px-5 rounded-full
        bg-[#4DA2FD] hover:bg-[#63AEFF]
        text-[#031335] font-semibold text-sm
        inline-flex items-center gap-2
        shadow-sm outline outline-1 outline-black/10
        focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40
      "
      title={url || "Referral link"}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 5v14M5 12h14"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
      {copied ? "Copied!" : "Create referral link"}
    </button>
  );
};

const Dashboard: React.FC = () => {
  const { loading, error } = useSessionData();
  const { username, ranking } = useUser();
  const currentAccount = useCurrentAccount();
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
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-black text-[24px] font-bold">
              Welcome to SuiHub dashboard
            </h1>
            <p className="text-black/60 text-sm">
              Start by sharing your referral link, and your rewards grows
            </p>
          </div>

          <div className="flex items-center gap-3">
            <CreateReferralButton
              username={username}
              address={currentAccount?.address ?? null}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-50 border border-black/5 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <DashboardReferralIcon />
              <span className="text-black/70 font-semibold text-sm">
                Total Referral:
              </span>
            </div>
            <p className="text-black text-3xl font-bold mt-2">{ranking ?? 0}</p>
          </div>

          <div className="bg-gray-50 border border-black/5 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <DashboardReferralIcon />
              <span className="text-black/70 font-semibold text-sm">
                Workshop Attendees:
              </span>
            </div>
            <p className="text-black text-3xl font-bold mt-2">0</p>
          </div>

          <div className="bg-gray-50 border border-black/5 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <DashboardPointEarned />
              <span className="text-black/70 font-semibold text-sm">
                Points Earned:
              </span>
            </div>
            <p className="text-black text-3xl font-bold mt-2">0</p>
          </div>
        </div>

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
                        <div key={event.id} className="relative mb-10 last:mb-0">
                          {/* Date Group */}
                          <div className="absolute left-0 top-[90px] w-[60px] sm:w-[70px] text-right pr-4 sm:pr-0 sm:text-left">
                            <p className="text-black text-base font-bold">
                              {month} {day}
                            </p>
                            <p className="text-black/40 text-sm sm:text-base font-bold">
                              {dayOfWeek}
                            </p>
                          </div>

                          {/* Timeline Dot */}
                          <div className="absolute left-[72px] sm:left-[92px] top-[100px] w-[18px] h-[18px] rounded-full bg-black/5 border-[3px] border-white ring-1 ring-black/10 z-10" />

                          {/* Event Card */}
                          <div
                            className="ml-[100px] sm:ml-[140px] cursor-pointer"
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
