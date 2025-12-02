// src/admin/EventDetail.tsx
import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit3Icon,
  MailIcon,
  MapPin,
  MessageSquareIcon,
  PencilIcon,
  PlusIcon,
  User,
  UserCircle,
} from "lucide-react";
import ShareArrowIcon from "../assets/share-arrow";
import ProgressBar from "../assets/progress-bar";

interface EventDetailProps {
  onBack: () => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({
  onBack,
}) => {
  const EventDetailsTabs = [
    "Overview",
    "Guests",
    "Registration",
    "Blast",
    "Insights",
    "More",
  ];

  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="mx-auto max-w-[1120px] px-4 lg:px-6 py-6 flex flex-col gap-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to History</span>
      </button>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h5 className="text-xs font-medium text-white">Manage Event</h5>
          <h3 className="text-[2rem] font-bold text-white">History</h3>
        </div>
        <button className="bg-white/10 hover:bg-white/20 text-white/60 p-2.5 rounded-[10px] flex items-center gap-2.5">
          <span className="text-sm font-medium">Event Page</span>
          <ShareArrowIcon />
        </button>
      </div>

      <div className="w-full border-b border-white/10 flex items-center gap-2.5">
        {EventDetailsTabs.map((tab, index) => (
          <button
            key={tab}
            // className="text-sm font-medium text-white p-2.5 border-b-1 border-white"
            onClick={() => setActiveTab(index)}
            className={`${
              activeTab === index
                ? "text-sm font-medium text-white p-2.5 border-b-1 border-white"
                : "text-sm font-medium text-white/60 p-2.5 border-b-1 border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-white">
              This Event Has Ended
            </h3>
            <p className="text-white/60 text-sm font-medium">
              Thank you for hosting, hope it was a success!
            </p>
          </div>
          <button className="bg-white/10 hover:bg-white/20 text-white/60 p-2.5 rounded-[10px] flex items-center gap-2.5">
            <span className="text-sm font-medium">Insights</span>
            <ShareArrowIcon />
          </button>
        </div>
        <div className="flex gap-8">
          <div className="bg-white/10 border flex-1 border-white/10 p-5 flex flex-col gap-4 rounded-[15px]">
            <div className="flex items-center justify-between text-white/60">
              <h5 className="text-base font-medium">EVENT RECAP</h5>
              <Edit3Icon size={16} />
            </div>
            <div className="flex items-center text-white/50 gap-1">
              <Calendar size={15} />
              <p className="text-sm font-medium">Yesterday</p>
            </div>
            <div className="flex items-center text-white/50 gap-1">
              <Clock size={15} />
              <p className="text-sm font-medium">5:00 PM GMT+1</p>
            </div>
            <div className="flex items-center text-white/50 gap-1">
              <MapPin size={15} />
              <p className="text-sm font-medium">Awka</p>
            </div>
            <div className="flex items-center text-white/50 gap-1">
              <User size={15} />
              <p className="text-sm font-medium">1 Guest</p>
            </div>
          </div>

          <div className="bg-white/10 border flex-1 border-white/10 p-5 flex flex-col gap-4 rounded-[15px]">
            <h3 className="uppercae text-white/60 font-medium text-base`">
              Feedback
            </h3>
            <div className="flex flex-col gap-2 items-center m-auto">
              <MessageSquareIcon />
              <p className="text-sm text-white/50 font-medium">
                No Feedback Collected
              </p>
              <p className="text-sm text-white/50 font-medium">
                You’re not collecting feedback for this event.
              </p>
              <p className="text-sm text-[#4DA2FD] font-medium">
                Schedule Feedback Email
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-white">Invites</h3>
            <p className="text-white/60 text-sm font-medium">
              Invite subscribers, contacts and past guests via email or SMS.
            </p>
          </div>
          <button className="bg-white/10 hover:bg-white/20 text-white/60 p-2.5 rounded-[10px] flex items-center gap-2.5">
            <span className="text-sm font-medium">Invite Guest</span>
            <PlusIcon size={15} />
          </button>
        </div>

        <div className="bg-white/10 border flex-1 border-white/10 p-5 flex flex-col items-center gap-4 rounded-[15px]">
          <MailIcon />
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-white/50 font-medium">No Invites Sent</p>
            <p className="text-sm text-white/50 font-medium">
              You can invite subscribers, contacts and past guests to the event.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-2xl font-medium text-[#009442]">
          1 <span className="text-sm">guest</span>
        </p>
        <ProgressBar width={892} />
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 bg-[#009442] rounded-full"></div>
          <p className="text-sm text-[#009442] font-medium">1 going</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">
            Recent Registrations
          </h3>

          <button className="bg-white/10 hover:bg-white/20 text-white/60 p-2.5 rounded-[10px] flex items-center gap-2.5">
            <span className="text-sm font-medium">All Guests</span>
            <ShareArrowIcon />
          </button>
        </div>

        <div className="bg-white/10 border flex-1 border-white/10 p-5 flex items-center justify-between gap-4 rounded-[15px]">
          <div className="flex gap-2.5 items-center">
            <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center">
              <UserCircle size={30} />
            </div>
            <p className="text-white font-medium text-sm">
              John Deo{" "}
              <span className="text-white/50 text-xs">johndeo@gmail.com</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#00944233] p-2.5 px-8 rounded-full text-xs text-[#009442] font-medium">
              Going
            </div>
            <p className="text-white/50 text-sm font-medium">Yesterday</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-white">Hosts</h3>
            <p className="text-white/60 text-sm font-medium">
              Add hosts, special guests, and event managers.
            </p>
          </div>

          <button className="bg-white/10 hover:bg-white/20 text-white/60 p-2.5 rounded-[10px] flex items-center gap-2.5">
            <PlusIcon size={15} />
            <span className="text-sm font-medium">Add Host</span>
          </button>
        </div>

        <div className="bg-white/10 border flex-1 border-white/10 p-5 flex items-center justify-between gap-4 rounded-[15px]">
          <div className="flex gap-2.5 items-center">
            <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center">
              <UserCircle size={30} />
            </div>
            <p className="text-white font-medium text-sm">
              John Deo{" "}
              <span className="text-white/50 text-xs">johndeo@gmail.com</span>
            </p>
            <div className="bg-[#00944233] p-2.5 px-8 rounded-full text-xs text-[#009442] font-medium">
              Creator
            </div>
          </div>

          <div className="flex items-center gap-4 text-white/50">
            <p className=" text-sm font-medium">Yesterday</p>
            <button>
              <PencilIcon size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
