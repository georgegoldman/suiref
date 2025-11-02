import React from "react";

export default function EventDescriptionField({
  value,
  onChange,
  maxLength = 1000,
}: {
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  maxLength?: number;
}) {
  const [open, setOpen] = React.useState(Boolean(value));
  const [text, setText] = React.useState(value ?? "");
  const [err, setErr] = React.useState<string>("");

  const taRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    setText(value ?? "");
    setOpen(Boolean(value));
  }, [value]);

  // autosize textarea
  React.useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = ta.scrollHeight + "px";
  }, [text, open]);

  const trimmed = (s: string) => s.replace(/\s+/g, " ").trim();

  const save = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const t = trimmed(text);
    if (t.length > maxLength) {
      setErr(`Description is too long (max ${maxLength} characters).`);
      return;
    }
    setErr("");
    onChange(t || undefined);
    setOpen(false);
  };

  const clear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setErr("");
    setText("");
    onChange(undefined);
    setOpen(false);
  };

  const cancel = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setText(value ?? "");
    setErr("");
    setOpen(Boolean(value));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      save();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  const Summary = () => {
    if (!value) {
      return (
        <span className="text-white/50 text-[12px]">
          Add a short message for attendees
        </span>
      );
    }
    const oneLine = value.replace(/\s+/g, " ").trim();
    const cut = oneLine.length > 90 ? oneLine.slice(0, 90) + "…" : oneLine;
    return <span className="text-white/60 text-[12px]">{cut}</span>;
  };

  return (
    <div className="w-full">
      {!open ? (
        // Collapsed chip
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className="w-full rounded-xl bg-[#0B183F] ring-1 ring-white/10 px-3 py-2.5 text-left hover:bg-white/10 transition"
        >
          <div className="flex items-center gap-3">
            <span className="text-white/80 text-base" aria-hidden>
              📝
            </span>
            <div className="flex flex-col">
              <span className="text-white/90 text-sm font-medium">
                Add Description
              </span>
              <Summary />
            </div>
          </div>
        </button>
      ) : (
        // Expanded editor
        <div
          className="rounded-2xl bg-[#0B183F] ring-1 ring-white/10 p-3 sm:p-4"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onKeyDown={onKeyDown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-base" aria-hidden>
                📝
              </span>
              <div className="flex flex-col">
                <span className="text-white/90 text-sm font-medium">
                  Event Description
                </span>
                <span className="text-white/50 text-[12px]">
                  Describe the event (purpose, agenda, or who should join)
                </span>
              </div>
            </div>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={clear}
              className="text-white/60 hover:text-white text-sm px-2 py-1 rounded-lg hover:bg-white/10"
              title="Remove description"
            >
              Remove
            </button>
          </div>

          <div className="mt-4">
            <textarea
              ref={taRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Write a brief description…"
              rows={3}
              className="w-full bg-white/10 text-white placeholder:text-white/40 rounded-lg px-3 py-2 outline-none resize-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
              maxLength={maxLength + 5}
            />
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[12px] text-white/40">
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/10">Ctrl/⌘ + Enter</kbd>{" "}
                to save •{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/10">Esc</kbd> to cancel
              </span>
              <span
                className={`text-[12px] ${
                  trimmed(text).length > maxLength
                    ? "text-red-300"
                    : "text-white/50"
                }`}
              >
                {trimmed(text).length}/{maxLength}
              </span>
            </div>

            {err && <p className="mt-2 text-[12px] text-red-300">{err}</p>}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={cancel}
                className="text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={save}
                className="text-[#031335] bg-[#4DA2FD] hover:bg-[#66B2FF] text-sm font-semibold px-3 py-1.5 rounded-lg shadow-[0_6px_20px_rgba(77,162,253,0.35)]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
