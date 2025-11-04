// src/admin/AdminEventForm.tsx
import React from "react";
import VisibilitySelect from "../components/VisibilitySelect";
import EventDateRange from "../components/EventDateRange";
import EventLocationField, {
  type EventLocation,
} from "../components/EventLocationField";
import EventAccessToggle, {
  type EventAccess,
} from "../components/EventAccessToggle";
import EventCapacityField, {
  type EventCapacity,
} from "../components/EventCapacityField";
import EventDescriptionField from "../components/EventDescriptionField";
import EventTitleInput from "../components/EventTitleInput";
import EventBannerUploader from "../components/EventBannerUploader";
import type { ThemeConfig, PresetImage } from "../lib/eventThemes";

export default function AdminEventForm() {
  const [visibility, setVisibility] = React.useState<
    "Public" | "Private" | "Unlisted"
  >("Public");
  const [title, setTitle] = React.useState("");
  const [range, setRange] = React.useState<{
    start?: Date | null;
    end?: Date | null;
    tz?: string;
  }>({});
  const [location, setLocation] = React.useState<EventLocation>();
  const [access, setAccess] = React.useState<EventAccess>({ type: "free" });
  const [capacity, setCapacity] = React.useState<EventCapacity | undefined>({
    mode: "unlimited",
  });
  const [description, setDescription] = React.useState<string | undefined>(
    undefined
  );

  // Banner state - will be used for form submission
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bannerData, setBannerData] = React.useState<{
    file?: File;
    preset?: PresetImage;
    theme: ThemeConfig;
  } | null>(null);

  // shared card style (matches your dark UI, compact & consistent)
  const card = "bg-[#0B183F] rounded-xl ring-1 ring-white/10 px-4 py-3";

  return (
    <div className="mx-auto max-w-[1120px] px-4 lg:px-6 py-6">
      {/* two columns: ~480px left, ~560px right */}
      <div className="grid gap-8 lg:grid-cols-[minmax(300px,350px)_minmax(520px,1fr)] items-start">
        {/* LEFT: canvas + theme (sticky) */}

        <aside className="space-y-4 lg:sticky lg:top-16 self-start">
          <EventBannerUploader
            // initialUrl={existingBannerUrl}
            onChange={(data) => {
              setBannerData(data);
              // upload to your storage (S3, Walrus, Cloudinary, etc.)
              console.log("Banner data:", data);
            }}
          />
        </aside>

        {/* RIGHT: form stack */}
        <main className="space-y-5">
          {/* top-right visibility selector */}
          <div className="flex justify-end">
            <VisibilitySelect value={visibility} onChange={setVisibility} />
          </div>

          {/* Title */}
          <section className="space-y-5">
            <EventTitleInput value={title} onChange={setTitle} />
          </section>

          {/* Description (compact chip that expands) */}
          <section className="space-y-5">
            <EventDescriptionField
              value={description}
              onChange={setDescription}
            />
          </section>

          {/* Date range row (your component renders the start/end chips + TZ pill) */}
          <section className="space-y-5">
            <EventDateRange value={range} onChange={setRange} />
          </section>

          {/* Location */}
          <section className="space-y-5">
            <EventLocationField value={location} onChange={setLocation} />
          </section>

          {/* Event Options label */}
          <div>
            <label className="text-white/70 text-sm">Event Options</label>
          </div>

          {/* Tickets / Access */}
          <div className={card + " flex items-center justify-between"}>
            <span className="text-white/90">Tickets</span>
            {/* Keep the control small; avoid nesting full-width sections here */}
            <div className="shrink-0">
              <EventAccessToggle value={access} onChange={setAccess} />
            </div>
          </div>

          {/* Required approval */}
          <div className={card + " flex items-center justify-between"}>
            <span className="text-white/90">Required Approval</span>
            <input type="checkbox" className="h-4 w-4 accent-[#4DA2FD]" />
          </div>

          {/* Capacity */}
          <div className={card}>
            <EventCapacityField value={capacity} onChange={setCapacity} />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button className="w-full h-12 rounded-xl bg-[#4DA2FD] hover:bg-[#66B2FF] text-[#031335] font-semibold shadow-[0_8px_28px_rgba(77,162,253,0.35)]">
              Create Event
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
