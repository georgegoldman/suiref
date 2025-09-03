/* eslint-disable react-refresh/only-export-components */
import { useCurrentAccount } from "@mysten/dapp-kit";
import React from "react";
import { fetchSharedObject } from "./lib/api";

type Profile  = {
    username: string | null;
    avatar: string | null;   // dicebear URL you stored in Move
    ranking: number;
    address: string | null;
    hasProfile: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type SessionData = {
    [x: string]: any;
    sharedObject?: any;
    loading: boolean;
    error?: string;
    refresh: () => Promise<void>;
};

const SessionDataCtx = React.createContext<SessionData | undefined>(undefined);

export const SessionDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const account = useCurrentAccount();
    const [sharedObject, setSharedObject] = React.useState<any>();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>();
    const objectId = import.meta.env.VITE_SHARED_OBJECT_ID as string;

    const load = React.useCallback(async () => {
        if (!account?.address || !objectId) return;
        setLoading(true);
        setError(undefined);
        try {
            const obj = await fetchSharedObject(objectId);
            setSharedObject(obj);
        } catch (e:any) {
            setError(e?.message ?? "Failed to fetch shared object");
        } finally {
            setLoading(false);
        }
    }, [account?.address, objectId]);

    // Fetch when user logs in / account changes; clear on logout.
    React.useEffect(() => {
        if (account?.address) void load();
        else {
            setSharedObject(undefined);
            setError(undefined);
            setLoading(false);
        }
    }, [account?.address, load]);

      // ---- Compute myProfile from sharedObject + account ----
        const poolList: any[] = React.useMemo(() => {
            const content = (sharedObject as any)?.data?.content;
            if (!content || content.dataType !== "moveObject") return [];
            const list = content.fields?.pool_list;
            return Array.isArray(list) ? list : [];
        }, [sharedObject]);

        const myProfile: any | null = React.useMemo(() => {
            const addr = account?.address?.toLowerCase();
            if (!addr) return null;
            return (
            poolList.find(
                (it: any) =>
                typeof it?.fields?.owner === "string" &&
                it.fields.owner.toLowerCase() === addr
            ) ?? null
            );
        }, [poolList, account?.address]);

        const profile: Profile = React.useMemo(
            () => ({
            username: myProfile?.fields?.username ?? null,
            avatar: myProfile?.fields?.url ?? null,
            ranking: Number(myProfile?.fields?.ranking ?? 0),
            address: account?.address ?? null,
            hasProfile: !!myProfile,
            }),
            [myProfile, account?.address]
        );

    const value: SessionData = React.useMemo(
        () => ({ sharedObject, loading, error, refresh: load, profile }),
        [sharedObject, loading, error, load, profile]
    );

    return <SessionDataCtx.Provider value={value}>{children}</SessionDataCtx.Provider>;
};

export const useSessionData = () => {
    const ctx = React.useContext(SessionDataCtx);
    if (!ctx) throw new Error("useSessionData must be used within <SessionDataProvider>");
    return ctx;
}

// Convenience hook for just the user profile
export const useUser = () => {
  return useSessionData().profile;
};