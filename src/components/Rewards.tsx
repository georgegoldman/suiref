// src/pages/Rewards.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Transaction } from "@mysten/sui/transactions";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { useLeaderboard, useSessionData } from "../session-data";
import { useGeofence, distanceMeters } from "../hooks/useGeofence"; // ⬅ geo-fence hook

// --- ENV ---
// e.g. in .env: VITE_PACKAGE_ID=0x471e...  VITE_PROFILE_POOL_ID=0x...  VITE_REFERRAL_POOL_ID=0x...
const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID as string;
const PROFILE_POOL_ID = import.meta.env.VITE_SHARED_OBJECT_ID as string;
const REFERRAL_POOL_ID = import.meta.env.VITE_REFERRAL_POOL_ID as string;

// Venue coordinates: 371 Borno Way, Alagomeji-Yaba, Lagos (approx)
const TARGET = { lat: 6.50837, lng: 3.384247 };
const RADIUS_M = 250; // how close they must be to "claim" (edit as you like)

const km = (m?: number | null) =>
  typeof m === "number" ? (m / 1000).toFixed(2) : undefined;

// helpers
function shortAddr(addr?: string | null) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";
}
function medal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}

export default function Rewards() {
  const account = useCurrentAccount();
  const { loading, error, refresh } = useSessionData();
  const leaderboard = useLeaderboard();
  const { mutateAsync: signAndExecute, isPending } = useSignAndExecuteTransaction();

  // 🔒 Geo-fence: only allow claiming while physically near the venue
  const {
    inside,       // true when inside radius
    checking,     // true while checking GPS
    error: geoErr,
    distance,
    accuracy,
    refresh: recheckLocation,
  } = useGeofence(TARGET, RADIUS_M);

  // form state
  const [referrerUsername, setReferrerUsername] = React.useState("");
  const [submitErr, setSubmitErr] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);

  const missingEnv = !PACKAGE_ID || !PROFILE_POOL_ID || !REFERRAL_POOL_ID;

    // Promise wrapper for an immediate fresh fix (ignores cached positions)
  const getCurrentPositionOnce = React.useCallback(() => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("Geolocation not supported."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitErr(null);
    setOk(null);

    if (!account?.address) {
      setSubmitErr("Connect your wallet first.");
      return;
    }
    if (missingEnv) {
      setSubmitErr("Missing env: VITE_PACKAGE_ID / VITE_PROFILE_POOL_ID / VITE_REFERRAL_POOL_ID");
      return;
    }

    if (!inside) {
      setSubmitErr("You must be at the venue to claim.");
      return;
    }

    

        try {
      const pos = await getCurrentPositionOnce();
      const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const d = distanceMeters(here, TARGET);
      if (d > RADIUS_M) {
        setSubmitErr(`You must be at the venue to acknwoledge the referral. Distance ≈ ${km(d)} km`);
        return;
      }
    } catch (geoErr: any) {
      setSubmitErr(`Location check failed: ${geoErr?.message || geoErr}`);
      return;
    }

    const username = referrerUsername.trim();
    if (!username) {
      setSubmitErr("Please enter the referrer username.");
      return;
    }

    try {
      const tx = new Transaction();
      // entry fun add_referral_to_record(username: String, ref_pool: &mut ReferralPool, profile_pool: &mut ProfilePool, ctx: &mut TxContext)
      tx.moveCall({
        target: `${PACKAGE_ID}::suiref::add_referral_to_record`,
        arguments: [
          tx.pure.string(username),
          tx.object(REFERRAL_POOL_ID),
          tx.object(PROFILE_POOL_ID),
        ],
      });

      const res = await signAndExecute({ transaction: tx });
      console.log("add_referral_to_record result:", res);
      setOk("Referral recorded successfully 🎉");
      setReferrerUsername("");

      // re-fetch on-chain objects (updates leaderboard etc.)
      await refresh();
    } catch (err: any) {
      const msg = String(err?.message ?? err);
      if (msg.includes("MoveAbort")) {
        // contract codes:
        // 0000 -> ERR_DUPLICATE_RECORD
        // 0002 -> ERR_REFERRER_NOT_FOUND
        if (msg.includes("code: 2")) {
          setSubmitErr("You must create your profile before adding a referral.");
        } else if (msg.includes("code: 0")) {
          setSubmitErr("This referral already exists.");
        } else {
          setSubmitErr(`Transaction failed: ${msg}`);
        }
      } else {
        setSubmitErr(msg);
      }
      console.error(err);
    }
  };

  const inputDisabled =
    !account?.address || isPending || missingEnv || checking || !inside;
  const submitDisabled = inputDisabled;

  return (
    <div className="flex-1 p-4 sm:p-6">
      <h1 className="text-white text-2xl font-bold">Rewards</h1>
      <p className="text-white/70 text-sm mt-1">
        Add a referral and view the leaderboard.
      </p>

      {/* Grid: form (left) + leaderboard (right) */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* ---- Add Referral (Claim) Form ---- */}
        <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10">
          <h2 className="text-white text-lg font-semibold mb-3">Add Referral</h2>

          {missingEnv && (
            <div className="mb-3 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-300 text-sm">
              Missing env: <code>VITE_PACKAGE_ID</code>, <code>VITE_PROFILE_POOL_ID</code>, <code>VITE_REFERRAL_POOL_ID</code>
            </div>
          )}

          {!account?.address && (
            <div className="mb-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-3 text-yellow-200 text-sm">
              Connect your wallet to submit a referral.
            </div>
          )}

          {/* Geo-fence status */}
          <div className="mb-3 text-xs text-white/70">
            <div>
              Venue: <span className="text-white/90">371 Borno Way, Alagomeji-Yaba</span> (within {RADIUS_M} m)
            </div>
            {checking && <div>Checking your location…</div>}
            {!checking && inside === false && (
              <div className="mt-1">
                <span className="text-amber-300">You’re outside the venue radius — claiming is locked.</span>
                {typeof distance === "number" && (
                  <span>
                    {" "}
                    Distance: {km(distance)} km
                    {typeof accuracy === "number" ? ` (±${km(accuracy)} km)` : ""}
                  </span>
                )}
                {geoErr && <span className="text-red-400"> • {geoErr}</span>}
                <button
                  type="button"
                  onClick={recheckLocation}
                  className="ml-2 px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                >
                  Recheck
                </button>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block">
              <span className="text-white/80 text-sm">Referrer Username</span>
              <input
                type="text"
                className="mt-1 w-full rounded px-3 py-2 bg-white/10 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="e.g. suigold"
                value={referrerUsername}
                onChange={(e) => setReferrerUsername(e.target.value)}
                minLength={3}
                maxLength={40}
                required
                disabled={inputDisabled}  // ⬅ frozen unless at venue
                title={!inside ? "You must be at the venue to claim." : ""}
              />
            </label>

            {submitErr && <div className="text-red-400 text-sm">{submitErr}</div>}
            {ok && <div className="text-green-400 text-sm">{ok}</div>}

            <button
              type="submit"
              disabled={submitDisabled}
              className="inline-flex items-center justify-center rounded bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 text-white px-4 py-2"
            >
              {isPending ? "Submitting…" : "Add Referral"}
            </button>
          </form>

          <p className="text-white/50 text-xs mt-3">
            Tip: You’ll need location permission (HTTPS or localhost) and a profile; the contract checks duplicates and bumps the referrer’s ranking.
          </p>
        </div>

        {/* ---- Leaderboard Table ---- */}
        <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10">
          <h2 className="text-white text-lg font-semibold mb-3">Leaderboard</h2>

          {loading && <div className="text-white/80">Loading leaderboard…</div>}
          {error && <div className="text-red-400">Error: {error}</div>}

          {!loading && !error && (
            <div className="w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10">
                    <th className="text-left py-3 px-4 text-white/80 font-medium text-sm rounded-l-[10px]">#</th>
                    <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">User</th>
                    <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Score</th>
                    <th className="text-left py-3 px-4 text-white/80 font-medium text-sm rounded-r-[10px] hidden sm:table-cell">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((row, idx) => {
                    const rank = idx + 1;
                    const name = row.username || shortAddr(row.address);
                    const avatar =
                      row.avatar ||
                      `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
                        row.username || row.address || `user-${idx}`
                      )}&size=40&radius=50`;
                    const key = `${row.username ?? ""}-${row.address ?? idx}`;
                    return (
                      <tr key={key} className="border-b border-white/5">
                        <td className="py-3 px-4 text-white/90 font-semibold">
                          <span className="inline-block w-6 text-center">
                            {medal(rank) ?? rank}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={avatar}
                              alt={name}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                const el = e.currentTarget as HTMLImageElement;
                                if (el.src.includes("/svg")) el.src = el.src.replace("/svg", "/png");
                              }}
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="flex flex-col">
                              <span className="text-white/90 font-medium">{name}</span>
                              {row.username && row.address && (
                                <span className="text-white/50 text-xs">
                                  {shortAddr(row.address)}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white/90 font-semibold">{row.score}</td>
                        <td className="py-3 px-4 text-white/70 text-sm hidden sm:table-cell">
                          {shortAddr(row.address)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {!leaderboard.length && (
                <div className="text-white/60 text-sm mt-4">No referrals yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
