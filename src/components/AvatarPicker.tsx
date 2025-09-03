import React from "react";

type Format = "svg" | "png";

const DICEBEAR_BASE = "https://api.dicebear.com/7.x";
const STYLE = "adventurer" as const; // locked to adventurer

// Build a DiceBear URL (v7)
function avatarUrl(seed: string, format: Format, size = 128) {
  return `${DICEBEAR_BASE}/${STYLE}/${format}?seed=${encodeURIComponent(seed)}&size=${size}&radius=50`;
}

function makeSeeds(count = 24) {
  const a = [
    "brave","cosmic","lucky","fuzzy","sunny","storm","silver","neon","shadow",
    "retro","pixel","astro","sneaky","fancy","ember","frost","turbo","sugar",
    "delta","raven","ninja","vivid","zen","prime"
  ];
  const b = [
    "tiger","panda","koala","sloth","otter","falcon","owl","badger","yak",
    "lion","eagle","lynx","squid","fox","ape","mole","gecko","yak2","zebra",
    "rhino","bison","boar","dodo","ibis"
  ];
  const seeds: string[] = [];
  for (let i = 0; i < count; i++) {
    const left = a[i % a.length];
    const right = b[(i * 7) % b.length];
    seeds.push(`${left}-${right}-${i + 1}`);
  }
  return seeds;
}

export function AvatarPicker({
  value,
  onChange,
  format = "svg",
  size = 128,
}: {
  value?: string;                // currently selected URL
  onChange: (url: string) => void;
  format?: Format;
  size?: number;
}) {
  const [seeds] = React.useState<string[]>(() => makeSeeds());
  const urls = React.useMemo(() => seeds.map((s) => avatarUrl(s, format, size)), [seeds, format, size]);


  return (
    <div className="space-y-3">
      {/* <div className="flex items-center gap-2">
        <span className="text-white/80 text-sm">Style:</span>
        <span className="px-2 py-1 rounded bg-blue-600 text-white">adventurer</span>
        <button
          type="button"
          onClick={regenerate}
          className="ml-auto px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20"
          title="New set"
        >
          Shuffle
        </button>
      </div> */}

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {urls.map((u) => {
          const isSelected = value === u;
          return (
            <button
              type="button"
              key={u}
              onClick={() => onChange(u)}
              className={`rounded-xl p-1 bg-white/5 hover:bg-white/10 focus:outline-none ring-2 ${
                isSelected ? "ring-blue-500" : "ring-transparent"
              }`}
              title={u}
            >
              <img
                src={u}
                width={size}
                height={size}
                alt="avatar"
                loading="lazy"
                className="rounded-lg w-full h-auto"
                onError={(e) => {
                  // fallback to png if svg ever hiccups
                  if (u.includes("/svg")) {
                    (e.currentTarget as HTMLImageElement).src = u.replace("/svg", "/png");
                  }
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
