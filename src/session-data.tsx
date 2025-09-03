// src/session-data.tsx
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { fetchSharedObject } from "./lib/api";

export type Profile = {
  username: string | null;
  avatar: string | null;   // dicebear URL stored on-chain
  ranking: number;
  address: string | null;
  hasProfile: boolean;
};

export type LeaderEntry = {
  username: string;
  score: number;             // ranking or referral count
  avatar: string | null;
  address: string | null;
};

type SessionData = {
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;

  // raw objects (optional to use directly)
  profileObject?: any;       // ProfilePool move object
  referralObject?: any;      // ReferralPool move object

  // derived
  profile: Profile;          // current user (if logged in)
  leaderboard: LeaderEntry[];// all users sorted by score desc
  top3: LeaderEntry[];       // first, second, third
};

const SessionDataCtx = React.createContext<SessionData | undefined>(undefined);

const PROFILE_POOL_ID =
  (import.meta.env.VITE_PROFILE_POOL_ID as string | undefined) ??
  (import.meta.env.VITE_SHARED_OBJECT_ID as string | undefined);
const REFERRAL_POOL_ID = import.meta.env.VITE_REFERRAL_POOL_ID as
  | string
  | undefined;

function getMoveFields(obj: any) {
  const content = obj?.data?.content;
  if (!content || content.dataType !== "moveObject") return undefined;
  return content.fields;
}

export const SessionDataProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const account = useCurrentAccount();

  const [profileObject, setProfileObject] = React.useState<any>();
  const [referralObject, setReferralObject] = React.useState<any>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const load = React.useCallback(async () => {
    if (!PROFILE_POOL_ID) {
      setError("Missing VITE_PROFILE_POOL_ID (or VITE_SHARED_OBJECT_ID)");
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      const [profileObj, referralObj] = await Promise.all([
        fetchSharedObject(PROFILE_POOL_ID),
        REFERRAL_POOL_ID ? fetchSharedObject(REFERRAL_POOL_ID) : Promise.resolve(undefined),
      ]);
      setProfileObject(profileObj);
      setReferralObject(referralObj);
    } catch (e: any) {
      setError(e?.message ?? "Failed to fetch on-chain objects");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and whenever IDs change
  React.useEffect(() => {
    void load();
  }, [load]);

  // ---------- derive pool lists ----------
  const profilePoolList: any[] = React.useMemo(() => {
    const fields = getMoveFields(profileObject);
    const list = fields?.pool_list;
    return Array.isArray(list) ? list : [];
  }, [profileObject]);

  const referralList: any[] = React.useMemo(() => {
    const fields = getMoveFields(referralObject);
    const list = fields?.referal_list; // NOTE: contract uses "referal_list" (one 'r')
    return Array.isArray(list) ? list : [];
  }, [referralObject]);

  // ---------- current user's profile ----------
  const myProfileRaw: any | null = React.useMemo(() => {
    const addr = account?.address?.toLowerCase();
    if (!addr) return null;
    return (
      profilePoolList.find(
        (it: any) =>
          typeof it?.fields?.owner === "string" &&
          it.fields.owner.toLowerCase() === addr
      ) ?? null
    );
  }, [profilePoolList, account?.address]);

  const profile: Profile = React.useMemo(
    () => ({
      username: myProfileRaw?.fields?.username ?? null,
      avatar: myProfileRaw?.fields?.url ?? null,
      ranking: Number(myProfileRaw?.fields?.ranking ?? 0),
      address: account?.address ?? null,
      hasProfile: !!myProfileRaw,
    }),
    [myProfileRaw, account?.address]
  );

  // ---------- leaderboard from profiles (preferred) ----------
  const leaderboardFromProfiles: LeaderEntry[] = React.useMemo(() => {
    const rows: LeaderEntry[] = profilePoolList.map((it: any) => ({
      username: String(it?.fields?.username ?? ""),
      score: Number(it?.fields?.ranking ?? 0),
      avatar: (it?.fields?.url as string) ?? null,
      address: (it?.fields?.owner as string) ?? null,
    }));
    return rows
      .filter((r) => r.username) // keep named users
      .sort((a, b) => b.score - a.score);
  }, [profilePoolList]);

  // ---------- leaderboard from referrals (fallback) ----------
  const leaderboardFromReferrals: LeaderEntry[] = React.useMemo(() => {
    if (!referralList.length) return [];
    const counts = new Map<string, number>();
    for (const it of referralList) {
      const referrer = String(it?.fields?.referrer ?? "");
      if (!referrer) continue;
      counts.set(referrer, (counts.get(referrer) ?? 0) + 1);
    }
    // join with profile list to get avatar/address where possible
    const byUser = new Map<string, any>();
    for (const p of profilePoolList) {
      const u = String(p?.fields?.username ?? "");
      if (!u) continue;
      byUser.set(u, p);
    }
    const rows: LeaderEntry[] = Array.from(counts.entries()).map(
      ([username, score]) => {
        const p = byUser.get(username);
        return {
          username,
          score,
          avatar: p?.fields?.url ?? null,
          address: p?.fields?.owner ?? null,
        };
      }
    );
    return rows.sort((a, b) => b.score - a.score);
  }, [referralList, profilePoolList]);

  // ---------- choose source (prefer on-chain ranking) ----------
  const leaderboard: LeaderEntry[] =
    leaderboardFromProfiles.length > 0
      ? leaderboardFromProfiles
      : leaderboardFromReferrals;

  const top3: LeaderEntry[] = React.useMemo(
    () => leaderboard.slice(0, 3),
    [leaderboard]
  );

  const value: SessionData = React.useMemo(
    () => ({
      loading,
      error,
      refresh: load,

      profileObject: profileObject,
      referralObject: referralObject,

      profile,
      leaderboard,
      top3,
    }),
    [loading, error, load, profileObject, referralObject, profile, leaderboard, top3]
  );

  return (
    <SessionDataCtx.Provider value={value}>
      {children}
    </SessionDataCtx.Provider>
  );
};

export const useSessionData = () => {
  const ctx = React.useContext(SessionDataCtx);
  if (!ctx) throw new Error("useSessionData must be used within <SessionDataProvider>");
  return ctx;
};

// Convenience hooks
export const useUser = () => useSessionData().profile;
export const useLeaderboard = () => useSessionData().leaderboard;
export const useTop3 = () => useSessionData().top3;
