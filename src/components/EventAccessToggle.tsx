// src/admin/components/EventAccessToggle.tsx
import React from "react";

type AccessType = "free" | "fixed_price" | "statement" | "nft_gate";

export type EventAccess = {
  type: AccessType;
  // Only when type = "fixed_price"
  suiAmount?: number;          // in SUI
  // Only when type = "statement"
  statement?: string;          // free text requirement
  // Only when type = "nft_gate"
  nftCollection?: string;      // collection/contract id or name
  nftNote?: string;            // optional note (e.g., "any 1 NFT from collection")
};

export default function EventAccessToggle({
  value,
  onChange,
}: {
  value: EventAccess | undefined;
  onChange: (v: EventAccess) => void;
}) {
  const [free, setFree] = React.useState(value?.type === "free" || !value);
  const [type, setType] = React.useState<AccessType>(value?.type ?? "free");
  const [suiAmount, setSuiAmount] = React.useState<number | undefined>(value?.suiAmount);
  const [statement, setStatement] = React.useState<string>(value?.statement ?? "");
  const [nftCollection, setNftCollection] = React.useState<string>(value?.nftCollection ?? "");
  const [nftNote, setNftNote] = React.useState<string>(value?.nftNote ?? "");
  const [err, setErr] = React.useState<string>("");

  // push up whenever local changes
  React.useEffect(() => {
    if (free) {
      onChange({ type: "free" });
      return;
    }
    if (type === "fixed_price") {
      onChange({ type, suiAmount: suiAmount });
      return;
    }
    if (type === "statement") {
      onChange({ type, statement });
      return;
    }
    if (type === "nft_gate") {
      onChange({ type, nftCollection, nftNote: nftNote || undefined });
      return;
    }
  }, [free, type, suiAmount, statement, nftCollection, nftNote, onChange]);

  const toggleFree = (checked: boolean) => {
    setFree(checked);
    setErr("");
    if (checked) {
      setType("free");
    } else {
      setType("fixed_price"); // default when turning off free
    }
  };

  return (
    <div className="rounded-2xl bg-[#0B183F] ring-1 ring-white/10 p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white/80 text-base" aria-hidden>🔒</span>
          <div className="flex flex-col">
            <span className="text-white/90 text-sm font-medium">Access</span>
            <span className="text-white/50 text-[12px]">Toggle free or set an entry requirement</span>
          </div>
        </div>
      </div>

      {/* Free Toggle */}
      <label className="mt-4 flex items-center justify-between gap-4 rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2">
        <div className="flex flex-col">
          <span className="text-white/90 text-sm font-medium">Free event</span>
          <span className="text-white/50 text-[12px]">Turn off to require SUI or NFT</span>
        </div>
        <input
          type="checkbox"
          checked={free}
          onChange={(e) => toggleFree(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={`
            relative h-6 w-11 rounded-full transition
            before:absolute before:top-1/2 before:-translate-y-1/2 before:left-1
            before:h-5 before:w-5 before:rounded-full before:bg-white before:transition
            ${free ? "bg-green-500/70 before:translate-x-5" : "bg-white/20"}
          `}
        />
      </label>

      {/* Requirements panel (only when not free) */}
      {!free && (
        <div className="mt-4 space-y-3">
          {/* Type chooser */}
          <div className="inline-flex rounded-lg ring-1 ring-white/10 bg-white/5 p-1">
            {(["fixed_price", "statement", "nft_gate"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setType(t); setErr(""); }}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  type === t ? "bg-white/15 text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {t === "fixed_price" ? "Fixed SUI" : t === "statement" ? "Statement" : "NFT gate"}
              </button>
            ))}
          </div>

          {/* Fixed price */}
          {type === "fixed_price" && (
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3">
              <label className="block">
                <div className="text-white/70 text-sm mb-1">Amount (SUI)</div>
                <input
                  inputMode="decimal"
                  placeholder="e.g. 2.5"
                  value={suiAmount ?? ""}
                  onChange={(e) =>
                    setSuiAmount(e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  className="w-full bg-white/10 text-white placeholder:text-white/40 rounded-lg px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
                />
              </label>
              <p className="text-white/50 text-xs">
                Attendee must pay this amount in SUI to register/attend.
              </p>
            </div>
          )}

          {/* Statement requirement */}
          {type === "statement" && (
            <label className="block">
              <div className="text-white/70 text-sm mb-1">Requirement statement</div>
              <input
                placeholder="e.g., Must have ≥ 5 SUI in wallet"
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                className="w-full bg-white/10 text-white placeholder:text-white/40 rounded-lg px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
              />
              <p className="text-white/50 text-xs mt-1">
                This is shown to users; enforcement is up to your on-chain/off-chain checks.
              </p>
            </label>
          )}

          {/* NFT gate */}
          {type === "nft_gate" && (
            <div className="grid grid-cols-1 sm:grid-cols-[1fr] gap-3">
              <label className="block">
                <div className="text-white/70 text-sm mb-1">NFT collection / contract</div>
                <input
                  placeholder="Collection name or package/object id"
                  value={nftCollection}
                  onChange={(e) => setNftCollection(e.target.value)}
                  className="w-full bg-white/10 text-white placeholder:text-white/40 rounded-lg px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
                />
              </label>
              <label className="block">
                <div className="text-white/70 text-sm mb-1">Note (optional)</div>
                <input
                  placeholder="e.g., Any 1 NFT from this collection"
                  value={nftNote}
                  onChange={(e) => setNftNote(e.target.value)}
                  className="w-full bg-white/10 text-white placeholder:text-white/40 rounded-lg px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
                />
              </label>
              <p className="text-white/50 text-xs">
                You can enforce this in your Move module or server before issuing tickets.
              </p>
            </div>
          )}

          {err && <p className="text-[12px] text-red-300">{err}</p>}
        </div>
      )}
    </div>
  );
}
