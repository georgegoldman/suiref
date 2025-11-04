// src/admin/components/EventTitleInput.tsx
import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  max?: number;
};

export default function EventTitleInput({
  value,
  onChange,
  placeholder = "Event Name", // spaced like your mock
  max = 120,
}: Props) {
  const [count, setCount] = React.useState(value.length);

  return (
    <div className="relative mb-8">
      {/* The heading-like input */}
      <input
        value={value}
        onChange={(e) => {
          const v = e.target.value.slice(0, max);
          setCount(v.length);
          onChange(v);
        }}
        onKeyDown={(e) => {
          // behave like a title field: Enter blurs instead of adding a newline
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        spellCheck={false}
        maxLength={max}
        className="
          peer w-full bg-transparent
          text-[32px] sm:text-[40px] lg:text-[48px]
          font-extrabold leading-tight tracking-[-0.01em]
          text-white placeholder:text-white/25
          outline-none border-none
          selection:bg-white/20
        "
        placeholder={placeholder}
      />

      {/* subtle bottom hairline */}
      <span className="pointer-events-none absolute left-0 right-0 -bottom-1 h-px bg-white/10" />

      {/* animated focus underline */}
      <span
        className="
          pointer-events-none absolute left-0 -bottom-1 h-[2px] w-0
          bg-[#4DA2FD] transition-all duration-300
          peer-focus:w-full
        "
      />

      {/* optional character counter */}
      <span className="absolute -bottom-6 right-0 text-[11px] text-white/40">
        {count}/{max}
      </span>
    </div>
  );
}
