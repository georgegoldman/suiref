/* eslint-disable react-refresh/only-export-components */
import { useCurrentAccount } from "@mysten/dapp-kit";
import React from "react";
import { fetchSharedObject } from "./lib/api";

/* eslint-disable @typescript-eslint/no-explicit-any */
type SessionData = {
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

    const value: SessionData = React.useMemo(
        () => ({ sharedObject, loading, error, refresh: load }),
        [sharedObject, loading, error, load]
    );

    return <SessionDataCtx.Provider value={value}>{children}</SessionDataCtx.Provider>;
};

export const useSessionData = () => {
    const ctx = React.useContext(SessionDataCtx);
    if (!ctx) throw new Error("useSessionData must be used within <SessionDataProvider>");
    return ctx;
}