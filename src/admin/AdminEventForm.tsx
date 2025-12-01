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
import { ImageUploadCard } from "../components/ImageUploadCard";
import { ThemeSelector, themes, type Theme } from "../components/ThemeSelector";
import { EventPreview } from "../components/EventPreview";
import { useCreateEvent } from "../mutations/useCreateEvent";

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
  const [requireApproval, setRequireApproval] = React.useState(false);

  // Event cover image (separate from theme)
  const [eventImage, setEventImage] = React.useState<string | null>(null);

  // Create event mutation
  const createEventMutation = useCreateEvent();

  // Theme customization states
  const [selectedTheme, setSelectedTheme] = React.useState<Theme>(themes[0]);
  const [themeColor, setThemeColor] = React.useState<string>(
    themes[0].defaultColor
  );
  const [themeFont, setThemeFont] = React.useState<string>("Geist Mono");
  const [displayMode, setDisplayMode] = React.useState<
    "auto" | "light" | "dark"
  >("auto");
  const [isThemeExpanded, setIsThemeExpanded] = React.useState(false);

  // Load default image on mount
  React.useEffect(() => {
    if (!eventImage) {
      // Set a default image from unsplash
      setEventImage(
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // shared card style (matches your dark UI, compact & consistent)
  const card = "bg-[#0B183F] rounded-xl ring-1 ring-white/10 px-4 py-3";

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      alert("Please enter an event name");
      return;
    }

    if (!description?.trim()) {
      alert("Please enter an event description");
      return;
    }

    if (!location) {
      alert("Please select an event location");
      return;
    }

    if (!range.start || !range.end) {
      alert("Please select event start and end dates");
      return;
    }

    if (!eventImage) {
      alert("Please select an event image");
      return;
    }

    // Map location to string
    let locationString = "";
    if (location.type === "physical") {
      const parts = [
        location.venue,
        location.address,
        location.city,
        location.state,
        location.country,
      ].filter(Boolean);
      locationString = parts.join(", ") || "Physical location";
    } else {
      locationString = location.url || location.platform || "Virtual location";
    }

    // Map capacity to number
    // Note: API expects a number. For unlimited, we send 0 (backend should handle this)
    const capacityValue = capacity?.mode === "limited" ? capacity.max : 0;

    // Prepare request body
    const requestBody = {
      name: title.trim(),
      eventLocaction: locationString, // Note: API has typo "Locaction"
      description: description.trim(),
      free: access.type === "free",
      requireApproval,
      capacity: capacityValue,
      imageUrl: eventImage,
      // Additional fields from form (not in current API spec)
      startDate: range.start.toISOString(),
      endDate: range.end.toISOString(),
      timezone: range.tz,
      visibility,
    };

    try {
      await createEventMutation.mutateAsync(requestBody);
      // Success - you can add redirect or success message here
      alert("Event created successfully!");
      // Optionally reset form or redirect
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-[1120px] px-4 lg:px-6 py-6">
      {/* Make the grid fill viewport height on large screens for proper scrolling math */}
      <div className="grid gap-8 lg:grid-cols-[minmax(300px,350px)_minmax(520px,1fr)] lg:min-h-[calc(100vh-4rem)] items-start">
        {/* LEFT: canvas + theme (sticky) */}
        <aside className="space-y-4 lg:sticky lg:top-16 self-start">
          {/* Event Preview with Theme - wrapped in ImageUploadCard to handle clicks */}
          <ImageUploadCard
            selectedImage={eventImage}
            onImageChange={setEventImage}
          >
            <EventPreview
              theme={selectedTheme}
              color={themeColor}
              font={themeFont}
              eventImage={eventImage}
            />
          </ImageUploadCard>

          {/* Theme Customization */}
          <ThemeSelector
            selectedTheme={selectedTheme}
            onThemeChange={setSelectedTheme}
            isExpanded={isThemeExpanded}
            onToggleExpanded={() => setIsThemeExpanded(!isThemeExpanded)}
            selectedColor={themeColor}
            onColorChange={setThemeColor}
            selectedFont={themeFont}
            onFontChange={setThemeFont}
            displayMode={displayMode}
            onDisplayModeChange={setDisplayMode}
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
          <div className={`${card} flex items-center justify-between`}>
            <span className="text-white/90">Tickets</span>
            {/* Keep the control small; avoid nesting full-width sections here */}
            <div className="shrink-0">
              <EventAccessToggle value={access} onChange={setAccess} />
            </div>
          </div>
          {/* Required approval */}
          <div className={`${card} flex items-center justify-between`}>
            <span className="text-white/90">Required Approval</span>
            <input
              type="checkbox"
              checked={requireApproval}
              onChange={(e) => setRequireApproval(e.target.checked)}
              className="h-4 w-4 accent-[#4DA2FD]"
            />
          </div>

          {/* Capacity */}
          <div className={card}>
            <EventCapacityField value={capacity} onChange={setCapacity} />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createEventMutation.isPending}
              className="w-full h-12 rounded-xl bg-[#4DA2FD] hover:bg-[#66B2FF] disabled:bg-[#4DA2FD]/50 disabled:cursor-not-allowed text-[#031335] font-semibold shadow-[0_8px_28px_rgba(77,162,253,0.35)]"
            >
              {createEventMutation.isPending ? "Creating..." : "Create Event"}
            </button>
            {createEventMutation.isError && (
              <p className="mt-2 text-sm text-red-400">
                Error:{" "}
                {createEventMutation.error instanceof Error
                  ? createEventMutation.error.message
                  : "Failed to create event"}
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}